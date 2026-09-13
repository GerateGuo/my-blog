---
title: 大厂编码规范调研：我这学期要遵守的编码规则
date: 2026-09-13 10:43:32
categories:
  - 算法设计与分析
tags:
  - 编码规范
  - C++
  - 工程实践
---

这周的作业是去搜大公司的内部编码规范，然后列出自己这学期要遵守的规则。

我把 Google、Microsoft、阿里巴巴、Linux 内核、LLVM、C++ Core Guidelines、SEI CERT C、PEP 8、Airbnb 这几份**有公开原文**的规范读了一遍，下面的清单就是从里面长出来的。每条我都标了来源；标「自定」的是我自己加的红线，因为各家规范里根本没有这一项。

<!-- more -->

## 为什么要看别人的规范

算法课的代码很容易掉进一个陷阱：**只要能跑通就行**。单次实验、单文件、自己一个人写，怎么丑都不影响提交。

问题是这学期要写一整个学期，而且作业大概率是要回看的。三个月后回头看自己今天写的代码，如果命名是 `a`、`b`、`tmp2`，函数五十行不缩进，那就等于重写一遍。

所以规范的价值不是「优雅」，是**降低未来的阅读成本**——包括读自己写的。看完这几份原文之后我更加确信这一点，因为 Google 在开头就把话说得很直白：代码被读的时间远多于被写的时间，所以它明确选择「为读者的体验优化，而不是为写者的方便优化」。

## 这次读的原文

我只用**出处可查、仍在维护**的规范作为依据。网上流传着不少「华为 / 腾讯 / 字节内部编码规范.pdf」，我搜到过几份，但都查不到发布源头，版本也没有人说清，所以不作为依据——引一份来路不明的 PDF，不算调研。

| 规范 | 出方 | 链接 |
|:--|:--|:--|
| Google C++ Style Guide | Google | [google.github.io/styleguide/cppguide.html](https://google.github.io/styleguide/cppguide.html) |
| Google Engineering Practices（代码评审） | Google | [google.github.io/eng-practices](https://google.github.io/eng-practices/) |
| Google Python Style Guide | Google | [google.github.io/styleguide/pyguide.html](https://google.github.io/styleguide/pyguide.html) |
| C# Coding Conventions | Microsoft | [learn.microsoft.com](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions) |
| Microsoft REST API Guidelines | Microsoft | [github.com/microsoft/api-guidelines](https://github.com/microsoft/api-guidelines) |
| 阿里巴巴 Java 开发手册 / p3c | 阿里巴巴 | [github.com/alibaba/p3c](https://github.com/alibaba/p3c) |
| Linux kernel coding style | Linux 内核 | [kernel.org](https://www.kernel.org/doc/html/latest/process/coding-style.html) |
| LLVM Coding Standards | LLVM 项目 | [llvm.org/docs/CodingStandards.html](https://llvm.org/docs/CodingStandards.html) |
| C++ Core Guidelines | Stroustrup & Sutter | [isocpp.github.io](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) |
| SEI CERT C Coding Standard | CMU 软件工程研究所 | [wiki.sei.cmu.edu](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard) |
| PEP 8 | Python 官方 | [peps.python.org/pep-0008](https://peps.python.org/pep-0008/) |
| Airbnb JavaScript Style Guide | Airbnb | [github.com/airbnb/javascript](https://github.com/airbnb/javascript) |
| Google C++ 风格指南（中文版） | 社区翻译 | [zh-google-styleguide.readthedocs.io](https://zh-google-styleguide.readthedocs.io/en/latest/google-cpp-styleguide/) |

## 各家规范到底在关心什么

### Google C++：规范是为读者服务的

Google 在文档最前面就把「为什么要定规范」写清楚了，其中四条我印象最深：

- **Style rules should pull their weight**——每条规则带来的收益必须大到值得让所有工程师记住它。这条其实解释了「为什么规范里没有禁止 `goto`」：`goto` 已经很罕见了，收益不够，就不写。
- **Optimize for the reader, not the writer**——代码被读的次数远多于被写的次数，所以「写起来省事」不能作为风格理由。里面还有一句我很喜欢：**leave a trace for the reader**，出现意外或不寻常的写法时，要在使用处给读者留下文字线索。
- **Be consistent with existing code**——「很多一致性规则最后都归结为一句话：随便挑一个，然后别再纠结。」但它也补了一句更实用的：一致性还有个隐藏好处是**能被工具自动化**——格式化器和 include 排序工具只在代码风格统一时才工作正常。
- **Avoid surprising or dangerous constructs**——C++ 里有一些构造比看上去更危险，对这类限制的豁免门槛很高，因为豁免往往直接损害正确性。

具体到命名，Google 那节的开头我直接抄下来了：

> The most important consistency rules are those that govern naming. The style of a name immediately informs us what sort of thing the named entity is: a type, a variable, a function, a constant, a macro, etc., without requiring us to search for the declaration of that entity. The pattern-matching engine in our brains relies a great deal on these naming rules.

一句话翻译：最重要的统一规则是命名规则。名字的风格会立刻告诉我们这是个类型、变量、函数还是常量，不需要去找声明——我们脑子里的模式匹配非常依赖这些命名习惯。

它的命名方案（下面「我这学期要遵守的规则」的 B 组我照抄了这一套）：

| 对象 | 规则 | 例子 |
|:--|:--|:--|
| 文件名 | 全小写 + 下划线 | `max_subarray.cc` / `.h` |
| 类型名（类 / 结构体 / 别名 / 枚举 / 模板参数） | 大驼峰，无下划线 | `MaxSubArray`、`UrlTableProperties` |
| 变量名（含函数参数） | 全小写 + 下划线 | `table_name` |
| 类数据成员 | 小写下划线 + 结尾下划线（struct 不加） | `table_name_` |
| 函数名 | 大驼峰 | `CountFooErrors` |
| 常量 | `k` + 大驼峰 | `kMaxAllowedConnections` |
| 缩写 | 当成一个「词」来大小写，且不能删字母 | `fqdn`（Fully Qualified Domain Name）可以，`cstmr_id` 不行 |

还有两条比格式更重要的判断标准，出自「Choosing Names」一节：

1. **描述性和可见范围成正比**。头文件里的自由函数大概要说明它属于哪个库，而局部变量不需要——名字不该靠重复眼前已有的信息来分散读者注意力。
2. **局部作用域里短名字是被鼓励的**。`i`、`n`、`tmp` 这类约定俗成的短名字，在有限的作用域内意义足够清楚；反过来在宽作用域里用 `kNum` 这种不明确的名字才是问题。

另外两条结构性的规定：头文件保护宏统一用 `<PROJECT>_<PATH>_<FILE>_H_` 的格式；以及 **include what you use**——用到什么就 include 什么，不要依赖别人替你 include（否则别人清理头文件的时候你的代码就炸了）。

### Linux 内核：把「可读性」变成机器能检查的形状

内核的规范是这份清单里最不像「建议」的，几乎每一条都是硬的：

- **缩进用 8 字符的 tab**，而且缩进**只用 tab，不用空格**（注释、文档和 Kconfig 除外）。作者的理由很直接：缩进的作用是明确告诉我一个控制块从哪开始到哪结束，连续盯屏幕 20 小时后，缩进大更容易看出来；而且如果你需要超过 3 层缩进，「那说明你的程序该改了」。
- **单行不超过 80 列**。
- **花括号的放法**：`if` / `switch` / `for` / `while` 的左花括号放在行尾（K&R 风格），**但函数例外，函数的左花括号另起一行**。作者自己也承认这看起来不一致，然后用「K&R 是对的」把它带过去了——这段我读着挺乐。
- 不能为了省花括号用逗号塞多条语句，一行一条语句，一行不做多个赋值，「避免取巧的表达式」。
- 指针的 `*` 贴近**变量名**而不是类型名：`char *linux_banner;`。
- `sizeof`、`typeof`、`alignof`、`__attribute__` 这些「看起来像函数」的关键字后面不加空格（`sizeof(struct file)`），而 `if`、`switch`、`for`、`do`、`while` 后面要加。
- 不要留行尾空格（Git 也会警告）。

命名部分的态度非常鲜明：局部变量要短、要准，循环计数就该叫 `i`；但**全局函数和变量必须有描述性的名字**——统计活跃用户数的函数应该叫 `count_active_users()`，**不能叫 `cntusr()`**，原文说这是「该枪毙的罪」。它明确反对匈牙利命名法：「编译器本来就懂类型也能检查，把类型塞进名字只会让人困惑。」也不要拿 typedef 去藏结构体和指针：

```c
// 看不出 a 是什么
vps_t a;

// 一眼就知道是个指向 virtual_container 的指针
struct virtual_container *a;
```

还有一节叫「不要崩溃内核」，我读得挺有意思：不要加 `BUG()` 这类会直接崩掉内核的代码，要用 `WARN_ON_ONCE()`；理由之一是同一个警告条件**很容易反复触发**，会把内核日志刷爆，日志本身反而变成新问题。原文还专门堵了一个借口：「我懒得写错误处理」不构成使用 `BUG()` 的理由。

### LLVM：第一条规则是「跟随既有风格」

LLVM 最开头就把基调定了——**没有任何编码标准应该被当作在所有情况下都必须遵守的绝对要求**——然后给出黄金法则：

> If you are extending, enhancing, or bug fixing already implemented code, use the style that is already being used so that the source is uniform and easy to follow.

它有几条特别具体的禁令，我觉得理由讲得比规则本身更有价值：

- **永远不写 `using namespace std;`**，所有标准库名字显式写 `std::`。理由不是洁癖：标准库还在不断往 `std` 里加名字，你今天用的短名字明天就可能撞车。
- 新代码不用 `<iostream>`（LLVM 用自己的流库）。
- **多用提前返回和 `continue`**，减少缩进层数——因为每一层嵌套都意味着读者要多记住一个状态和之前做过的判断。
- 有把握的地方就 `assert`；但**用户输入能触发的错误不能靠 assert 处理**，要走可恢复的错误机制。
- `auto` 是「只在能让代码更好读或更好维护时用」，明确不是 C++11 社区那种「几乎总是 auto」的立场。
- 头文件包含顺序：主模块自己的头文件 → 本项目内部头文件 → 项目/子项目头文件 → 系统头文件，每组内部按完整路径字典序。
- Python 代码统一按 PEP 8，并用 `black` 自动格式化（连 `--line-length` 都不许自己指定）。

### C++ Core Guidelines：把「风格」上升为「正确性」

这份是 C++ 之父 Stroustrup 和 Sutter 主持的，和前面几份最大的区别是：**它管的不是好不好看，而是对不对**。我最想记住的几条（编号是原文的编号）：

- **P.1 直接用代码表达想法**
- **P.2 用 ISO 标准 C++ 写**
- **P.5 能在编译期检查的就别留到运行期**
- **P.7 尽早发现运行期错误**
- **P.8 不要泄漏任何资源**
- **P.10 优先用不可变的数据，而不是可变数据**
- **P.11 把混乱的构造封装起来**，而不是让它散布在代码各处
- **P.12 该用工具就用工具**
- **F.2 一个函数只做一件逻辑上的事**
- **F.3 让函数保持短小简单**
- **F.9 用不到的参数就别给它起名字**
- **F.20 要输出的东西优先用返回值，而不是传出参数**
- **F.43 绝不返回指向局部对象的指针或引用**

P.11 那条我特别喜欢，它其实是在说：**如果你有一段逻辑很乱，不要靠注释解释它，要把它关进一个小函数里**，让乱只乱在一个地方。这个和我写算法时的习惯正好相反——我通常是想到哪写到哪，把边界判断散落在主循环里。

### Microsoft：规范要用工具强制

微软这套是给 C# 的，但有一条思路对所有语言都成立：**光靠自觉是遵守不了的，得让工具在 CI 里报违规。**

它的做法是 `.editorconfig` + 代码分析（Roslyn analyzer）：`.editorconfig` 管格式，编辑器直接按规则排版；代码分析管语义，违反规则就产生 warning/diagnostic，然后**每次 CI 构建都会提醒开发者违规**。而且它还建议用多层 `.editorconfig` 来分别落实「公司级规范 / 团队级规范 / 项目级规范」。

具体格式规定：4 个空格、不用 tab；花括号用 Allman 风格（左右花括号各占一行）；一行一条语句、一行一条声明；方法定义之间至少空一行；用括号把表达式里的分组写明白（`if ((startX > endX) && (startX > previousX))`），除非例子本身就是在讲优先级。注释：短说明用 `//`，公开成员用 XML 文档注释，注释**单独占一行**而不是跟在代码尾巴上，首字母大写、结尾带句号。

### 阿里巴巴 Java 开发手册：先分级，再工具化

这是中文互联网流传最广的一份大厂规范，我觉得它有两个设计特别值得学。

**第一是把规则分级。**每条都标 **[强制]** 或 **[推荐]**，直接回答了「哪些必须做、哪些只是建议」。目录结构也很清楚：命名规约、常量规约、格式规约、OOP 规约、集合处理、并发处理、控制语句、注释规约、异常日志、单元测试、安全规约。

**第二是它不只是文档。**阿里开源了 [p3c](https://github.com/alibaba/p3c)，把其中 **49 条规则**实现成了 PMD 规则，配 IntelliJ IDEA 和 Eclipse 插件，边写边报违规。插件里单独实现的强制项包括：

- 禁止使用已废弃的类或方法
- 覆写接口或抽象类的方法**必须**加 `@Override` 注解

`@Override` 这一条的理由特别典型：`getObject()` 和 `get0bject()` 一个是字母 `O` 一个是数字 `0`，不加注解根本看不出覆写成功没有；加上之后，抽象类里签名一改，实现类立刻编译报错。

### PEP 8 和 Airbnb JS：一致性是可以商量的

PEP 8 的开头我印象很深：

> A Foolish Consistency is the Hobgoblin of Little Minds.

（愚蠢的一致性是小智者的妖怪。）意思是：风格建议不适用的时候要知道变通，拿不准就看看周围的例子、或者直接问。但它自己给的数字又极其具体：**4 空格缩进；每行最多 79 字符，docstring 和注释限 72 字符**；import 一行一个，并按「标准库 → 相关第三方 → 本地」分三组，组间空一行；不许混用 tab 和空格。

Airbnb 的 JavaScript 规范是同类里最流行的（配套 `eslint-config-airbnb` 直接变成可执行的规则），几条典型规定：变量一律 `const`，需要重新赋值才用 `let`，**不用 `var`**；比较一律用 `===` / `!==` 而不是 `==` / `!=`；三元表达式不要嵌套。

### SEI CERT C：区分「规则」和「建议」

CERT C 是卡内基梅隆大学软件工程研究所维护的安全编码标准，它把条目分成两类，这个区分很关键：

- **Rule（规则）**：规范性要求，即「必须」
- **Recommendation（建议）**：遵循了能提升安全性、可靠性和安全性

分类非常细：预处理、声明与初始化、表达式、整数、浮点、数组、字符与字符串、内存管理、输入输出、环境、信号、错误处理、API、并发、POSIX、Windows……

对算法课来说，其中三类是我最容易踩的：**数组越界（ARR）、整数溢出（INT）、内存泄漏（MEM）**。这三个恰好也是写完实验「本地测着没事、交上去 WA 或 RE」的常见原因。

## 把各家放在一起看：冲突比共识更有意思

真正让我觉得这次调研有价值的地方，是把几份规范摆在一起看的时候：

| 同一个问题 | Google C++ | Linux 内核 | LLVM | Microsoft C# | PEP 8 |
|:--|:--|:--|:--|:--|:--|
| 缩进 | 2 空格 | 8 字符 **tab** | 2 空格 | 4 空格 | 4 空格 |
| 指针 `*` 贴谁 | — | 贴**名字** `char *p` | 贴**类型** `int* p` | — | — |
| 函数左花括号 | 行尾 | **另起一行** | 行尾 | **另起一行**（Allman） | — |
| 行宽 | 80 | 80 | 80 | 示例限 65 | 79 |
| 常量命名 | `kMaxAllowed` | 宏全大写 | 同 Google | `PascalCase` | `UPPER_CASE` |
| 缩进用不用 tab | 不用 | **只用 tab** | 不用 | 不用 | 不许混用 |

看下来最有价值的结论**不是**「哪家对」，而是这三点：

1. **这些差异基本没有技术上的对错。**2 空格还是 8 字符 tab、`*` 贴谁，都不影响程序行为。所以争论「哪种风格更好」没什么意义；**有意义的是不许混着用**。
2. **规范的价值集中在两件事上：一致性，和可自动化。**一致性让人能靠模式匹配读懂代码；可自动化让工具能替你执行这些规则——而后者才是规则真的会被执行的原因。
3. **各家自己也这么认为。**LLVM 直接说「没有任何编码标准应该被当作绝对要求」，然后用「跟随既有风格」收尾；Google 说一致性常常只是「随便挑一个然后别再纠结」，并且把「能被工具自动化」写成了一致性的收益；PEP 8 说得更直白——一致性是给人用的，别本末倒置。

所以下面这张清单我是这样理解的：**它不是「正确的写法」，而是「我选定的写法」**，而且一旦选定，这学期就不再改。

## 我这学期要遵守的规则

**适用范围**：这门课的实验代码，C++。提交方式老师还没定；如果之后要上 OJ，会在这份清单之外再加 OJ 的约束（比如不能依赖第三方库、不能用太新的语言特性、I/O 要自己处理）。

标「自定」的是我自己加的红线，因为各家规范里没有这一项。

### A 文件与结构

| # | 规则 | 来源 |
|:--|:--|:--|
| A1 | 每个源文件顶部写文件头注释：文件名、日期、一句话说明这个文件做什么（**贴到博客上的代码要先删掉姓名、学号这类个人信息**） | LLVM 的文件头惯例 |
| A2 | 头文件一律加 include guard，格式 `<项目>_<路径>_<文件>_H_` | Google C++ |
| A3 | 用到什么 include 什么，不依赖别人替我 include | Google（include what you use） |
| A4 | include 顺序：本项目头文件 → 标准库 → 第三方，同组内按字母序 | LLVM + 交给 clang-format 自动排 |
| A5 | 单个源文件不超过 500 行，超了就拆 | 自定 |
| A6 | 一个文件里的函数按被调用的顺序排，`main` 放最后 | 自定 |

### B 命名

| # | 规则 | 来源 |
|:--|:--|:--|
| B1 | 类型名（类 / 结构体 / 别名 / 枚举）大驼峰，不带下划线：`MaxSubArray` | Google C++ |
| B2 | 变量名、函数参数全小写 + 下划线：`left_index` | Google C++ |
| B3 | 函数名大驼峰：`CountFooErrors` | Google C++ |
| B4 | 类数据成员结尾加下划线：`table_name_` | Google C++ |
| B5 | 常量 `k` + 大驼峰：`kMaxAllowedConnections` | Google C++ |
| B6 | 宏名全大写 + 下划线：`MAX_N` | Google C++ |
| B7 | 描述性与可见范围成正比：跨文件的写全，循环里就用 `i` | Google C++ / Choosing Names |
| B8 | 不用项目外的人看不懂的缩写，绝不用删字母的方式缩写（`cstmr_id` ✗） | Google C++ |
| B9 | 禁止拼音命名，禁止 `a1`、`tmp2`、`flag` 这种说不出含义的名字 | 自定 |

### C 格式（全部交给 clang-format，不手工调）

| # | 规则 | 来源 |
|:--|:--|:--|
| C1 | 缩进 4 空格，不用 tab（**对 Google 的有意偏离**，理由见下） | Google 基线改 |
| C2 | 每行不超过 80 字符 | Google / Linux / LLVM 一致 |
| C3 | 花括号跟在行尾（函数的左花括号也是），不用 Allman | clang-format 的 Google 风格 |
| C4 | 指针 `*` 贴近类型：`int* p` | clang-format 的 Google 风格（Linux 内核相反，见上表） |
| C5 | 二元/三元运算符两侧一个空格；行尾不留空格；连续空行最多 1 行 | Linux 内核 + clang-format |
| C6 | **格式分歧不做人工争论：跑一遍 clang-format 就结束** | Google「一致性 = 可自动化」+ Core Guidelines P.12 |

关于 C1 我要把偏离说清楚：Google 官方是 2 空格缩进，我改成 4。原因是课程教材和 CLion 默认都是 4，而且**我之前写的实验代码本来就是 4 空格**——跟着既有代码走能减少无意义的差异，这正好也是 Google 自己那条「和既有代码保持一致」的应用。**这是有意为之的偏离，全学期不再改**。

另外还有一处我要**明确破例**：LLVM 明令禁止 `using namespace std;`，而**我打算继续用**。

LLVM 的理由是真的：标准库一直在往 `std` 里加名字，你今天用的短名字明天可能就撞车。但我现在的实验代码（包括之前的数据结构作业）开头全都是 `using namespace std;`，教材和同学也都这么写——在单文件、几百行、只用到 `vector` / `string` / `algorithm` 这几个名字的情况下，撞名的概率基本为零。所以我选择在这个点上「和既有代码保持一致」，而不是照抄 LLVM。等代码长出多个头文件和自己的命名空间，我会改成显式写 `std::`。

把这两条放在一起，正好说明了规范该怎么用：**知道规则背后的理由，然后有意识地选择遵守或偏离**——而不是既不知道为什么，也不说哪里破例。

### D 注释与文档

| # | 规则 | 来源 |
|:--|:--|:--|
| D1 | 注释写「为什么」，不写「是什么」（代码已经说了是什么） | 自定（P.1 的推论） |
| D2 | 文件顶部一段总述；每个函数上方说明：做什么、参数含义、返回什么、边界情况 | Google Python 指南对 docstring 的要求 |
| D3 | 注释是完整句子，首字母大写、结尾带句号 | PEP 8 + Microsoft |
| D4 | 注释单独占一行，不写在语句尾部 | Microsoft |
| D5 | `#if` / `#ifdef` 块较长时，`#endif` 后面补一行注释写明条件 | Linux 内核 |
| D6 | 注释必须随代码同步更新——**对不上的注释比没有注释更糟** | PEP 8 |

### E 函数与算法实现（算法课的主战场）

| # | 规则 | 来源 |
|:--|:--|:--|
| E1 | 一个函数只做一件逻辑上的事 | Core Guidelines F.2 |
| E2 | 函数保持短小；嵌套不超过 3 层 | F.3 + Linux「超过 3 层缩进说明你该改程序了」 |
| E3 | 多用提前返回，少用层层嵌套 | LLVM（减少读者要记住的状态） |
| E4 | 输入参数用 `const T&` 或值传递；**输出优先用返回值**，不用传出参数 | Core Guidelines F.16 / F.20 |
| E5 | 绝不返回局部对象的指针或引用 | Core Guidelines F.43 |
| E6 | 用不到的参数就不写名字 | Core Guidelines F.9 |
| E7 | 能在编译期确定的东西（常量、数组大小、约束）不留到运行期 | Core Guidelines P.5 |
| E8 | 每个算法函数上方标注时间复杂度和空间复杂度 | 自定（算法课的附加要求） |
| E9 | `assert` 用来抓「不该发生」的情况，**不用来做输入校验** | LLVM |

### F 安全与资源

| # | 规则 | 来源 |
|:--|:--|:--|
| F1 | 不手动 new / delete，优先用 `std::vector` 和智能指针 | CERT C（MEM）+ Core Guidelines R.smart |
| F2 | 所有数组访问先确认边界，越界一律不许发生 | CERT C（ARR） |
| F3 | 注意整数溢出：相乘、累加之前先估上界，必要时换 `long long` | CERT C（INT） |
| F4 | 不泄漏任何资源（内存、文件句柄） | Core Guidelines P.8 |
| F5 | 把杂乱、危险的构造关进一个小函数里，不让它散布在算法主体中 | Core Guidelines P.11 |

### G 工具与流程

| # | 规则 | 来源 |
|:--|:--|:--|
| G1 | 缩进 / 空格 / 换行 / include 排序全部交给 `clang-format`，写完就跑 | Core Guidelines P.12 |
| G2 | 编译一律带 `-Wall -Wextra`，警告当回事处理掉 | 自定（落实 P.7 与微软「工具强制」的思路） |
| G3 | 每次提交前过一遍下面的自查清单 | 自定 |
| G4 | 一个提交只做一件事，提交信息写清做了什么、为什么 | Google Engineering Practices（CL 要小而自洽） |

## 怎么让这份清单真的被执行

老实说，上面三十多条我一次也背不下来。所以执行方式是**能不靠人记的就不靠人记**。

### 1. 格式化交给 clang-format

在项目根目录放一个 `.clang-format`，CLion 和命令行都会读它：

```yaml
# 基线：clang-format 内置的 Google 风格
# （LLVM 项目维护的 Google 风格实现，本机 clang-format 21 实测可用）
BasedOnStyle: Google

# 有意偏离 1：缩进 4 空格（Google 官方是 2 空格）
# 理由：课程教材与 CLion 默认都是 4，跟着环境走，减少无意义的差异
IndentWidth: 4
AccessModifierOffset: -4

# 有意偏离 2：函数体不要压成一行
# 理由：算法课的函数常有边界判断，压成一行反而看不清
AllowShortFunctionsOnASingleLine: None

# 以下显式写死，避免不同版本 clang-format 默认值变化造成整文件重排
Language: Cpp
Standard: c++20
ColumnLimit: 80
UseTab: Never
PointerAlignment: Left
BreakBeforeBraces: Attach
IncludeBlocks: Regroup
MaxEmptyLinesToKeep: 1
NamespaceIndentation: None
```

`clang-format -style=Google -dump-config` 可以看到内置 Google 风格确实是这么定的（这些值是实际 dump 出来的，不是我抄的）：

```text
BasedOnStyle:        Google
ColumnLimit:         80
IndentWidth:         2
UseTab:              Never
BreakBeforeBraces:   Attach
PointerAlignment:    Left
IncludeBlocks:       Regroup
MaxEmptyLinesToKeep: 1
NamespaceIndentation: None
AllowShortFunctionsOnASingleLine: All
```

顺手实测了一段写得很难看的代码，看它到底会改什么：

```cpp
// 格式化前
#include <vector>
#include <iostream>
#include "max_subarray.h"
using namespace std;

// 求最大子段和
int MaxSubArray(const vector<int>&a,int n){
if(n==0)return 0;
int cur=a[0],best=a[0];
for(int i=1;i<n;i++){
cur=max(a[i],cur+a[i]);if(cur>best)best=cur;
}
return best;
}
```

格式化后（`clang-format -i max_subarray.cpp`）：

```cpp
#include "max_subarray.h"

#include <iostream>
#include <vector>
using namespace std;

// 求最大子段和
int MaxSubArray(const vector<int>& a, int n) {
    if (n == 0) return 0;
    int cur = a[0], best = a[0];
    for (int i = 1; i < n; i++) {
        cur = max(a[i], cur + a[i]);
        if (cur > best) best = cur;
    }
    return best;
}
```

它一次干了这几件事：把自己的头文件挑出来单独放一组、标准库按字母序排好、`const vector<int>&a` 改成 `const vector<int>& a`、把挤在一行的两条语句拆开、按 4 空格重新缩进。

以后写完就一条命令：

```bash
clang-format -i src/*.cpp include/*.h
```

CLion 那边：`Settings → Editor → Code Style` 里勾选从 `.clang-format` 读取，之后 `Ctrl+Alt+L`（macOS 是 `⌥⌘L`）就是同一套规则。

### 2. 命名和语义还得靠 clang-tidy

`clang-format` 只管格式，管不了命名是否合规、有没有内存泄漏、有没有用到过时的写法。这些要靠 `clang-tidy`——比如 `readability-identifier-naming` 检查命名规则、`modernize-*` 检查过时写法、`bugprone-*` 抓易错构造。

我本机现在还没装 clang-tidy（clang-format 用的是 Xcode 工具链里自带的那个），这学期补上。在那之前命名和资源管理这两块先靠人工自查 + 和同学互相看。

### 3. 每次提交前的自查清单

- [ ] 跑过 `clang-format -i`，格式无残留差异
- [ ] 编译带 `-Wall -Wextra`，**零警告**
- [ ] 所有数组访问都检查过边界
- [ ] 相乘 / 累加的地方确认过不会溢出
- [ ] 没有手写的 `new` / `delete`
- [ ] 每个函数上方有注释，且注释和代码一致
- [ ] 没有拼音命名、没有 `a1` / `tmp2` / `flag` 这类名字
- [ ] 每个算法函数标了时间、空间复杂度
- [ ] 嵌套没有超过 3 层
- [ ] 用不到的代码和调试用的 `cout` 都删干净了

## 一点感想

调研之前我以为「编码规范」就是管缩进和命名的，读完发现完全不是——**它其实是在回答「怎么让代码在时间里活下来」这个问题**。

Google 关心的是几亿行代码规模下名字不要撞车、读者能靠模式匹配读懂；Linux 内核关心的是 20 小时盯着屏幕之后还能看出控制块在哪；LLVM 关心的是新人改老代码时不要制造无意义的 diff；C++ Core Guidelines 关心的是别泄漏资源、别返回局部对象的引用；CERT C 关心的是别被人利用内存错误；微软关心的是怎么用 CI 让规范真的落地。

角度各不相同，但都指向同一件事：**代码是写给「未来的别人」看的，而那个别人大概率是你自己。**

所以这学期我打算这样执行：**格式上的事一律不靠自制力，交给工具；命名和资源管理这类工具管不了的，靠一张清单和互相检查。**至于风格选哪套——就像 Google 说的，随便挑一个，然后别再纠结。

## 参考链接

- Google C++ Style Guide — <https://google.github.io/styleguide/cppguide.html>
- Google Style Guides（总目录） — <https://google.github.io/styleguide/>
- Google Engineering Practices（代码评审） — <https://google.github.io/eng-practices/>
- Google Python Style Guide — <https://google.github.io/styleguide/pyguide.html>
- C# Coding Conventions（Microsoft） — <https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions>
- Microsoft REST API Guidelines — <https://github.com/microsoft/api-guidelines>
- 阿里巴巴 Java 开发手册 / p3c（含 PMD 规则与 IDE 插件） — <https://github.com/alibaba/p3c>
- Linux kernel coding style — <https://www.kernel.org/doc/html/latest/process/coding-style.html>
- LLVM Coding Standards — <https://llvm.org/docs/CodingStandards.html>
- C++ Core Guidelines — <https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines>
- SEI CERT C Coding Standard — <https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard>
- PEP 8 — Style Guide for Python Code — <https://peps.python.org/pep-0008/>
- Airbnb JavaScript Style Guide — <https://github.com/airbnb/javascript>
- Google C++ 风格指南（中文版） — <https://zh-google-styleguide.readthedocs.io/en/latest/google-cpp-styleguide/>
