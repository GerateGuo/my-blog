---
title: 信息检索期末实验完整记录 — MS MARCO 攻克与全程记录
date: 2026-07-15
tags: [信息检索, Pyserini, BM25, BGE, ColBERT, SPLADE]
---

## 实验背景

《大语言模型驱动的智能信息检索技术及应用》期末实验，在 Pyserini 框架下对比 BM25、BGE、ColBERT、SPLADE-v3 四种模型。前两天已在 BEIR 三个小数据集（TREC-COVID、nfcorpus、quora）上完成了三模型对比，并新增了 SPLADE-v3。

今天是实验的最后一天，重点是攻克 MS MARCO（880 万文档、6980 查询），并完成多线程优化、BGE 重排序和 ColBERT 优化实验。

<!-- more -->

## 7月14日成果回顾

### BEIR 三个小数据集完整对比

| 数据集 | BM25 | BGE | ColBERT | SPLADE-v3 |
|:-----|:----:|:---:|:-------:|:---------:|
| TREC-COVID | 0.1871/0.6695 | 0.2581/0.8461 | 0.0803/0.7601 | 0.1633/0.1264 |
| nfcorpus | 0.1577/0.3382 | 0.1998/0.3757 | 0.1185/0.2705 | 0.4152/0.1772 |
| quora | 0.7470/0.8173 | 0.8568/0.9093 | 0.7113/0.7939 | 0.7778/0.3186 |

### MS MARCO 早期探索
- BM25 单线程（225s，MAP=0.1926，NDCG@10=0.2630）
- BM25 16 线程共享 searcher（50s）
- BGE Faiss 索引 25GB → Windows 32GB 无法完整加载
- ColBERT Pyserini 无预建索引 → 暂未完成

## 7月15日关键突破

### 1. MS MARCO BGE 重排序策略

既然 25GB 的 Faiss 索引无法直接加载，采用了**两阶段检索**方案：

**第一阶段**：BM25 快速检索，取 top-100 结果（50s）
**第二阶段**：BGE 模型在 RTX 5070 Ti 上对 top-100 结果重排序

技术细节：
- BM25 top-100 去重后 601,000 篇 unique 文档
- 多线程取文档文本（16 线程，19 秒，初版 16 线程 2 分 23 秒）
- GPU 批量编码 BGE-base-en-v1.5（batch_size=256，47 分钟）
- 重排序 6980 查询仅需 1 秒

最终结果：**MRR@10 = 0.3261**，相比纯 BM25 的 MRR（0.184）**提升 77%**。

### 2. MS MARCO SPLADE-v3

SPLADE-v3 索引仅 2.8 GB，解决了 BGE 索引 25GB 无法加载的瓶颈：
- 697,000 万文档的 SPLADE 索引下载（从 HuggingFace，2.8 GB）
- 6980 查询完成（41 秒，16 线程独立 searcher）
- MRR@10 = 0.0531（模型未经 MS MARCO 微调，零样本迁移效果有限）

### 3. 多线程扩展实验

| 配置 | 耗时 | 模型 | 加速比 |
|:---|:---:|:---|:-----:|
| 1 线程 | 225s | BM25 | 1x |
| 16 线程共享 | 50.0s | BM25 | 4.5x |
| 32 线程共享 | 45.3s | BM25 | 5.0x |
| 32 线程独立 | 107.8s | BM25 | 2.1x |
| 16 线程独立 | 40.8s | SPLADE-v3 | — |
| 32 线程独立 | 87.1s | SPLADE-v3 | — |

**关键结论**：共享 searcher 优于独立 searcher，16 线程性价比最高。32 线程收益递减（瓶颈在 Lucene 内部锁）。

### 4. 实验环境

| 设备 | 配置 | 用途 |
|:----|:----|:----|
| Windows | Ryzen 9950X (16C/32T), 32GB RAM, RTX 5070 Ti 12GB | BM25、BGE、SPLADE |
| Mac M5 | Apple Silicon M5 (16C), 24GB 统一内存 | ColBERT 重排序（MPS） |

### 5. ColBERT 优化总结

ColBERT（tct_colbert-v2）在 TREC-COVID 上的优化历程：

| 版本 | NDCG@10 | 关键优化 |
|:----|:-------:|:--------|
| 初始 CPU 版 | 0.5477 | mean pool，FP32 |
| 优化版 | **0.7601** | L2 归一化、MPS FP16、批量预编码 |

提升幅度 **+39%**。tct_colbert-v2 在 MS MARCO 上官方 MAP=0.3509，领域迁移导致效果下降。

## 最终结果总览

| 数据集 | BM25 | BGE | ColBERT | SPLADE-v3 |
|:-----|:----:|:---:|:-------:|:---------:|
| MS MARCO | MAP=0.1926 | MRR=0.3261 | ❌ 无索引 | MRR=0.0531 |
| TREC-COVID | MAP=0.1871 | MAP=0.2581 | NDCG=0.7601 | MAP=0.1633 |
| nfcorpus | MAP=0.1577 | MAP=0.1998 | MAP=0.1185 | MAP=0.4152 |
| quora | MAP=0.7470 | MAP=0.8568 | MAP=0.7113 | MAP=0.7778 |

## 代码

实验代码和完整报告在 GitHub：[GerateGuo/IR_Assignment](https://github.com/GerateGuo/IR_Assignment)
