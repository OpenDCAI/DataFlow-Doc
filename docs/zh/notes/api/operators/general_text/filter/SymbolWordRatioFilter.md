---
title: SymbolWordRatioFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/symbolwordratiofilter/
---

## 📘 概述
`SymbolWordRatioFilter` 是一个数据过滤算子，用于检查文本中特定符号（如 "#", "...", "…"）与单词总数的比率。如果该比率超过预设的阈值，则该文本行将被过滤掉。这有助于清理数据集中符号滥用或格式异常的条目。

## __init__函数
```python
def __init__(self, threshold: float=0.4)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.4 | 符号与单词数量比率的阈值。超过此阈值的文本将被过滤。 |

## Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='symbol_word_ratio_filter_label')
```
执行算子主逻辑，从存储中读取输入 DataFrame，根据符号与单词的比率进行过滤，并将过滤后的结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检查的文本字段。 |
| **output_key** | str | "symbol_word_ratio_filter_label" | 输出列名，用于存储过滤结果的标签（1表示通过，0表示未通过）。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
算子会向 DataFrame 中添加一个 `output_key` 指定的列，并根据该列的值进行过滤。最终输出的 DataFrame 只包含通过筛选的行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| [input_key] | str | 原始输入的文本字段。 |
| ... | ... | 其他原始字段。 |
| [output_key] | int | 过滤标签，值为1，表示该行文本通过了符号与单词比率的检查。 |

**示例输入：**
```json
{"text": "This is a normal sentence."}
{"text": "This # sentence # has # too # many # symbols # ..."}
```
假设 `threshold` 为 `0.4`，`input_key` 为 `"text"`。

**示例输出：**
输出的 DataFrame 中将只包含第一行，因为它通过了比率检查。
```json
{"text": "This is a normal sentence.", "symbol_word_ratio_filter_label": 1}
```
