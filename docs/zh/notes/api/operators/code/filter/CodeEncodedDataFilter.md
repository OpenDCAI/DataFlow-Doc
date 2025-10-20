---
title: CodeEncodedDataFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/filter/codeencodeddatafilter/
---

## 📘 概述
`CodeEncodedDataFilter` 是一个代码数据过滤器算子，用于根据 `CodeEncodedDataSampleEvaluator` 的得分来过滤代码样本。它主要用于移除包含二进制内容（如 Base64、十六进制编码）和自动生成的代码。

## `__init__`函数
```python
def __init__(self, min_score: float = 1.0, max_score: float = 1.0)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **min_score** | float | 1.0 | 最小编码数据得分阈值。得分在此范围内（含）的样本将被保留。 |
| **max_score** | float | 1.0 | 最大编码数据得分阈值。得分在此范围内（含）的样本将被保留。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = "encoded_data_filter_label")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应包含代码文本的字段。 |
| **output_key** | str | "encoded_data_filter_label" | 输出列名，用于存储过滤标签（1 表示保留）。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
算子会向数据中添加一个由 `output_key` 指定的新字段，其值为1（通过）或0（未通过）。最终输出的数据集仅包含通过筛选的行。

| 字段 | 类型 | 说明 |
| :------------------------------ | :---- | :---------- |
| {input_key} | str | 输入的原始代码文本。 |
| {output_key} | int | 过滤标签，1 表示该样本通过筛选。 |

示例输入：
```json
{
"text":"import os\n\ndef main():\n    print(\"Hello, World!\")"
}
```
示例输出（在筛选前添加的标签列）：
```json
{
"text":"import os\n\ndef main():\n    print(\"Hello, World!\")",
"encoded_data_filter_label": 1
}
```
