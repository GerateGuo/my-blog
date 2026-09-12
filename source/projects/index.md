---
title: 项目展示
date: 2026-07-02 12:59:01
type: "projects"
---

这里展示我最近参与或完成的项目。

### 项目一：Pyserini 信息检索实验

**简介**：在 Pyserini 框架下系统对比 BM25、BGE、ColBERT、SPLADE-v3 四种检索模型在 MS MARCO、TREC-COVID、nfcorpus、quora 四个数据集上的表现。包含多线程优化、GPU 重排序、MPS 加速等实验。

**技术栈**：Python, Pyserini, PyTorch, Transformers, Faiss, BEIR

**链接**：[GitHub](https://github.com/GerateGuo/IR_Assignment) | [实验报告](/my-blog/ir-experiment/)

### 项目二：Hindsight Dashboard

**简介**：给自托管的 AI Agent 记忆系统 Hindsight 写的单文件、零依赖管理面板。只用 Python 标准库实现，把记忆增长曲线、检索打分明细、实体共现图谱、LLM 用量统计和失败任务一键重试聚合在一个页面里，并可直接内嵌官方 Control Plane。自带假数据 API、30 项端到端自检和 GitHub Actions CI，已开源。

**技术栈**：Python（标准库）, 原生 JavaScript / SVG, GitHub Actions

**链接**：[GitHub](https://github.com/GerateGuo/hindsight-dashboard) | [项目详情](/my-blog/hindsight-dashboard/)
