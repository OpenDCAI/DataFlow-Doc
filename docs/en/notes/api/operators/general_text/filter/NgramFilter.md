---
title: NgramFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/ngramfilter/
---

## 📘 Overview

`NgramFilter` is an N-gram score-based text filtering operator. It evaluates text redundancy by calculating the proportion of repeated n-grams and filters out text with excessively high or low redundancy based on set score thresholds. Higher scores indicate lower repetition proportions and generally higher text quality. It supports both **Chinese (character-level)** and **English (word-level)** modes.

## `__init__` Function

```python
__init__(self, min_score=0.8, max_score=1, ngrams=5, language: str = 'en')
```

### Init Parameters

| Parameter          | Type  | Default | Description                                     |
| :-------------- | :---- | :----- | :--------------------------------------- |
| **min_score**   | float | 0.8    | Minimum n-gram score threshold; text below this value will be filtered. |
| **max_score**   | int   | 1      | Maximum n-gram score threshold; text above this value will be filtered. |
| **ngrams**      | int   | 5      | N-gram size for calculating repetition rate.             |
| **language**    | str   | 'en'   | Processing language; `'zh'` uses character-level splitting for Chinese, other values use word-level tokenization for English. |

## `run` Function

```python
run(self, storage: DataFlowStorage, input_key: str, output_key: str='NgramScore')
```

#### Parameters

| Name          | Type            | Default         | Description                                       |
| :------------ | :-------------- | :------------- | :----------------------------------------- |
| **storage**   | DataFlowStorage | Required           | DataFlow storage instance for reading and writing data.       |
| **input_key** | str             | Required           | Input column name corresponding to the text field for redundancy evaluation.     |
| **output_key**| str             | "NgramScore"   | Output column name corresponding to the generated n-gram score field.       |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import NgramFilter
from dataflow.utils.storage import FileStorage

class NgramFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/ngram_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )

        # Example: Chinese filtering
        self.filter = NgramFilter(
            min_score=0.8,
            max_score=1.0,
            ngrams=5,
            language='zh'
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='NgramScore'
        )

if __name__ == "__main__":
    test = NgramFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

The operator adds an `output_key` field (default `NgramScore`) to the data and retains only data rows with scores in the `[min_score, max_score]` range.

| Field         | Type  | Description                         |
| :----------- | :---- | :--------------------------- |
| NgramScore   | float | Model-generated N-gram score.       |

### 📋 Example Input

```json
{"id":1,"type":"zh_normal","text":"人工智能在大模型领域的应用已经非常广泛，从文本生成到逻辑推理都有显著进步，未来可期。"}
{"id":2,"type":"zh_repeat_phrase","text":"重要的事情说三遍：不要过拟合！不要过拟合！不要过拟合！这就叫重要的事情说三遍。"}
{"id":3,"type":"zh_garbage","text":"哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"}

{"id":1,"type":"en_normal","text":"Natural language processing is a subfield of linguistics, computer science, and artificial intelligence."}
{"id":2,"type":"en_repeat_phrase","text":"The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat."}
{"id":3,"type":"en_garbage","text":"test test test test test test test test test test test test test test test test test test"}
```

### 📤 Example Output

```json
// Assume we run the filter separately for Chinese and English.

// Chinese mode (language='zh'), threshold [0.8, 1.0]
{"id":1,"type":"zh_normal","text":"人工智能在大模型领域的应用已经非常广泛，从文本生成到逻辑推理都有显著进步，未来可期。","NgramScore":1.0}

// English mode (language='en'), threshold [0.8, 1.0]
{"id":1,"type":"en_normal","text":"Natural language processing is a subfield of linguistics, computer science, and artificial intelligence.","NgramScore":1.0}
```

### 📊 Result Analysis

**Chinese samples (language='zh')**:

- **Sample zh_normal**  
  - N-gram score: `NgramScore = 1.0`  
  - Meaning: rich content with very little repetition and minimal redundancy.  
  - Threshold range: [0.8, 1.0]  
  - **Passes filter** (1.0 within threshold range)

- **Sample zh_repeat_phrase**  
  - N-gram score: `NgramScore ≈ 0.6667`  
  - Meaning: contains a repeated \"three times\" slogan pattern, so many n-grams are repeated.  
  - Threshold range: [0.8, 1.0]  
  - **Filtered out** (0.6667 < 0.8)

- **Sample zh_garbage**  
  - N-gram score: `NgramScore = 0.03125`  
  - Meaning: almost entirely made of repeated \"哈\", highly garbage/template-like text.  
  - Threshold range: [0.8, 1.0]  
  - **Filtered out** (severe repetition)

**English samples (language='en')**:

- **Sample en_normal**  
  - N-gram score: `NgramScore = 1.0`  
  - Meaning: high information density, nearly all 5-gram combinations are unique.  
  - Threshold range: [0.8, 1.0]  
  - **Passes filter**

- **Sample en_repeat_phrase**  
  - N-gram score: `NgramScore = 0.3`  
  - Meaning: the sentence \"The cat sat on the mat.\" is repeated many times, leading to many repeated n-grams.  
  - Threshold range: [0.8, 1.0]  
  - **Filtered out**

- **Sample en_garbage**  
  - N-gram score: `NgramScore ≈ 0.0714`  
  - Meaning: dominated by repeated `test` tokens, typical low-quality garbage text.  
  - Threshold range: [0.8, 1.0]  
  - **Filtered out**

> In summary, when we set the threshold `[min_score=0.8, max_score=1.0]`, **only high-quality, low-redundancy texts (such as zh_normal / en_normal) are retained**, while repetitive slogans, spammy or garbage-like texts are filtered out.

**Calculation Formula**:
```
N-gram Score = Unique n-gram count / Total n-gram count
```

**Score Meaning**:
- **1.0**: No repetition, highest quality
- **0.8-0.99**: Minor repetition, good quality
- **< 0.8**: High repetition rate, low quality

**Use Cases**:
- Filter low-quality, highly repetitive text
- Detect cyclic repetition in generated text
- Dataset quality control
- Filter template text from scraped data

**Notes**:
- Uses character-level n-gram for Chinese and word-level n-gram for English (default n=5)
- Higher scores indicate better text diversity
- Short text (< n characters/tokens) may have unstable scores
- Different languages and scenarios may require adjusted `min_score` thresholds
- Special text types such as poetry and lyrics may score low due to intentional repetition
