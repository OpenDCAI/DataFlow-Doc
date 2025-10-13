---
title: CurlyBracketFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/curlybracketfilter/
---

## 📘 概述

`CurlyBracketFilter` 是一个数据过滤算子，用于检测并过滤掉文本中花括号（`{}`）使用过于频繁的条目。它通过计算花括号数量与总文本长度的比率，并与预设的阈值进行比较，来判断是否需要过滤该条目。

## `__init__`函数

```python
def __init__(self, threshold: float=0.025):
```

### init参数说明

| 参数名        | 类型  | 默认值  | 说明                                                         |
| :------------ | :---- | :------ | :----------------------------------------------------------- |
| **threshold** | float | 0.025   | 花括号数量与文本长度比率的阈值，超过该阈值的文本行将被过滤。 |

## Prompt模板说明

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='curly_bracket_filter_label'):
```

#### 参数

| 名称          | 类型              | 默认值                       | 说明                                                         |
| :------------ | :---------------- | :--------------------------- | :----------------------------------------------------------- |
| **storage**   | DataFlowStorage   | 必需                         | 数据流存储实例，负责读取与写入数据。                         |
| **input_key** | str               | 必需                         | 输入列名，对应需要检测的文本字段。                           |
| **output_key**| str               | 'curly_bracket_filter_label' | 输出列名，用于存储过滤结果的标签（1 表示通过，0 表示未通过）。 |

## 🧠 示例用法

## 🧾 默认输出格式（Output Format）

算子执行后，会向DataFrame中添加一个由`output_key`指定的新列，并过滤掉未通过检测的行。最终写回存储的是过滤后的DataFrame。

| 字段                     | 类型 | 说明                                             |
| :----------------------- | :--- | :----------------------------------------------- |
| ...                      | -    | 输入的原始字段。                                 |
| [output_key]             | int  | 过滤标签，值为1表示该行数据通过了花括号比率检测。 |
