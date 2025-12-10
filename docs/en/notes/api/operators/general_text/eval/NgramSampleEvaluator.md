---
title: NgramSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/ngramsampleevaluator/
---

## 📘 Overview

`NgramSampleEvaluator` is an operator for evaluating text redundancy and originality. It calculates the repetition ratio of n-grams to assess how diverse or repetitive a text is. It supports both **English (word-level)** and **Chinese (character-level)** modes.

**Scoring Principle**: The score is computed as the ratio between the number of unique n-grams and the total number of n-grams. A higher score (closer to 1.0) indicates lower repetition and better originality.

## `__init__`

```python
def __init__(self, ngrams=5, language: str = 'en')
```

### Init Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **ngrams** | int | 5 | Length of n-grams. |
| **language** | str | 'en' | Processing language; `'zh'` uses character-level splitting for Chinese, other values use whitespace tokenization for English. |

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='NgramScore')
```

#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name specifying the column containing the text to be evaluated. |
| **output_key** | str | 'NgramScore' | Output column name for the generated n-gram score. |

## 🧠 Example Usage
```python
from dataflow.operators.general_text import NgramSampleEvaluator
from dataflow.utils.storage import FileStorage

class NgramSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/eval_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )

        # English mode (default)
        self.evaluator_en = NgramSampleEvaluator(ngrams=5, language='en')
        # Chinese mode
        self.evaluator_zh = NgramSampleEvaluator(ngrams=5, language='zh')

    def forward(self):
        # English samples
        self.evaluator_en.run(
            storage=self.storage.step(),
            input_key='text_en',
            output_key='NgramScore_en'
        )

        # Chinese samples
        self.evaluator_zh.run(
            storage=self.storage.step(),
            input_key='text_zh',
            output_key='NgramScore_zh'
        )

if __name__ == "__main__":
    test = NgramSampleEvaluatorTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :---- | :---------- |
| [input_key] | str | Original input text. |
| NgramScore | float | Computed n-gram score (0–1, higher means less repetition and better originality). |

### 📋 Example Input
```json
{"id":1,"type":"zh_normal","text_zh":"人工智能在大模型领域的应用已经非常广泛，从文本生成到逻辑推理都有显著进步，未来可期。"}
{"id":2,"type":"zh_repeat_phrase","text_zh":"重要的事情说三遍：不要过拟合！不要过拟合！不要过拟合！这就叫重要的事情说三遍。"}
{"id":3,"type":"zh_garbage","text_zh":"哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"}

{"id":1,"type":"en_normal","text_en":"Natural language processing is a subfield of linguistics, computer science, and artificial intelligence."}
{"id":2,"type":"en_repeat_phrase","text_en":"The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat."}
{"id":3,"type":"en_garbage","text_en":"test test test test test test test test test test test test test test test test test test"}
```

### 📤 Example Output
```json
{"id":1,"type":"zh_normal","text_zh":"人工智能在大模型领域的应用已经非常广泛，从文本生成到逻辑推理都有显著进步，未来可期。","NgramScore_zh":1.0}
{"id":2,"type":"zh_repeat_phrase","text_zh":"重要的事情说三遍：不要过拟合！不要过拟合！不要过拟合！这就叫重要的事情说三遍。","NgramScore_zh":0.6666666667}
{"id":3,"type":"zh_garbage","text_zh":"哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈","NgramScore_zh":0.03125}

{"id":1,"type":"en_normal","text_en":"Natural language processing is a subfield of linguistics, computer science, and artificial intelligence.","NgramScore_en":1.0}
{"id":2,"type":"en_repeat_phrase","text_en":"The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat.","NgramScore_en":0.3}
{"id":3,"type":"en_garbage","text_en":"test test test test test test test test test test test test test test test test test test","NgramScore_en":0.0714285714}
```

### 📊 Result Analysis

- **Chinese normal text (zh_normal)**: `NgramScore_zh = 1.0` (no repetition), rich and diverse content, almost all 5-gram combinations are unique, minimal redundancy.
- **Chinese repeated phrase (zh_repeat_phrase)**: `NgramScore_zh ≈ 0.67`, includes repeated sentence pattern "不要过拟合！" three times, so some n-grams are repeated and the score is medium-low.
- **Chinese garbage text (zh_garbage)**: `NgramScore_zh = 0.03125`, almost all n-grams are composed of repeated "哈", very few unique n-grams, extremely high redundancy.
- **English normal text (en_normal)**: `NgramScore_en = 1.0`, nearly all 5-gram word sequences are unique, indicating rich information and no obvious repetition.
- **English repeated phrase (en_repeat_phrase)**: `NgramScore_en = 0.3`, the sentence "The cat sat on the mat." is repeated multiple times, causing many repeated n-grams and a significantly lower score.
- **English garbage text (en_garbage)**: `NgramScore_en ≈ 0.071`, dominated by repeated `test` tokens, highly template-like and low-quality text.

Scores closer to 1.0 indicate lower repetition and higher originality, while scores closer to 0.0 indicate heavy repetition.
