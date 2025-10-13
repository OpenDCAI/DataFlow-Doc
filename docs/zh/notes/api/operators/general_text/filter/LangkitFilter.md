---
title: LangkitFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/langkitfilter/
---

## 📘 概述
`LangkitFilter` 是一个基于文本质量度量指标进行数据过滤的算子。它利用 Langkit 工具包计算文本的多种可读性和复杂性分数，并根据用户设定的阈值筛选出符合条件的数据。

## `__init__`函数
```python
def __init__(self, 
             min_scores = {
                "flesch_reading_ease": 0,
                "automated_readability_index": 0,
                "aggregate_reading_level": 0,
                "syllable_count": 32.0,
                "lexicon_count": 23.0,
                "sentence_count": 1.0,
                "character_count": 118.0,
                "letter_count": 109.0,
                "polysyllable_count": 0.0,
                "monosyllable_count": 13.0,
                "difficult_words": 4.0,
            },
            max_scores = {
                "flesch_reading_ease": 100,
                "automated_readability_index": 100,
                "aggregate_reading_level": 100,
                "syllable_count": 2331.9,
                "lexicon_count": 1554.0,
                "sentence_count": 89.1,
                "character_count": 7466.3,
                "letter_count": 7193.0,
                "polysyllable_count": 216.4,
                "monosyllable_count": 1044.1,
                "difficult_words": 213.4,
            },
            metrics_to_keep: list = [
                "flesch_reading_ease",
                "automated_readability_index",
                "aggregate_reading_level",
                "syllable_count",
                "lexicon_count",
                "sentence_count",
                "character_count",
                "letter_count",
                "polysyllable_count",
                "monosyllable_count",
                "difficult_words",
             ]):
```
### init参数说明
| 参数名            | 类型 | 默认值       | 说明                           |
| :------------------ | :--- | :----------- | :----------------------------- |
| **min_scores**      | dict | 见代码       | 各项文本质量指标分数的最小阈值。 |
| **max_scores**      | dict | 见代码       | 各项文本质量指标分数的最大阈值。 |
| **metrics_to_keep** | list | 见代码       | 需要保留并用于过滤的评估指标列表。 |

### Prompt模板说明

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_keys: list = ["flesch_reading_ease", "automated_readability_index", ...]):
```
#### 参数
| 名称          | 类型              | 默认值 | 说明                                     |
| :------------ | :---------------- | :----- | :--------------------------------------- |
| **storage**   | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | str               | 必需   | 输入列名，对应需要评估和过滤的文本字段。 |
| **output_keys**| list              | 见代码 | 输出指标的名称列表，用于指定计算和过滤哪些指标。 |

## 🧠 示例用法
