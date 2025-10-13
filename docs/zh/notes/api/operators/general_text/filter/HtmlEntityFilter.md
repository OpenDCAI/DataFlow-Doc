---
title: HtmlEntityFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/htmlentityfilter/
---

## 📘 概述

`HtmlEntityFilter` 算子用于检测并过滤包含HTML实体（如 `&amp;`、`&lt;`、`&gt;` 等）的文本，确保内容不包含标记语言元素。

## `__init__`函数

```python
def __init__(self):
```

该函数没有参数。

## `run`函数

```python
def run(self, storage, input_key, output_key='html_entity_filter_label'):
```

#### 参数

| 名称          | 类型              | 默认值                       | 说明                                                         |
| :------------ | :---------------- | :--------------------------- | :----------------------------------------------------------- |
| **storage**   | DataFlowStorage   | 必需                         | 数据流存储实例，负责读取与写入数据。                         |
| **input_key** | str               | 必需                         | 输入列名，对应待检测的文本字段。                             |
| **output_key**| str               | "html_entity_filter_label" | 输出列名，用于存储过滤结果的标签（1表示通过，0表示未通过）。 |

## Prompt模板说明

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

该算子会向DataFrame中添加一个布尔标签列（`output_key`），然后过滤掉包含HTML实体的行。存储中将保存过滤后的DataFrame。

| 字段                      | 类型 | 说明                                                         |
| :------------------------ | :--- | :----------------------------------------------------------- |
| ...                       | -    | 输入的原始字段。                                             |
| **<output_key>**          | int  | 过滤标签，值为1，表示该行文本不包含HTML实体，已通过过滤。    |
