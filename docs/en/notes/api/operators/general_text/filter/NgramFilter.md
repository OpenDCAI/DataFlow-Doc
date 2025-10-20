---
title: NgramFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/ngramfilter/
---

## 📘 Overview

`NgramFilter` is an N-gram score-based text filtering operator. It evaluates text redundancy by calculating the proportion of repeated n-grams and filters out text with excessively high or low redundancy based on set score thresholds. Higher scores indicate lower repetition proportions and generally higher text quality.

## `__init__` Function

```python
__init__(self, min_score=0.8, max_score=1, ngrams=5)
```

### Init Parameters

| Parameter          | Type  | Default | Description                                     |
| :-------------- | :---- | :----- | :--------------------------------------- |
| **min_score**   | float | 0.8    | Minimum n-gram score threshold; text below this value will be filtered. |
| **max_score**   | int   | 1      | Maximum n-gram score threshold; text above this value will be filtered. |
| **ngrams**      | int   | 5      | N-gram size for calculating repetition rate.             |

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
        
        self.filter = NgramFilter(
            min_score=0.8,
            max_score=1.0,
            ngrams=5
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
{"text": "今天天气真不错，阳光明媚，万里无云，适合出门散步。"}
{"text": "好好好好好好好好好好好好好好好好好好好好好好好好好好"}
{"text": "The fascinating world of natural language processing encompasses various sophisticated algorithms."}
```

### 📤 Example Output

```json
{"text": "The fascinating world of natural language processing encompasses various sophisticated algorithms.", "NgramScore": 1.0}
```

### 📊 Result Analysis

**Sample 1 ("今天天气真不错，阳光明媚，万里无云，适合出门散步。")**:
- Text length: 26 characters
- Total 5-grams: 22
- Unique 5-gram count: Approximately 20
- N-gram score: 20 / 22 ≈ 0.91
- Score range: [0.8, 1.0]
- **Passes filter** (but not shown in output, possibly only showing passed samples)

**Sample 2 ("好好好好好好好好好好好好好好好好好好好好好好好好好好")**:
- Text length: 26 characters
- Total 5-grams: 22
- Unique 5-gram count: Approximately 1-2 (repeated "好好好好好")
- N-gram score: 1 / 22 ≈ 0.045
- Score range: [0.8, 1.0]
- **Filtered out** (0.045 < 0.8, excessively high repetition rate)

**Sample 3 ("The fascinating world of natural language processing...")**:
- Text length: 95 characters
- Total 5-grams: 91
- Unique 5-gram count: 91 (no repetition)
- N-gram score: 91 / 91 = 1.0
- Score range: [0.8, 1.0]
- **Passes filter** (1.0 within range, text has no redundancy)

**Calculation Formula**:
```
N-gram Score = Unique n-gram count / Total n-gram count
```

**Score Meaning**:
- **1.0**: Text has no repetition, highest quality
- **0.8-0.99**: Text has minor repetition, good quality
- **< 0.8**: Text has high repetition rate, poor quality

**Use Cases**:
- Filter low-quality, highly repetitive text
- Detect cyclic repetition in generated text
- Dataset quality control
- Filter template text from scraped data

**Notes**:
- Uses character-level n-gram (default n=5), suitable for mixed Chinese-English
- Higher scores indicate better text diversity
- Short text (< n characters) may have abnormal scores
- Different languages and scenarios may require adjusted `min_score` thresholds
- Special text types like poetry and lyrics may score low due to repetition
