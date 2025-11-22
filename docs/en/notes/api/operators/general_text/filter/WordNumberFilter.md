---
title: WordNumberFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/wordnumberfilter/
---

## 📘 Overview

`WordNumberFilter` is a text filtering operator for filtering data based on word count. It calculates the number of words in the specified text column (using space as delimiter) and retains data rows where the word count falls within the preset range `[min_words, max_words)`.

## `__init__` Function

```python
def __init__(self, min_words: int=20, max_words: int=100000)
```

### Init Parameters

| Parameter | Type | Default | Description |
| :--- | :-- | :--- | :--------------------------------------------- |
| **min_words** | int | 20 | Minimum word count threshold; text word count must be greater than or equal to this value. |
| **max_words** | int | 100000 | Maximum word count threshold; text word count must be less than this value. |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='word_number_filter_label')
```

#### Parameters

| Name | Type | Default | Description |
| :--- | :--- | :--- | :----------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to be filtered. |
| **output_key** | str | "word_number_filter_label" | Output column name for storing word count value of each record. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import WordNumberFilter
from dataflow.utils.storage import FileStorage

class WordNumberFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/word_number_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = WordNumberFilter(
            min_words=5,
            max_words=100
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='word_number_filter_label'
        )

if __name__ == "__main__":
    test = WordNumberFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

The operator adds a new field (specified by `output_key`) to the data for storing the word count of the original text, then filters data rows based on the `[min_words, max_words)` range.

| Field | Type | Description |
| :--- | :-- | :----------------- |
| {output_key} | int | Word count of text corresponding to `input_key`. |

### 📋 Example Input

```json
{"text": "Short."}
{"text": "This is a sentence with exactly twenty words and it should pass the filter because it meets the requirement perfectly."}
{"text": "The quick brown fox jumps over the lazy dog."}
```

### 📤 Example Output

```json
{"text": "This is a sentence with exactly twenty words and it should pass the filter because it meets the requirement perfectly.", "word_number_filter_label": 20}
{"text": "The quick brown fox jumps over the lazy dog.", "word_number_filter_label": 9}
```

### 📊 Result Analysis

**Sample 1 (Too few words)**:
- Word count: 1
- Word range: [5, 100)
- **Filtered out** (1 < 5)

**Sample 2 (Normal range)**:
- Word count: 20
- Word range: [5, 100)
- **Passes filter** (5 ≤ 20 < 100)
- `word_number_filter_label` field value is actual word count 20

**Sample 3 (Normal range)**:
- Word count: 9
- Word range: [5, 100)
- **Passes filter** (5 ≤ 9 < 100)
- `word_number_filter_label` field value is actual word count 9

**How It Works**:
1. Use space splitting to get word list from text
2. Count words
3. Check if word count is within `[min_words, max_words)` range
4. Write word count to `output_key` field
5. Only retain data rows within the range

**Use Cases**:
- Filter text that is too short or too long
- Control text length distribution in dataset
- Remove low-quality very short text
- Filter text with abnormal length

**Notes**:
- Uses space tokenization, doesn't support complex tokenization logic
- Range is left-closed right-open `[min_words, max_words)`
- `output_key` field stores actual word count, not a boolean label
- Default `min_words=20, max_words=100000`, adjustable as needed
