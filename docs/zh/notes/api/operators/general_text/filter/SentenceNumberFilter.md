---
title: SentenceNumberFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/sentencenumberfilter/
---

## 📘 概述 [SentenceNumberFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/sentence_number_filter.py)
SentenceNumberFilter 是一个文本过滤算子，用于检查输入文本中的句子数量是否在指定的最小和最大值范围内。它通过正则表达式统计句子数量，并只保留符合条件的文本行。

## __init__函数
```python
def __init__(self, min_sentences: int=3, max_sentences: int=7500)
```
### init参数说明
| 参数名              | 类型 | 默认值 | 说明                       |
| :------------------ | :--- | :------- | :------------------------- |
| **min_sentences**   | int  | 3        | 文本应包含的最小句子数量。 |
| **max_sentences**   | int  | 7500     | 文本应包含的最大句子数量。 |

## Prompt模板说明


## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'sentence_number_filter_label')
```
#### 参数
| 名称          | 类型              | 默认值                           | 说明                                   |
| :------------ | :---------------- | :------------------------------- | :------------------------------------- |
| **storage**   | DataFlowStorage   | 必需                             | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | str               | 必需                             | 输入列名，对应待过滤的文本字段。       |
| **output_key**| str               | 'sentence_number_filter_label'   | 输出列名，用于存储过滤结果的标签。     |

## 🧠 示例用法
