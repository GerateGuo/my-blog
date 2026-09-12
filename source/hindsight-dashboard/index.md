---
title: Hindsight Dashboard：给 AI 记忆系统做一个单文件零依赖的管理面板
date: 2026-09-12 22:30:00
---

## 背景：自托管 Hindsight 缺一块可视化

我在本地跑 [Hindsight](https://github.com/vectorize-io/hindsight)（Vectorize 出的 AI Agent 记忆系统）来给 Hermes Agent 做长期记忆。用起来之后发现一个尴尬的地方——**能管理它的东西要么太底层，要么太重**：

| 手头有的 | 问题 |
|:----|:----|
| Swagger UI（`/docs`） | 适合逐个戳接口，不适合整体观察记忆库 |
| Prometheus 指标（`/metrics`） | 原始计数器，瞟一眼看不出什么 |
| 官方 Control Plane（独立 Next.js 前端） | 功能完整，但要装 Node 工具链，且偏通用 |

于是写了一个面板补中间这块空白：**一个 Python 文件、只用标准库、零依赖**，把它跑起来就能看全局。

![概览页](/images/hindsight/screenshot-overview.png)

## 功能

| 标签页 | 内容 |
|:----|:----|
| **概览** | 记忆/链接/实体/文档数量，按事实类型（world/experience/observation）堆叠的增长曲线，7/30/90 天切换 |
| **检索试验** | 跑 `recall` 并看到各路检索的打分明细（final / semantic / reranker），以及 `reflect` 综合推理出的答案 |
| **记忆** | 全文搜索、按事实类型筛选、分页浏览 |
| **实体图谱** | 实体搜索 + 不依赖任何图形库的 SVG 力导向共现图，点节点高亮邻居 |
| **用量** | 逐条 LLM 调用明细（阶段、模型、耗时、token、状态）、按天 token、按阶段累计调用 |
| **操作诊断** | 异步任务队列、失败操作一键重试、取消排队任务 |
| **配置** | 记忆库档案、mission、directives、保留与合并参数 |
| **官方界面** | 把官方 Control Plane 用 iframe 内嵌进来 |

![实体图谱](/images/hindsight/screenshot-graph.png)

![操作诊断](/images/hindsight/screenshot-ops.png)

## 几个实现上的取舍

**为什么用标准库的 `http.server` 而不是 FastAPI/Flask。** 这个面板的定位是"随手能跑"，`pip install` 一步都可能劝退人。它本质是个很薄的服务端代理加一个静态页面，`http.server` 完全够用，代价是要自己处理路由和 Cookie。

**为什么官方界面能内嵌。** 实测官方 Control Plane 没有下发 `X-Frame-Options` 或 CSP 的 `frame-ancestors`，所以可以直接 iframe 进去——不用在「自己写」和「用官方」之间二选一，一个入口既能看聚合视图，也能随时切到官方完整功能。

**力导向图是自己算的。** 不想为了一个图引入 D3 或 vis.js，就写了个几十行的力导向布局：节点两两斥力 + 边上的弹簧、中心引力，迭代 260 次后输出 SVG。45 个节点画出来完全够看。

**远程访问默认只读。** 面板里的「重试」「反思」按钮会真的消耗 LLM token，所以非本机来源的写操作默认直接 403；读操作（浏览、搜索、图谱、用量）才放开。本机 `127.0.0.1` 免密，远程需要访问密钥。

## 工程化：假数据 API + 自检 + CI

**`dev/mock_hindsight_api.py`** —— 一个返回合成数据的 Hindsight 替身。开发界面时不用真的部署 Hindsight，CI 里也靠它跑端到端测试。

**`dev/smoke_test.py`** —— 起 mock + 面板实例，把界面依赖的每个接口都打一遍，再对访问密钥的判定逻辑做单元校验，30 项检查，纯标准库，约 15 秒。

**GitHub Actions** —— Python 3.9 / 3.11 / 3.13 三版本矩阵跑自检，另有一个"凭据文件守卫"：一旦有 `.env`、密钥之类的文件被提交就直接失败。

自检脚本写完当天就回本了，抓出两个真 bug：

1. mock 的 `operations()` 边生成边按索引跳过，导致 `status=failed&limit=3` 永远返回 0 条，而且 offset 在过滤后会错位——**写假数据也要遵守真实分页语义**，否则测试根本覆盖不到真问题。
2. 面板 `/docs` 的重定向写死了服务端配置的 API 地址，从别的机器或手机点「Swagger」会被跳到**它自己的 localhost**，永远打不开。改成跟随请求方 `Host` 头之后正常了。

## 踩过的坑

- **代理环境变量**：本机开着 ClashX 时，如果不显式绕过代理，连 `localhost` 的请求也会被代理接管并返回 502，表现得像"面板连不上本地 API"。代码里用空的 `ProxyHandler` 构造成 opener 绕开；自己用 `curl` 测也要记得 `--noproxy '*'`。
- **Hindsight 本体的 API 没有认证**：这一点比面板的安全更值得强调。它的 REST 接口不校验任何身份，只要端口可达，同网络里任何人都能读走甚至清空全部记忆。正确做法是把它绑到回环地址（`HINDSIGHT_API_HOST=127.0.0.1`），让面板在本地代理访问。
- **`period` 会静默降级**：`memories-timeseries` 只认 `7d`/`30d`/`90d`，传 `14d` 不报错，悄悄按 `7d` 算。
- **launchd 缓存 plist**：macOS 上改完 LaunchAgent 的 plist，只跑 `launchctl kickstart -k` 不会重新加载环境变量，得 `bootout` + `bootstrap`。

## 相关链接

- **源码**：[github.com/GerateGuo/hindsight-dashboard](https://github.com/GerateGuo/hindsight-dashboard)
- **文档**：[English](https://github.com/GerateGuo/hindsight-dashboard#readme) / [简体中文](https://github.com/GerateGuo/hindsight-dashboard/blob/main/README.zh-CN.md)
- **许可证**：MIT，单文件，可以直接 `curl` 下来就跑：

```bash
curl -O https://raw.githubusercontent.com/GerateGuo/hindsight-dashboard/main/hindsight-dashboard.py
python3 hindsight-dashboard.py --api http://localhost:8888 --bank my-bank
# 打开 http://127.0.0.1:8990
```
