---
title: LexicalDiversityFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/lexicaldiversityfilter/
---

## 📘 概述

[LexicalDiversityFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filters/lexical_diversity_filter.py) 是一个基于词汇多样性分数的过滤器。它使用 MTLD（移动平均类型-令牌比）和 HDD（超几何分布多样性）两种方法计算文本的词汇多样性，并根据设定的分数阈值过滤数据。分数越高，代表文本使用的词汇越丰富。

## __init__函数

```python
def __init__(self, min_scores: dict = {'mtld': 50, 'hdd': 0.8}, max_scores: dict = {'mtld': 99999, 'hdd': 1.0})
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min_scores** | dict | `{'mtld': 50, 'hdd': 0.8}` | 各项指标的最小分数阈值字典。 |
| **max_scores** | dict | `{'mtld': 99999, 'hdd': 1.0}` | 各项指标的最大分数阈值字典。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_keys = ['mtld', 'hdd'])
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要分析词汇多样性的文本字段。 |
| **output_keys** | list | `['mtld', 'hdd']` | 用于过滤的指标名称列表，必须与 `min_scores` 和 `max_scores` 的键一致。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

算子执行后，会在原始DataFrame中增加新的列，并根据过滤结果将符合条件的行写入新的存储文件中。新增列如下：

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| *input_key* | str | 原始输入的文本列。 |
| LexicalDiversityMTLDScore | float | 计算出的MTLD分数。 |
| LexicalDiversityHD-DScore | float | 计算出的HDD分数。 |
| LexicalDiversityMTLDScore_label | int | MTLD分数的过滤标签，1表示在阈值范围内，0表示不在。 |
| LexicalDiversityHD-DScore_label | int | HDD分数的过滤标签，1表示在阈值范围内，0表示不在。 |
