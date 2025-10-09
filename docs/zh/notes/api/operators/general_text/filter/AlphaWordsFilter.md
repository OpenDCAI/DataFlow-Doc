---
title: AlphaWordsFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/alphawordsfilter/
---

## 📘 概述

`AlphaWordsFilter` 算子用于验证文本中字母单词的比率是否达到指定阈值。它支持两种分词模式：使用 NLTK 库进行专业分词，或通过简单的空格进行分割。该算子会过滤掉不满足比率条件的文本行。

## `__init__`函数

```python
def __init__(self, threshold: float, use_tokenizer: bool):
```

### init参数说明

| 参数名          | 类型  | 默认值 | 说明                                                     |
| :-------------- | :---- | :----- | :------------------------------------------------------- |
| **threshold**   | float | 必需   | 字母单词比率的阈值。                                     |
| **use_tokenizer** | bool  | 必需   | 是否使用 NLTK 分词器。如果为 `False`，则使用简单的空格分割。 |

### Prompt模板说明

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='alpha_words_filter_label'):
```

#### 参数

| 名称         | 类型            | 默认值                       | 说明                                                         |
| :----------- | :-------------- | :--------------------------- | :----------------------------------------------------------- |
| **storage**  | DataFlowStorage | 必需                         | 数据流存储实例，负责读取与写入数据。                         |
| **input_key**| str             | 必需                         | 输入列名，对应需要筛选的文本字段。                           |
| **output_key** | str             | 'alpha_words_filter_label'   | 输出列名，用于存储过滤结果的标签（1表示通过，0表示未通过）。 |

## 🧠 示例用法
