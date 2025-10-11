---
title: CapitalWordsFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/capitalwordsfilter/
---

## 📘 Overview
`CapitalWordsFilter` is a data filtering operator that checks whether the proportion of capitalized words in text exceeds a preset threshold. If it exceeds the threshold, that data record is filtered out. This operator supports using a tokenizer for more precise word identification.

## `__init__` Function
```python
def __init__(self, threshold: float=0.2, use_tokenizer: bool=False)
```
### Initialization Parameters
| Parameter Name | Type | Default | Description |
| :--- | :-- | :-- | :--- |
| **threshold** | float | 0.2 | Threshold for the proportion of capitalized words (between 0-1). Data rows exceeding this value will be filtered. |
| **use_tokenizer** | bool | False | Whether to use the NLTK tokenizer to split words. If `False`, uses whitespace splitting. |

## `run` Function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='capital_words_filter')
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance responsible for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to be checked. |
| **output_key** | str | 'capital_words_filter' | Output column name for storing the filter result flag (1 means passed, 0 means failed). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import CapitalWordsFilter
from dataflow.utils.storage import FileStorage

class CapitalWordsFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/capital_words_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = CapitalWordsFilter(
            threshold=0.2,
            use_tokenizer=False
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='capital_words_filter'
        )

if __name__ == "__main__":
    test = CapitalWordsFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Original input text |
| capital_words_filter | int | Filter flag (1 means passed, 0 means failed) |

### 📋 Sample Input

```json
{"text": "This is a normal sentence with proper capitalization."}
{"text": "THIS IS ALL CAPS AND SHOULD BE FILTERED OUT"}
{"text": "MOST WORDS ARE CAPS BUT not all"}
{"text": "only lowercase text here"}
{"text": "Mix Of NORMAL and UPPERCASE Words"}
```

### 📤 Sample Output

```json
{"text": "This is a normal sentence with proper capitalization.", "capital_words_filter": 1}
{"text": "only lowercase text here", "capital_words_filter": 1}
```

### 📊 Result Analysis

**Sample 1 (Normal Capitalization)**:
- Capitalized words: "This" (sentence-initial capitalization, not all-caps word)
- All-caps word ratio: 0/8 = 0.0 (0%)
- **Passed filter** (≤ 0.2 threshold)

**Sample 2 (All Caps)**:
- All words are all-caps: "THIS", "IS", "ALL", "CAPS", "AND", "SHOULD", "BE", "FILTERED", "OUT"
- All-caps word ratio: 9/9 = 1.0 (100%)
- **Failed filter** (> 0.2 threshold)

**Sample 3 (Mostly Caps)**:
- All-caps words: "MOST", "WORDS", "ARE", "CAPS", "BUT"
- All-caps word ratio: 5/7 ≈ 0.71 (71%)
- **Failed filter** (> 0.2 threshold)

**Sample 4 (All Lowercase)**:
- No all-caps words
- All-caps word ratio: 0/4 = 0.0 (0%)
- **Passed filter** (≤ 0.2 threshold)

**Sample 5 (Mixed Caps)**:
- All-caps words: "Of", "NORMAL", "UPPERCASE", "Words" (note: only completely uppercase counts)
- All-caps word ratio: 2/6 ≈ 0.33 (33%)
- **Failed filter** (> 0.2 threshold)

**Use Cases**:
- Filter spam advertising text (often uses many capital letters for attention)
- Clean up poor-quality titles or comments
- Identify and filter "shouting" style text
- Improve text quality in datasets

**Notes**:
- The operator uses the `str.isupper()` method to determine if a word is all-caps
- Single-letter uppercase words are also counted
- Recommend adjusting the threshold based on specific use cases
