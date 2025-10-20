---
title: RemoveStopwordsRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removestopwordsrefiner/
---

## 📘 Overview

`RemoveStopwordsRefiner` is a text optimization operator designed to remove English stopwords (such as "the", "is", "in", and other high-frequency words with little meaning) from input text. This operator uses NLTK library's stopwords corpus to filter text in specified fields, aiming to improve text feature density and prepare for subsequent natural language processing tasks.

## `__init__` function

```python
def __init__(self, model_cache_dir: str = './dataflow_cache')
```

### init parameter description

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **model_cache_dir** | str | './dataflow_cache' | Cache directory path for storing NLTK stopwords data. |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str | Required | Name of input column containing text to remove stopwords from. |

## 📦 NLTK Data Configuration

This operator depends on NLTK's `stopwords` corpus.

**Recommended Method: Use Pre-downloaded Data (Avoid Network Issues)**

1. Download required packages from [https://github.com/nltk/nltk_data](https://github.com/nltk/nltk_data):
   - `stopwords/`

2. Set environment variable pointing to data path:
   ```bash
   export NLTK_DATA=/path/to/nltk_data
   ```

**Automatic Download Method:**

On first use, the operator will automatically detect and download required data. If network issues cause download to hang, use the manual download method above.

## 🧠 Example Usage

```python
from dataflow.operators.general_text import RemoveStopwordsRefiner
from dataflow.utils.storage import FileStorage

class RemoveStopwordsRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_stopwords_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveStopwordsRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveStopwordsRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with stopwords removed |

### 📋 Sample Input

```json
{"text":"This is a simple test"}
{"text":"The quick brown fox jumps"}
{"text":"I am going to the store"}
```

### 📤 Sample Output

```json
{"text":"simple test"}
{"text":"quick brown fox jumps"}
{"text":"going store"}
```

### 📊 Results Analysis

**Sample 1**: Removed "This" "is" "a"
**Sample 2**: Removed "The"
**Sample 3**: Removed "I" "am" "to" "the"

**Use Cases**:
- NLP text preprocessing
- Keyword extraction
- Feature extraction before text classification

**Notes**:
- Uses NLTK English stopwords list
- Only applicable to English text
