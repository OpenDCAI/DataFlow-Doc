---
title: RemoveEmoticonsRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removeemoticonsrefiner/
---

## 📘 Overview

This operator is designed to remove text-based emoticons from text, such as ':-)', ':D', ':(', and other character-combination emot icons. It uses a predefined emoticon dictionary for pattern matching and replacement, supporting multiple common text emoticon patterns.

## __init__ function
```python
def __init__(self)
```
### init parameter description
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| - | - | - | This operator requires no initialization parameters. |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name for text field to process. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import RemoveEmoticonsRefiner
from dataflow.utils.storage import FileStorage

class RemoveEmoticonsRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_emoticons_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveEmoticonsRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveEmoticonsRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with text-based emoticons removed |

### 📋 Sample Input

```json
{"text":"Hello world!"}
{"text":"I am happy :) today :D"}
{"text":"Sad face :( and angry >:("}
```

### 📤 Sample Output

```json
{"text":"Hello world!"}
{"text":"I am happy  today "}
{"text":"Sad face  and angry >"}
```

### 📊 Results Analysis

**Sample 1**: No emoticons, remains unchanged
**Sample 2**: Removed `:)` and `:D`
**Sample 3**: Removed `:(` but `>:(` only partially removed

**Use Cases**:
- Clean social media text
- Remove text-based emoticons (not emoji)
- Text standardization

**Notes**:
- Only removes character-based emoticons (like :) :D :()
- Does not remove Unicode emoji (use RemoveEmojiRefiner for that)
