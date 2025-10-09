---
title: CodeLengthSampleFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/filter/codelengthsamplefilter/
---

好的，这是根据您提供的代码和模板生成的 `CodeLengthSampleFilter` 算子的教程 Markdown。

***

## 📘 概述 CodeLengthSampleFilter
`CodeLengthSampleFilter` 是一个基于代码长度特征进行过滤的算子。它利用 `CodeLengthSampleEvaluator` 的评分机制，用于移除文件过大或格式不佳的代码样本。

## __init__函数
```python
def __init__(self, min_score: float = 1.0, max_score: float = 1.0):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 1.0 | 最小长度得分阈值，低于该分数的样本将被过滤。 |
| **max_score** | float | 1.0 | 最大长度得分阈值，高于该分数的样本将被过滤。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
|---|---|---|---|
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'length_filter_label'):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，该列需要包含代码的'lines'和'language'信息。 |
| **output_key** | str | "length_filter_label" | 输出标签列名，用于存储长度过滤的结果（1表示通过，0表示过滤）。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
该算子会向输入的 DataFrame 中添加一个新列，并过滤掉不符合长度分数的行。
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入的原始字段。 |
| length_filter_label | int | 算子添加的过滤标签列，值为1表示该行数据通过了长度校验。 |
