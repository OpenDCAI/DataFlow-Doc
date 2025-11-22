---
title: QuratingFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/filter/quratingfilter/
---

## 📘 概述

`QuratingFilter` 是一个数据过滤算子，它基于 `QuratingScorer` 打分器的得分对数据进行筛选。该算子通过 Qurating 模型从四个维度评估文本质量：写作风格、所需专业知识、事实与 trivia 内容、教育价值。每个维度评分范围为 0-9 分，可用于筛选高质量的教育类或知识类内容。

## \_\_init\_\_函数

```python
def __init__(self, min_scores: dict = {'writing_style': 0,'required_expertise': 0,'facts_and_trivia': 0,'educational_value': 0}, max_scores: dict = {'writing_style': 9,'required_expertise': 9,'facts_and_trivia': 9,'educational_value': 9}, map_batch_size: int = 512, num_workers: int = 1, device_batch_size: int = 16, device: str = 'cuda', labels: list = ['writing_style', 'required_expertise', 'facts_and_trivia', 'educational_value'], model_cache_dir: str = './dataflow_cache')
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min\_scores** | dict | `{'writing_style': 0, ...}` | 各维度保留样本的最小分数阈值。 |
| **max\_scores** | dict | `{'writing_style': 9, ...}` | 各维度保留样本的最大分数阈值。 |
| **map\_batch\_size** | int | 512 | 映射批次大小。 |
| **num\_workers** | int | 1 | 数据加载工作进程数。 |
| **device\_batch\_size** | int | 16 | 设备批次大小。 |
| **device** | str | "cuda" | 模型运行设备。 |
| **labels** | list | `['writing_style', ...]` | 需要评估的维度列表。 |
| **model\_cache\_dir** | str | "./dataflow\_cache" | 模型缓存目录。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input\_key** | str | 必需 | 输入列名，对应需要评估质量的文本字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

该算子会过滤输入数据，并将满足所有分数阈值条件的行写回存储。同时，会在输出的 DataFrame 中为每个评估维度添加一个标签列（例如 `writing_style_label`），其值为 1 表示通过该维度筛选，0 表示未通过。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 原始输入数据中的所有字段。 |
| **{label}\_label** | int | 对应维度是否通过筛选的标签（1表示通过，0表示未通过）。 |
