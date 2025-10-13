---
title: LoremIpsumFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/loremipsumfilter/
---

## 📘 概述

[LoremIpsumFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个用于检测并过滤包含“lorem ipsum”等占位文本的算子。它通过计算占位文本出现的频率与文本总长度的比率，并与设定的阈值进行比较，来判断文本是否有效，从而实现对数据集的清洗。

## __init__函数

```python
def __init__(self, threshold: float=3e-8):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- |
| **threshold** | float | 3e-8 | 用于判断是否过滤文本的频率阈值。当占位文本出现的频率与文本总长度的比率超过此阈值时，该文本将被过滤。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
|---|---|---|---|
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='loremipsum_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检测的文本字段。 |
| **output_key** | str | 'loremipsum_filter_label' | 输出列名，用于存储过滤标签（1表示通过，0表示被过滤）。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| [input_key] | str | 输入的原始文本内容。 |
| loremipsum_filter_label | int | 过滤标签，值为1，表示该行数据通过了过滤。 |

示例输入：
```json
{"text": "This is a valid text entry that should pass the filter."}
{"text": "lorem ipsum dolor sit amet, consectetur adipiscing elit."}
```

示例输出：
```json
{"text": "This is a valid text entry that should pass the filter.", "loremipsum_filter_label": 1}
```
