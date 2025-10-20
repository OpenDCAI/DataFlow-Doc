---
title: MeanWordLengthFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/meanwordlengthfilter/
---

## 📘 Overview

`MeanWordLengthFilter` is a text filtering operator that filters data based on the average length of words in text. It calculates the ratio of total character count to word count in the text and checks whether this average falls within the user-specified minimum and maximum length range.

## `__init__` Function

```python
def __init__(self, min_length: float=3, max_length: float=10)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_length** | float | 3 | Minimum allowed average word length. |
| **max_length** | float | 10 | Maximum allowed average word length (excluding this value). |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='mean_word_length_filter_label')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to filter. |
| **output_key** | str | "mean_word_length_filter_label" | Output column name for storing filter result labels (1 for pass). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import MeanWordLengthFilter
from dataflow.utils.storage import FileStorage

class MeanWordLengthFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/mean_word_length_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = MeanWordLengthFilter(
            min_length=3,
            max_length=10
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='mean_word_length_filter_label'
        )

if __name__ == "__main__":
    test = MeanWordLengthFilterTest()
    test.forward()
```

## 🧾 Default Output Format

After execution, the operator adds a new field (default `mean_word_length_filter_label`) to the original data with a value of 1, retaining only data rows that pass filtering.

| Field | Type | Description |
| :--- | :--- | :--- |
| [output_key] | int | Filter result label; value of 1 indicates this data row passed filtering. |

### 📋 Example Input

```json
{"text": "I am ok"}
{"text": "The quick brown fox jumps over the lazy dog"}
{"text": "Extraordinarily sophisticated"}
```

### 📤 Example Output

```json
{"text": "The quick brown fox jumps over the lazy dog", "mean_word_length_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 ("I am ok")**:
- Word list: ["I", "am", "ok"]
- Word count: 3
- Total characters: 1 + 2 + 2 = 5
- Average word length: 5 / 3 ≈ 1.67
- Threshold range: [3, 10)
- **Filtered out** (1.67 < 3)

**Sample 2 ("The quick brown fox jumps over the lazy dog")**:
- Word list: ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]
- Word count: 9
- Total characters: 3 + 5 + 5 + 3 + 5 + 4 + 3 + 4 + 3 = 35
- Average word length: 35 / 9 ≈ 3.89
- Threshold range: [3, 10)
- **Passes filter** (3 ≤ 3.89 < 10)

**Sample 3 ("Extraordinarily sophisticated")**:
- Word list: ["Extraordinarily", "sophisticated"]
- Word count: 2
- Total characters: 15 + 14 = 29
- Average word length: 29 / 2 = 14.5
- Threshold range: [3, 10)
- **Filtered out** (14.5 ≥ 10)

**Use Cases**:
- Filter text with excessively short average words (possibly low-quality or casual input)
- Filter text with excessively long average words (possibly containing many technical terms or non-natural language)
- Dataset quality control
- Natural language text filtering

**Notes**:
- Uses space `split()` to tokenize words
- Calculation formula: average length = total characters of all words / word count
- Range is `[min_length, max_length)`, inclusive of min_length, exclusive of max_length
- If word count is 0, the sample will be filtered
- Average word length varies across languages; thresholds should be adjusted based on specific scenarios
