---
title: CapitalWordsFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/capitalwordsfilter/
---

## 📘 概述
`CapitalWordsFilter` 是一个数据过滤算子，用于检查文本中大写单词的比例是否超过预设阈值。如果超过阈值，则该条数据被过滤掉。该算子支持使用分词器来更精确地识别单词。

## `__init__`函数
```python
def __init__(self, threshold: float=0.2, use_tokenizer: bool=False)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :-- | :-- | :--- |
| **threshold** | float | 0.2 | 大写单词的比例阈值，超过此值的数据行将被过滤。 |
| **use_tokenizer** | bool | False | 是否使用分词器来切分单词。如果为 `False`，则使用空格进行切分。 |

### Prompt模板说明


## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='capital_words_filter')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检查的文本字段。 |
| **output_key** | str | 'capital_words_filter' | 输出列名，用于存储过滤结果的标志（1表示通过，0表示未通过）。 |

## 🧠 示例用法
