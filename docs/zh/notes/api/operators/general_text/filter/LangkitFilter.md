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

```python
from dataflow.operators.general_text import LangkitFilter
from dataflow.utils.storage import FileStorage

class LangkitFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/langkit_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        # 使用自定义阈值进行过滤
        self.filter = LangkitFilter(
            min_scores={
                "flesch_reading_ease": 0,
                "automated_readability_index": 0,
                "aggregate_reading_level": 0,
                "syllable_count": 10.0,
                "lexicon_count": 10.0,
                "sentence_count": 1.0,
                "character_count": 50.0,
                "letter_count": 40.0,
                "polysyllable_count": 0.0,
                "monosyllable_count": 5.0,
                "difficult_words": 0.0,
            },
            max_scores={
                "flesch_reading_ease": 100,
                "automated_readability_index": 50,
                "aggregate_reading_level": 50,
                "syllable_count": 500.0,
                "lexicon_count": 300.0,
                "sentence_count": 20.0,
                "character_count": 2000.0,
                "letter_count": 1800.0,
                "polysyllable_count": 100.0,
                "monosyllable_count": 200.0,
                "difficult_words": 50.0,
            }
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_keys=[
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
            ]
        )

if __name__ == "__main__":
    test = LangkitFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

该算子会为每个指标添加两列：一列是评分（`Score` 后缀），一列是标签（`Score_label` 后缀，1表示通过，0表示未通过）。最终只保留所有指标都通过的文本行。

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 原始输入文本 |
| LangkitFleschReadingEaseScore | float | Flesch 可读性评分（0-100，越高越易读） |
| LangkitAutomatedReadabilityIndexScore | float | 自动可读性指数 |
| LangkitAggregateReadingLevelScore | float | 综合阅读等级 |
| LangkitSyllableCountScore | float | 音节总数 |
| LangkitLexiconCountScore | float | 词汇数量 |
| LangkitSentenceCountScore | float | 句子数量 |
| LangkitCharacterCountScore | float | 字符总数 |
| LangkitLetterCountScore | float | 字母总数 |
| LangkitPolysyllableCountScore | float | 多音节词数量 |
| LangkitMonosyllableCountScore | float | 单音节词数量 |
| LangkitDifficultWordsScore | float | 困难词数量 |
| *_label | int | 各指标的过滤标签（1表示通过，0表示未通过） |

### 📋 示例输入

```json
{"text": "The quick brown fox jumps over the lazy dog. This is a simple sentence for testing."}
{"text": "A"}
{"text": "In the field of natural language processing, various algorithms and methodologies have been developed to analyze, understand, and generate human language in a computationally efficient manner. These sophisticated techniques enable computers to perform complex linguistic tasks such as machine translation, sentiment analysis, named entity recognition, and text summarization with remarkable accuracy and efficiency."}
```

### 📤 示例输出

```json
{"text": "The quick brown fox jumps over the lazy dog. This is a simple sentence for testing.", "LangkitFleschReadingEaseScore": 88.74, "LangkitAutomatedReadabilityIndexScore": 2.6, "LangkitAggregateReadingLevelScore": 3.0, "LangkitSyllableCountScore": 20, "LangkitLexiconCountScore": 16, "LangkitSentenceCountScore": 2, "LangkitCharacterCountScore": 68, "LangkitLetterCountScore": 66, "LangkitPolysyllableCountScore": 0, "LangkitMonosyllableCountScore": 12, "LangkitDifficultWordsScore": 0, "LangkitFleschReadingEaseScore_label": 1, "LangkitAutomatedReadabilityIndexScore_label": 1, "LangkitAggregateReadingLevelScore_label": 1, "LangkitSyllableCountScore_label": 1, "LangkitLexiconCountScore_label": 1, "LangkitSentenceCountScore_label": 1, "LangkitCharacterCountScore_label": 1, "LangkitLetterCountScore_label": 1, "LangkitPolysyllableCountScore_label": 1, "LangkitMonosyllableCountScore_label": 1, "LangkitDifficultWordsScore_label": 1}
```

### 📊 结果分析

**样本1（简单英文文本）**：
- 文本：标准测试句子
- Flesch 可读性评分：88.74（非常易读）
- 自动可读性指数：2.6（小学低年级水平）
- 音节数：20，词汇数：16，句子数：2
- 字符数：68，字母数：66
- 单音节词：12个，多音节词：0个
- 困难词：0个
- **通过过滤**（所有指标都在设定范围内）

**样本2（极短文本 "A"）**：
- Flesch 可读性评分：121.22（超高可读性）
- 自动可读性指数：-16.3（异常值）
- 音节数：1（< 最小值10）
- 词汇数：1（< 最小值10）
- 字符数：1（< 最小值50）
- 字母数：1（< 最小值40）
- 单音节词：1（< 最小值5）
- **未通过过滤**（多个指标低于最小阈值）

**样本3（复杂学术文本）**：
- 文本：NLP领域的长段落学术描述
- Flesch 可读性评分：-14.65（极难阅读，< 最小值0）
- 自动可读性指数：24.1（大学及以上水平）
- 综合阅读等级：22.0（研究生水平）
- 音节数：123，词汇数：53，句子数：2
- 字符数：363，字母数：355
- 多音节词：24个，单音节词：21个
- 困难词：28个
- **未通过过滤**（可读性评分为负值，低于最小阈值）

### 📈 指标说明

1. **Flesch Reading Ease（可读性评分）**：
   - 范围：通常0-100，分数越高越易读
   - 90-100：小学生水平
   - 60-70：中学生水平
   - 0-30：大学生及以上水平
   - 负值：极其复杂的文本

2. **Automated Readability Index（自动可读性指数）**：
   - 基于字符数、单词数和句子数计算
   - 数值大致对应所需的教育年级

3. **音节和词汇统计**：
   - syllable_count：总音节数
   - lexicon_count：词汇数量（去重前）
   - monosyllable_count：单音节词数量
   - polysyllable_count：多音节词（≥3音节）数量

4. **困难词（Difficult Words）**：
   - 不在常用词表中的词汇数量

**应用场景**：
- 筛选适当复杂度的训练文本
- 过滤过于简单或过于复杂的内容
- 确保文本质量符合特定教育水平
- 构建适合特定用户群体的数据集
- 移除统计异常的低质量文本

**注意事项**：
- 阈值需要根据具体应用场景调整
- 学术或技术文本可能需要较宽松的复杂度阈值
- 过短的文本可能产生统计异常值
- 建议先对样本数据进行统计分析，再设定合理的阈值范围
