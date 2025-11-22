---
title: LowercaseRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/lowercaserefiner/
---

## 📘 LowercaseRefiner
`LowercaseRefiner` is a refiner operator that converts all uppercase characters in a specified text field to lowercase, unifying the text format.

## `__init__`
```python
def __init__(self)
```
### init parameters
This operator does not require any parameters during initialization.

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name          | Type              | Default Value | Description                                                                 |
| :------------ | :---------------- | :------------ | :-------------------------------------------------------------------------- |
| **storage**   | DataFlowStorage   | Required      | Data flow storage instance, responsible for reading and writing data.       |
| **input_key** | str               | Required      | The name of the input column whose text content will be converted to lowercase. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import LowercaseRefiner
from dataflow.utils.storage import FileStorage

class LowercaseRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/lowercase_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = LowercaseRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = LowercaseRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text converted to lowercase |

### 📋 Sample Input

```json
{"text":"Hello World! This Is A Test."}
{"text":"SHOUTING IN ALL CAPS"}
{"text":"MiXeD CaSe TeXt"}
{"text":"already lowercase text"}
{"text":"123 Numbers DON'T CHANGE 456"}
```

### 📤 Sample Output

```json
{"text":"hello world! this is a test."}
{"text":"shouting in all caps"}
{"text":"mixed case text"}
{"text":"already lowercase text"}
{"text":"123 numbers don't change 456"}
```

### 📊 Results Analysis

In this test, 4 out of 5 input samples were modified:

**Sample 1 (Title Case)**:
- Original: "Hello World! This Is A Test."
- All uppercase letters converted to lowercase
- Result: "hello world! this is a test."
- **Modified**

**Sample 2 (All Caps)**:
- Original: "SHOUTING IN ALL CAPS"
- All letters converted to lowercase
- Result: "shouting in all caps"
- **Modified**

**Sample 3 (Mixed Case)**:
- Original: "MiXeD CaSe TeXt"
- All uppercase letters converted to lowercase
- Result: "mixed case text"
- **Modified**

**Sample 4 (Already Lowercase)**:
- Original: "already lowercase text"
- Text is already all lowercase
- **Unchanged** (remains as is)

**Sample 5 (Numbers and Contractions)**:
- Original: "123 Numbers DON'T CHANGE 456"
- Letters converted to lowercase, numbers remain unchanged
- Result: "123 numbers don't change 456"
- **Modified**

**Use Cases**:
- Text standardization and normalization
- Prepare for case-insensitive text matching
- Preprocessing before deduplication
- Text normalization for NLP tasks

**Notes**:
- This operator uses Python's `lower()` method
- Numbers and punctuation remain unchanged
- Recommended to use before text analysis and matching
- May affect recognition of proper nouns
