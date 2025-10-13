---
title: MeanWordLengthFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/meanwordlengthfilter/
---

## 📘 概述

[MeanWordLengthFilter]() 是一个文本过滤算子，用于根据文本中单词的平均长度来筛选数据。它通过计算文本中字符总数与单词数量的比值，并检查该平均值是否落在用户指定的最小和最大长度范围内。

## `__init__`函数

```python
def __init__(self, min_length: float=3, max_length: float=10)
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min_length** | float | 3 | 允许的最小平均单词长度。 |
| **max_length** | float | 10 | 允许的最大平均单词长度（不包含此值）。 |

## Prompt模板说明

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='mean_word_length_filter_label')
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待过滤的文本字段。 |
| **output_key** | str | "mean_word_length_filter_label" | 输出列名，用于存储过滤结果标签（1表示通过）。 |

## 🧠 示例用法

## 🧾 默认输出格式（Output Format）

算子执行后，会向原始数据中添加一个新的字段（默认为 `mean_word_length_filter_label`），其值为1，并仅保留通过筛选的数据行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入的原始字段。 |
| [output_key] | int | 过滤结果标签，值为1表示该行数据通过了筛选。 |

#### 示例输入：

```json
{
"text": "This is a sample sentence for testing."
}
```

#### 示例输出：

```json
{
"text": "This is a sample sentence for testing.",
"mean_word_length_filter_label": 1
}
```
