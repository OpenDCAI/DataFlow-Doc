---
title: CodeFileTypeContentFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/filter/codefiletypecontentfilter/
---

## 📘 概述

[CodeFileTypeContentFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/code_file_type_content_filter.py) 是一个基于文件类型和内容特征过滤代码样本的算子。它针对不同的文件格式（如文本、JSON、HTML等）应用特定的硬编码规则，以确保数据的质量和相关性。例如，该算子会移除行数过多的文本文件、可见文本内容不足的HTML文件或文件名不符合文档规范的文本文件。

## __init__函数

```python
def __init__(self)
```

### init参数说明

该函数没有参数。

## run函数

```python
def run(storage, input_key, output_key="file_type_content_filter_label")
```

执行算子主逻辑，从存储中读取输入 DataFrame，根据文件类型和内容特征进行过滤，并将过滤后的结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :----------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入字段名。此算子要求输入的DataFrame中必须包含 'filetype'、'filename'、'line_count' 等特定列。 |
| **output_key** | str | "file_type_content_filter_label" | 输出标签的列名，用于标记数据是否通过过滤。该列会被添加到过滤前的DataFrame中，最终输出的DataFrame仅包含通过过滤的行。 |

## 🧠 示例用法

## 🧾 默认输出格式（Output Format）

算子执行后，会返回一个被过滤后的 DataFrame。输出的数据保留了通过筛选的行的所有原始列，并新增了一个由 `output_key` 指定的标签列。

| 字段 | 类型 | 说明 |
| :--------------------------------------------------- | :---- | :----------------------------------------------- |
| `[input_columns]` | any | 输入数据中包含的所有原始列。 |
| `file_type_content_filter_label` (或`output_key`值) | int | 过滤标签，值为1表示该行数据通过了过滤规则。 |
