---
title: BlocklistFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/blocklistfilter/
---

## 📘 概述

[BlocklistFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/general_text/filter/blocklist_filter.py) 是一个文本过滤算子，它使用特定语言的阻止列表（blocklist）来筛选文本数据。它可以根据文本中包含的阻止列表关键词数量来决定是否保留该条数据，并支持使用分词器进行更精确的单词匹配。

## \_\_init\_\_函数

```python
def __init__(self, language:str = 'en', threshold:int = 1, use_tokenizer:bool = False)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **language** | str | 'en' | 指定阻止列表的语言代码。 |
| **threshold** | int | 1 | 文本中允许存在的阻止列表关键词的最大数量阈值。 |
| **use_tokenizer** | bool | False | 是否使用分词器进行单词级匹配。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'blocklist_filter_label')
```

执行算子主逻辑，从存储中读取输入 DataFrame，根据阻止列表进行过滤，并将过滤后的结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input\_key** | str | 必需 | 输入列名，对应待过滤的文本字段。 |
| **output\_key** | str | "blocklist\_filter\_label" | 输出列名，用于存放过滤标签结果。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入 DataFrame 的所有原始字段。 |
| blocklist\_filter\_label | int | 过滤标签。值为 1 表示该行数据通过了阻止列表过滤。输出的数据帧中仅包含此列值为 1 的行。 |
