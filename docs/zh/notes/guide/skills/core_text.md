---
title: core_text
icon: material-symbols:extension
createTime: 2026/04/08 22:45:39
permalink: /zh/guide/de8oculw/
---

# Core Text 扩展算子参考

[DataFlow Pipeline生成](./generating_dataflow_pipeline.md) 的扩展算子参考库。当 6 个核心算子不能满足需求时，可查阅这里的逐算子详细文档。

## 可用算子

### Generate (`core_text/generate/`)

| 算子 | 说明 |
|------|------|
| `prompted-generator` | 最基础的单字段 LLM 生成 |
| `format-str-prompted-generator` | 多字段模板式生成 |
| `chunked-prompted-generator` | 长文本分块逐段处理 |
| `embedding-generator` | 调用 Embedding API 生成文本向量 |
| `retrieval-generator` | 基于 LightRAG 的异步 RAG 生成 |
| `bench-answer-generator` | Benchmark 答案生成，支持多种评估类型 |
| `text2multihopqa-generator` | 从文本构建多跳问答对 |
| `random-domain-knowledge-row-generator` | 基于种子数据的领域知识行生成 |

### Filter (`core_text/filter/`)

| 算子 | 说明 |
|------|------|
| `prompted-filter` | 基于 LLM 的质量评分与过滤 |
| `general-filter` | 基于规则的确定性过滤 |
| `kcentergreedy-filter` | 基于 k-Center Greedy 的多样性过滤 |

### Refine (`core_text/refine/`)

| 算子 | 说明 |
|------|------|
| `prompted-refiner` | 基于 LLM 的文本改写与精炼 |
| `pandas-operator` | 自定义 pandas DataFrame 操作 |

### Eval (`core_text/eval/`)

| 算子 | 说明 |
|------|------|
| `prompted-evaluator` | 基于 LLM 的打分评估 |
| `bench-dataset-evaluator` | Benchmark 数据集评估 |
| `bench-dataset-evaluator-question` | Benchmark 问题级评估 |
| `text2qa-sample-evaluator` | 问答样本质量评估 |
| `unified-bench-dataset-evaluator` | 跨格式统一 Benchmark 评估 |

## 目录结构

每个算子文件夹遵循统一布局：

```
<算子名称>/
├── SKILL.md          # 英文文档：使用场景、导入方式、参数说明、run() 示例
├── SKILL_zh.md       # 中文文档
└── examples/
    ├── good.md       # 正确用法示例，含单一算子组成的简单 Pipeline、样例输入及输出
    └── bad.md        # 常见错误与反模式
```
