---
title: ReferenceRemoverRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/referenceremoverrefiner/
---

## 📘 Overview

`ReferenceRemoverRefiner` is a text cleaning operator designed to remove unclosed reference tags and reference links from text, including various complete and incomplete forms of `<ref>` tags and `{{cite}}` templates, thereby cleaning reference markers from text.

## __init__ function

```python
def __init__(self)
```

### init parameter description

| Parameter | Type | Default | Description                |
| :-----    | :--- | :-----  | :-------------------------  |
| None      | -    | -       | This operator requires no initialization parameters. |

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name        | Type              | Default | Description                               |
| :---------- | :---------------- | :------ | :---------------------------------------- |
| **storage** | DataFlowStorage   | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str               | Required | Input column name for text field to clean. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import ReferenceRemoverRefiner
from dataflow.utils.storage import FileStorage

class ReferenceRemoverRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/reference_remover_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = ReferenceRemoverRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = ReferenceRemoverRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with reference markers removed |

### 📋 Sample Input

```json
{"text":"Normal text without references"}
{"text":"This is a fact<ref>source</ref> about history"}
{"text":"Citation example {{cite web|url=http://example.com}}"}
```

### 📤 Sample Output

```json
{"text":"Normal text without references"}
{"text":"This is a fact<ref>source</ref> about history"}
{"text":"Citation example {{cite web|url=http://example.com}}"}
```

### 📊 Results Analysis

**Sample 1-3**: Output same as input (reference markers not removed)

**Use Cases**:
- Clean reference tags from Wikipedia text
- Remove reference markers from academic documents

**Notes**:
- Uses regex to match `<ref>` tags and `{{cite}}` templates
- May require specific reference format to be recognized
