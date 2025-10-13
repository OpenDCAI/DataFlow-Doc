---
title: ContentNullFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/contentnullfilter/
---

## 📘 概述
`ContentNullFilter` 算子用于过滤数据集中的空值、空字符串或仅包含空白字符的文本，以确保下游处理的数据质量和有效性。

## __init__函数
```python
def __init__(self)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **-** | - | - | 该算子初始化时无需传入参数。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='content_null_filter_label')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :--------------------------- | :------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，指定需要进行空值检查的文本字段。 |
| **output_key** | str | "content_null_filter_label" | 输出列名，用于存储过滤结果的标签（1表示有效，0表示无效）。 |

## 🧠 示例用法


#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--------------------------- | :---- | :---------------------------------- |
| ... | ... | 输入数据中的原有字段。 |
| [input_key] | str | 经过检查的原始文本字段。 |
| content_null_filter_label | int | 过滤标签，值为1表示该行数据有效并通过了过滤。 |

示例输入：
```json
{"text": "This is a valid sentence."}
{"text": ""}
{"text": "   "}
{"text": "Another valid one."}
```
示例输出（写入`storage`的数据）：
```json
{"text": "This is a valid sentence.", "content_null_filter_label": 1}
{"text": "Another valid one.", "content_null_filter_label": 1}
```
