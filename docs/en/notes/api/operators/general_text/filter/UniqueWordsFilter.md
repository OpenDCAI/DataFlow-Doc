---
title: UniqueWordsFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/uniquewordsfilter/
---

## 📘 Overview

`UniqueWordsFilter` is a text filtering operator that filters data based on whether the ratio of unique words in text reaches a preset threshold.

## \_\_init\_\_ Function

```python
def __init__(self, threshold: float=0.1)
```

### Init Parameters

| Parameter | Type | Default | Description |
| :------------ | :---- | :------ | :--------------------------------------------------- |
| **threshold** | float | 0.1 | Threshold for unique word ratio; text below this threshold will be filtered out. |

## run Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='unique_words_filter')
```

#### Parameters

| Name | Type | Default | Description |
| :----------- | :---------------- | :------------------------ | :--------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to check. |
| **output_key** | str | 'unique_words_filter' | Output column name for storing filter result flag (value of 1). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import UniqueWordsFilter
from dataflow.utils.storage import FileStorage

class UniqueWordsFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/unique_words_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = UniqueWordsFilter(
            threshold=0.1
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='unique_words_filter'
        )

if __name__ == "__main__":
    test = UniqueWordsFilterTest()
    test.forward()
```

## 🧾 Default Output Format

The operator returns a filtered DataFrame containing only rows where the unique word ratio is greater than `threshold`. The DataFrame will have a new column specified by `output_key`, with a constant value of 1.

| Field | Type | Description |
| :---------------- | :---- | :----------------------------------------------- |
| `<input_key>` | str | Original input text field (retained). |
| `<output_key>` | int | Filter result flag; value is always 1 in output DataFrame. |

### 📋 Example Input

```json
{"text": "The quick brown fox jumps over the lazy dog"}
{"text": "good good good good good good good good"}
{"text": "This is a simple test with various different words"}
```

### 📤 Example Output

```json
{"text": "The quick brown fox jumps over the lazy dog", "unique_words_filter": 1}
{"text": "good good good good good good good good", "unique_words_filter": 1}
{"text": "This is a simple test with various different words", "unique_words_filter": 1}
```

### 📊 Result Analysis

**Sample 1 (High uniqueness text)**:
- Total word count: 9
- Unique word count: 8 ("the" appears twice)
- Unique word ratio: 8 / 9 ≈ 0.89 (89%)
- **Passes filter** (0.89 > 0.1 threshold)

**Sample 2 (Low uniqueness text)**:
- Total word count: 8
- Unique word count: 1 (only "good")
- Unique word ratio: 1 / 8 = 0.125 (12.5%)
- **Passes filter** (0.125 > 0.1 threshold)

**Sample 3 (Fully unique)**:
- Total word count: 9
- Unique word count: 9 (all words are distinct)
- Unique word ratio: 9 / 9 = 1.0 (100%)
- **Passes filter** (1.0 > 0.1 threshold)

**How It Works**:
1. Convert text to lowercase
2. Split into word list using spaces
3. Calculate unique word count using set
4. Calculate unique word ratio = unique words / total words
5. Retain if ratio > threshold

**Use Cases**:
- Filter text with excessive repetition
- Detect low-quality machine-generated text
- Identify language monotony issues
- Dataset diversity quality control

**Notes**:
- Case-insensitive (converted to lowercase for comparison)
- Uses space tokenization
- Higher `threshold` means stricter filtering
- Default threshold=0.1 is very lenient, only filters extremely repetitive text
