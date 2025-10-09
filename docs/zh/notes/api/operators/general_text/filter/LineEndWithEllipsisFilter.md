---
title: LineEndWithEllipsisFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/lineendwithellipsisfilter/
---

## 📘 概述

`LineEndWithEllipsisFilter` 是一个数据过滤算子，用于检测文本中以省略号（`...` 或 `…`）结尾的行的比例。当这个比例低于预设阈值时，该文本被视为有效数据并保留，否则将被过滤掉。此算子常用于数据清洗，以识别并移除不完整的表述。

## `__init__`函数

```python
def __init__(self, threshold: float=0.3)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.3 | 浮点数阈值。如果文本中以省略号结尾的行的比例小于此阈值，则该文本通过筛选。 |

## Prompt模板说明

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'line_end_with_ellipsis_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要进行检测的文本字段。 |
| **output_key** | str | 'line_end_with_ellipsis_filter_label' | 输出列名，用于存储过滤结果的标签。 |

## 🧠 示例用法

## 🧾 默认输出格式（Output Format）

该算子会向DataFrame中添加一个由 `output_key` 指定的新列，用于标记过滤结果（1代表通过，0代表不通过），并最终只将通过筛选的行（即标记为1的行）写回存储。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入DataFrame中原有的所有字段。 |
| [output_key] | int | 过滤标签。在输出的DataFrame中，此列的值恒为1，表示该行数据已通过筛选。 |
