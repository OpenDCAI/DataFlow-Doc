---
title: LangkitSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/langkitsampleevaluator/
---

## 📘 概述

`LangkitSampleEvaluator` 是一个文本质量评估算子，它使用 Langkit 工具包来计算文本的各项统计指标，从而帮助评估文本的结构复杂性和可读性。该算子能够提取多种语言学特征，包括句子长度、词汇多样性、情感倾向等。

## __init__函数

```python
def __init__(self)
```

该算子在初始化时无需传入参数。

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```
执行算子主逻辑，从存储中读取输入 DataFrame，对指定列的文本进行 Langkit 评估，并将评估结果（多个分数）作为新列添加回 DataFrame 并写入存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，指定需要评估的文本所在的列。 |

## 🧠 示例用法
```python
from dataflow.operators.general_text import LangkitSampleEvaluator
from dataflow.utils.storage import FileStorage

class LangkitSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/eval_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = LangkitSampleEvaluator()
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = LangkitSampleEvaluatorTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :------------------------------ | :---- | :--------------------------------- |
| input_key | str | 原始输入的文本列 |
| LangkitFleschReadingEaseScore | float | Flesch 可读性评分 |
| LangkitAutomatedReadabilityIndexScore | float | 自动可读性指数 |
| LangkitAggregateReadingLevelScore | float | 综合阅读水平评分 |
| LangkitSyllableCountScore | float | 音节总数 |
| LangkitLexiconCountScore | float | 词汇数量 |
| LangkitSentenceCountScore | float | 句子数量 |
| LangkitCharacterCountScore | float | 字符总数 |
| LangkitLetterCountScore | float | 字母总数 |
| LangkitPolysyllableCountScore | float | 多音节词数量 |
| LangkitMonosyllableCountScore | float | 单音节词数量 |
| LangkitDifficultWordsScore | float | 困难词汇数量 |

### 📋 示例输入
```json
{"text": "The quick brown fox jumps over the lazy dog. The sun is shining brightly in the clear blue sky. Birds are singing melodiously in the tall green trees. Children are playing happily in the beautiful park. Flowers are blooming magnificently everywhere you look. Nature displays its wonder through colorful butterflies dancing among fragrant roses. People enjoy peaceful walks along winding pathways surrounded by lush vegetation."}
{"text": "The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat."}
{"text": "In contemporary discourse surrounding technological advancement, one must acknowledge the multifaceted ramifications of artificial intelligence implementation. The epistemological considerations necessitate comprehensive analysis of socioeconomic implications. Furthermore, the paradigmatic shift toward automation requires meticulous examination of ethical frameworks governing algorithmic decision-making processes. Subsequently, organizational infrastructures must accommodate transformative methodologies while simultaneously addressing unprecedented complexities inherent within technological ecosystems."}
```

### 📤 示例输出
```json
{"text": "The quick brown fox...", "LangkitFleschReadingEaseScore": 62.04, "LangkitAutomatedReadabilityIndexScore": 9.4, "LangkitAggregateReadingLevelScore": 7.0, "LangkitSyllableCountScore": 107.0, "LangkitLexiconCountScore": 65.0, "LangkitSentenceCountScore": 7.0, "LangkitCharacterCountScore": 362.0, "LangkitLetterCountScore": 355.0, "LangkitPolysyllableCountScore": 8.0, "LangkitMonosyllableCountScore": 35.0, "LangkitDifficultWordsScore": 17.0}
{"text": "The cat sat on the mat...", "LangkitFleschReadingEaseScore": 116.15, "LangkitAutomatedReadabilityIndexScore": -4.4, "LangkitAggregateReadingLevelScore": 2.0, "LangkitSyllableCountScore": 84.0, "LangkitLexiconCountScore": 84.0, "LangkitSentenceCountScore": 14.0, "LangkitCharacterCountScore": 252.0, "LangkitLetterCountScore": 238.0, "LangkitPolysyllableCountScore": 0.0, "LangkitMonosyllableCountScore": 84.0, "LangkitDifficultWordsScore": 0.0}
{"text": "In contemporary discourse...", "LangkitFleschReadingEaseScore": -95.33, "LangkitAutomatedReadabilityIndexScore": 31.4, "LangkitAggregateReadingLevelScore": 31.0, "LangkitSyllableCountScore": 195.0, "LangkitLexiconCountScore": 57.0, "LangkitSentenceCountScore": 4.0, "LangkitCharacterCountScore": 553.0, "LangkitLetterCountScore": 545.0, "LangkitPolysyllableCountScore": 42.0, "LangkitMonosyllableCountScore": 12.0, "LangkitDifficultWordsScore": 43.0}
```

**结果分析**:
- **正常文本**：Flesch=62.04（中等可读性），适合7年级阅读水平，困难词17个
- **重复文本**：Flesch=116.15（极易阅读），适合2年级阅读水平，无困难词
- **学术文本**：Flesch=-95.33（极难阅读），需要31年级以上阅读水平，困难词43个
