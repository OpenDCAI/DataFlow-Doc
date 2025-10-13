---
title: CodeGenericScoreFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/filter/codegenericscorefilter/
---

## 📘 概述

[CodeGenericScoreFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filters/score_filter.py) 是一个通用的基于分数的过滤算子，它根据数值分数列来过滤数据集。该算子提供了灵活的比较方法，用于移除不符合指定阈值标准的样本。

## __init__函数

```python
def __init__(self)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :----- | :--- | :----- | :--- |
|        |      |        |      |

该算子初始化时无需传入参数。

## run函数

```python
def run(self, storage, input_key, output_key="generic_score_filter_label", score_threshold=8, filter_method="greater_equal")
```

执行算子主逻辑，从存储中读取输入 DataFrame，根据指定的分数和过滤方法进行筛选，并将过滤后的结果写回存储。

#### 参数

| 名称                | 类型                                                               | 默认值                         | 说明                                                                                                                                                             |
| :------------------ | :----------------------------------------------------------------- | :----------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **storage**         | DataFlowStorage                                                    | 必需                           | 数据流存储实例，负责读取与写入数据。                                                                                                                               |
| **input_key**       | str                                                                | 必需                           | 输入列名，对应需要进行比较的分数字段。                                                                                                                           |
| **output_key**      | str                                                                | "generic_score_filter_label"   | 输出列名，用于标记数据是否通过筛选（1表示通过，0表示未通过）。                                                                                                   |
| **score_threshold** | int                                                                | 8                              | 用于过滤的分数阈值。                                                                                                                                             |
| **filter_method**   | Literal["greater", "greater_equal", "less", "less_equal", "equal"] | "greater_equal"                | 比较方法，决定如何根据阈值进行筛选。可选值包括： 'greater', 'greater_equal', 'less', 'less_equal', 'equal'。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

算子会保留通过筛选的行，并添加一个输出标签列（默认为 `generic_score_filter_label`）来标记结果。

| 字段                       | 类型 | 说明                               |
| :------------------------- | :--- | :--------------------------------- |
| (原始字段)                 | -    | 输入数据中的所有原始字段将被保留。 |
| generic_score_filter_label | int  | 1 表示该行数据通过了筛选条件。     |

**示例输入：**（假设文件中有两行数据）

```json
{ "id": 1, "text": "This is a high quality example.", "quality_score": 9.5 }
{ "id": 2, "text": "This is a low quality example.", "quality_score": 4.0 }
```

**示例输出：**（使用默认参数 `score_threshold=8`, `filter_method="greater_equal"`）

```json
{ "id": 1, "text": "This is a high quality example.", "quality_score": 9.5, "generic_score_filter_label": 1 }
```
