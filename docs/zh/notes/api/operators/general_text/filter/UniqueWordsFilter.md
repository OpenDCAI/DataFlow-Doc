---
title: UniqueWordsFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/uniquewordsfilter/
---

## 📘 概述

`UniqueWordsFilter` 是一个文本过滤算子，用于根据文本中唯一单词的比率是否达到预设阈值来筛选数据。

## \_\_init\_\_函数

```python
def __init__(self, threshold: float=0.1)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :------------ | :---- | :------ | :--------------------------------------------------- |
| **threshold** | float | 0.1 | 唯一单词比率的阈值，低于该阈值的文本将被过滤掉。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='unique_words_filter')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :----------- | :---------------- | :------------------------ | :--------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检查的文本字段。 |
| **output_key** | str | 'unique_words_filter' | 输出列名，用于存储过滤结果的标志（值为1）。 |

## 🧠 示例用法

## 🧾 默认输出格式（Output Format）

算子会返回一个被过滤后的 DataFrame，其中仅包含唯一单词比率大于 `threshold` 的行。DataFrame 中会新增一个 `output_key` 指定的列，其值恒为 1。

| 字段 | 类型 | 说明 |
| :---------------- | :---- | :----------------------------------------------- |
| `<input_key>` | str | 输入的原始文本字段（保留）。 |
| `<output_key>` | int | 过滤结果标志，输出的 DataFrame 中该字段值均为 1。 |
| ... | ... | 其他输入字段（保留）。 |
