---
title: StopWordFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/stopwordfilter/
---

## 📘 概述 StopWordFilter
该算子用于验证文本中停用词的比率是否低于阈值，使用NLTK分词器进行单词分割和停用词识别。

## __init__函数
```python
def __init__(self, threshold: float, use_tokenizer: bool):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **threshold** | float | 必需 | 停用词比率阈值。 |
| **use_tokenizer** | bool | 必需 | 是否使用NLTK分词器。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='stop_word_filter_label'):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待过滤的文本字段。 |
| **output_key** | str | "stop_word_filter_label" | 输出列名，用于标记过滤结果。 |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
算子会向DataFrame中添加一个布尔类型的标签列（由`output_key`指定），并过滤掉停用词比例不符合阈值的行。输出的DataFrame将保留所有原始列，并仅包含通过过滤的数据行。
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| ... | ... | 输入数据中的原始字段。 |
| stop_word_filter_label | int | 停用词过滤结果标签（1表示通过，0表示未通过），输出的DataFrame中该列值均为1。 |
