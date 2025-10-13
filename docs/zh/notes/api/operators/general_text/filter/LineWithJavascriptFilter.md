---
title: LineWithJavascriptFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/linewithjavascriptfilter/
---

## 📘 概述 [LineWithJavascriptFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/line_with_javascript_filter.py)

该算子用于识别并过滤包含 'javascript' 引用的文本行。它通过检查文本中不含 "javascript" 关键词的行数是否达到指定阈值来决定是否保留该条数据。

## __init__函数

```python
def __init__(self, threshold: int=3)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **threshold** | int | 3 | 一个整数阈值。如果文本中不包含"javascript"的行数大于或等于此阈值，则该文本被视为有效。 |

### Prompt模板说明

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='line_with_javascript_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待过滤的文本字段。 |
| **output_key** | str | 'line_with_javascript_filter_label' | 输出列名，用于存储过滤结果的标签（1表示通过，0表示被过滤）。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入的原始字段。 |
| line_with_javascript_filter_label | int | 过滤标签。1 表示该行数据通过过滤，0 表示该行数据被过滤。 |
