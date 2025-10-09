---
title: SpecialCharacterFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/specialcharacterfilter/
---

## 📘 概述

[SpecialCharacterFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个特殊字符过滤算子，用于移除文本中包含特定或非标准 Unicode 字符的条目。该算子通过预定义的正则表达式模式来检测并过滤文本，以确保数据的规范性和清洁度。

## `__init__`函数

```python
def __init__(self)
```

### `init`参数说明

该算子在初始化时无需传入参数。

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='special_character_filter_label')
```

执行算子主逻辑，从存储中读取输入 DataFrame，对指定列进行特殊字符检测，过滤不合规的行，并将结果写回存储。

#### 参数

| 名称         | 类型              | 默认值                             | 说明                                                         |
| :----------- | :---------------- | :--------------------------------- | :----------------------------------------------------------- |
| **storage**  | DataFlowStorage   | 必需                               | 数据流存储实例，负责读取与写入数据。                         |
| **input_key**| str               | 必需                               | 输入列名，对应需要进行特殊字符检测的文本字段。               |
| **output_key** | str               | "special_character_filter_label"   | 输出标签列名，用于标记文本是否通过检测（1 表示通过，0 表示未通过）。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段                             | 类型 | 说明                                                   |
| :------------------------------- | :--- | :----------------------------------------------------- |
| [input_key]                      | str  | 输入的原始文本。                                       |
| special_character_filter_label   | int  | 特殊字符检测标签，1 表示文本不含特殊字符，通过检测。   |

示例输入：

```json

```

示例输出：

```json

```
