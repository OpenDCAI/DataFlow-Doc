---
title: WordNumberFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/wordnumberfilter/
---

## 📘 概述

[WordNumberFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/word_number_filter.py) 是一个文本过滤算子，用于根据单词数量筛选数据。它通过计算指定文本列中的单词数（以空格为分隔符），并保留单词数在预设范围 `[min_words, max_words)` 内的数据行。

## `__init__`函数

```python
def __init__(self, min_words: int=20, max_words: int=100000)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :-- | :--- | :--------------------------------------------- |
| **min_words** | int | 20 | 最小单词数量阈值，文本单词数必须大于或等于此值。 |
| **max_words** | int | 100000 | 最大单词数量阈值，文本单词数必须小于此值。 |

## Prompt模板说明

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='word_number_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :----------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要被过滤的文本字段。 |
| **output_key** | str | "word_number_filter_label" | 输出列名，用于存储每条记录的单词计数值。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

该算子会向数据中添加一个新字段（由 `output_key` 指定），用于存放原文的单词数量，然后根据 `[min_words, max_words)` 范围过滤数据行。

| 字段 | 类型 | 说明 |
| :--- | :-- | :----------------- |
| ... | any | 输入数据中的原始字段。 |
| {output_key} | int | `input_key` 对应文本的单词数量。 |

示例输入：

```json
{
"text":"This sentence has exactly seven words in it."
}
{
"text":"Short."
}
```

假设算子使用 `min_words=5, max_words=10` 进行初始化，并以 `input_key="text"` 和 `output_key="word_count"` 运行。

示例输出（写入存储）：

```json
{
"text":"This sentence has exactly seven words in it.",
"word_count":7
}
```
