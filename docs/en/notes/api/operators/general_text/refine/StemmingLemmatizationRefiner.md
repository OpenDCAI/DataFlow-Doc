---
title: StemmingLemmatizationRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/stemminglemmatizationrefiner/
---

## 📘 Overview

`StemmingLemmatizationRefiner` operator is designed to perform stemming or lemmatization on text, converting words to their base or root forms. This helps standardize text and reduce word variations, thereby improving performance of subsequent processing tasks. This operator supports Porter stemming algorithm and WordNet lemmatization methods.

## __init__ function

```python
def __init__(self, method: str = "stemming"):
```

### init parameter description

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **method** | str | "stemming" | Specifies processing method. Options are 'stemming' (word stemming) or 'lemmatization' (word lemmatization). |

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str):
```

#### Parameters

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name specifying text field in DataFrame to process. |

## 📦 Dependency Configuration

This operator depends on NLTK's WordNet data.

**Method 1: Use Pre-downloaded NLTK Data (Recommended)**

1. Download NLTK data packages from [https://github.com/nltk/nltk_data](https://github.com/nltk/nltk_data), ensuring they include:
   - `wordnet/`
   - `omw-1.4/`

2. Set environment variable pointing to data path:
   ```bash
   export NLTK_DATA=/path/to/nltk_data
   ```

**Method 2: Automatic Download**

On first use, operator will automatically download required data to default location (`~/nltk_data` or `./dataflow_cache/nltk_data`)

## 🧠 Example Usage

```python
from dataflow.operators.general_text import StemmingLemmatizationRefiner
from dataflow.utils.storage import FileStorage

class StemmingLemmatizationRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/stemming_lemmatization_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = StemmingLemmatizationRefiner()  # Default uses stemming
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = StemmingLemmatizationRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text after stemming or lemmatization |

### 📋 Sample Input

```json
{"text":"running jumps quickly"}
{"text":"cats dogs playing"}
{"text":"studied studying studies"}
```

### 📤 Sample Output (method="stemming")

```json
{"text":"run jump quickli"}
{"text":"cat dog play"}
{"text":"studi studi studi"}
```

### 📊 Results Analysis

**Sample 1**: "running" → "run", "jumps" → "jump", "quickly" → "quickli"
**Sample 2**: "cats" → "cat", "dogs" → "dog", "playing" → "play"
**Sample 3**: All three forms "studied" "studying" "studies" become "studi"

**Use Cases**:
- Text standardization and normalization
- Word matching in information retrieval
- Feature extraction for text classification
- Reduce vocabulary size

**Notes**:
- Stemming: Fast but may produce non-real words (like "quickli")
- Lemmatization: Accurate but slower, requires WordNet data
- Only applicable to English text
