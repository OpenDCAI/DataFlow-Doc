---
title: HtmlUrlRemoverRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/htmlurlremoverrefiner/
---

## 📘 概述

`HtmlUrlRemoverRefiner` 是一个文本净化算子，用于去除文本中的URL链接和HTML标签，净化文本内容。该算子通过正则表达式匹配并移除各种形式的URL和HTML标签，实现对文本数据的清洗。

## `__init__`函数

```python
def __init__(self)
```

### init参数说明

该函数无参数。

## `run`函数

```python
def run(storage, input_key)
```

执行算子主逻辑，从存储中读取输入 DataFrame，移除指定列文本中的URL和HTML标签，并将净化后的结果写回存储。

#### 参数

| 名称        | 类型            | 默认值 | 说明                                     |
| :---------- | :-------------- | :----- | :--------------------------------------- |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | str             | 必需   | 输入列名，对应需要进行净化处理的文本字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

算子会就地修改输入`DataFrame`中`input_key`对应列的内容。

| 字段        | 类型 | 说明                                                         |
| :---------- | :--- | :----------------------------------------------------------- |
| [input_key] | str  | 净化后的文本内容，其中的URL和HTML标签已被移除。字段名与输入时指定的`input_key`相同。 |

**示例输入：**
（假设 `input_key` = "content"）

```json
{
"content":"这是一段示例文本，包含一个链接 <a href='https://example.com'>点击这里</a> 和一个裸URL https://another-example.org/page"
}
```

**示例输出：**

```json
{
"content":"这是一段示例文本，包含一个链接 点击这里 和一个裸URL "
}
```
