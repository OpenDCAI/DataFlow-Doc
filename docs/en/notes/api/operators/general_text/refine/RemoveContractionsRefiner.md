---
title: RemoveContractionsRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removecontractionsrefiner/
---

## 📘 Overview

This operator is designed to expand English contractions in text, converting contracted forms to their full forms (e.g., "can't" to "cannot"). It uses the `contractions` library to perform contraction expansion, improving text standardization.

## `__init__` function
```python
def __init__(self)
```
### init parameter description
This function requires no parameters.

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name          | Type              | Default | Description                                     |
| :------------ | :---------------- | :------ | :---------------------------------------------- |
| **storage**   | DataFlowStorage   | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str               | Required | Input column name for text field containing contractions. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import RemoveContractionsRefiner
from dataflow.utils.storage import FileStorage

class RemoveContractionsRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_contractions_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveContractionsRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveContractionsRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with contractions expanded |

### 📋 Sample Input

```json
{"text":"I can't believe it's so easy"}
{"text":"We'll meet at 3 o'clock"}
{"text":"They're isn't any problem"}
```

### 📤 Sample Output

```json
{"text":"I cannot believe it is so easy"}
{"text":"We will meet at 3 of the clock"}
{"text":"They are is not any problem"}
```

### 📊 Results Analysis

**Sample 1**: "can't" → "cannot", "it's" → "it is"
**Sample 2**: "We'll" → "We will", "o'clock" → "of the clock"  
**Sample 3**: "They're" → "They are", "isn't" → "is not"

**Use Cases**:
- Text standardization
- Improve text consistency
- NLP preprocessing

**Notes**:
- Uses contractions library for expansion
- Only processes English contractions
