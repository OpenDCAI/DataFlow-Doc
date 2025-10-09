---
title: LineStartWithBulletpointFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/linestartwithbulletpointfilter/
---

## 📘 概述

[LineStartWithBulletpointFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filters/line_start_with_bullet_point_filter.py) 是一个文本过滤算子，用于检测并过滤那些以项目符号（如 `•`, `*`, `-` 等）开头的行在文本中占比较高的内容。它通过计算项目符号行的比例并与设定的阈值进行比较，来判断是否保留该文本。

## __init__函数

```python
def __init__(self, threshold: float=0.9)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :---------- | :---- | :------ | :----------------------------------------------------------- |
| **threshold** | float | 0.9 | 项目符号行的比率阈值。如果文本中项目符号行的比例超过此值，则该条数据将被过滤。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='line_start_with_bullet_point_filter_label')
```

### run参数说明

| 名称 | 类型 | 默认值 | 说明 |
| :----------- | :---------------- | :------------------------------------------- | :------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要进行过滤检查的文本字段。 |
| **output_key** | str | "line_start_with_bullet_point_filter_label" | 输出列名，用于存储过滤结果的标签（1 表示通过，0 表示未通过）。 |

## 🧠 示例用法

```python

```

## 🧾 默认输出格式（Output Format）

该算子会向DataFrame中添加一个由 `output_key` 指定的新列，用于存放过滤标签。最终写入存储的DataFrame只包含通过过滤的数据（即 `output_key` 列值为1的行）。

| 字段 | 类型 | 说明 |
| :------------------------------------------- | :--- | :------------------------------------------------------------------- |
| [input_key] | str | 输入的原始文本字段。 |
| ... | | 其他原始字段。 |
| **line_start_with_bullet_point_filter_label** | int | 过滤结果标签。1表示该行数据通过了检查，0表示未通过（将被过滤）。 |
