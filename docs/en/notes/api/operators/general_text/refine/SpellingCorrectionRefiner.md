---
title: SpellingCorrectionRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/spellingcorrectionrefiner/
---

## 📘 Overview

`SpellingCorrectionRefiner` operator uses the SymSpell algorithm to correct spelling errors in text. It supports custom maximum edit distance and dictionary paths, and will automatically download the dictionary if it doesn't exist locally. Through efficient approximate string matching technology, this operator achieves fast spelling correction for large-scale text data.

## `__init__` function

```python
def __init__(self, max_edit_distance: int = 2, prefix_length: int = 7, dictionary_path: str = "frequency_dictionary_en_82_765.txt")
```

### `init` parameter description

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **max_edit_distance** | int | 2 | Maximum edit distance allowed for spelling lookup (deletion, insertion, replacement, transposition). |
| **prefix_length** | int | 7 | Prefix length for indexing and fast lookup to improve performance. |
| **dictionary_path** | str | "frequency_dictionary_en_82_765.txt" | Path to dictionary file for spelling correction. If file doesn't exist, operator will automatically download from default URL. |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name for text field to perform spelling correction. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import SpellingCorrectionRefiner
from dataflow.utils.storage import FileStorage

class SpellingCorrectionRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/spelling_correction_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = SpellingCorrectionRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = SpellingCorrectionRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with spelling corrected |

### 📋 Sample Input

```json
{"text":"This is a corect sentence"}
{"text":"I hav a speling eror"}
{"text":"The qwick brown fox"}
```

### 📤 Sample Output

```json
{"text":"this is a correct sentence"}
{"text":"a have a spelling error"}
{"text":"the quick brown fox"}
```

### 📊 Results Analysis

**Sample 1**: "corect" → "correct"
**Sample 2**: "hav" → "have", "speling" → "spelling", "eror" → "error"
**Sample 3**: "qwick" → "quick"

**Use Cases**:
- Text data cleaning
- User input correction
- OCR recognition result optimization
- Search query optimization

**Notes**:
- Uses SymSpell algorithm for fast spelling correction
- Corrections based on word frequency dictionary
- May correct some proper nouns to common words
- First use will automatically download frequency dictionary
