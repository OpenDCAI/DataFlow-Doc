---
title: RemoveRepetitionsPunctuationRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removerepetitionspunctuationrefiner/
---

## 📘 Overview
The `RemoveRepetitionsPunctuationRefiner` is an operator designed to clean text by removing consecutive repeated punctuation marks. For example, it transforms "!!!" into "!" and ",," into ",". It uses regular expressions to identify and replace sequences of identical punctuation characters with a single instance.

## `__init__`
```python
def __init__(self)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | This operator does not require any initialization parameters. |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
| Parameter | Type | Default | Description |
| :------------- | :---------------- | :--- | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the column containing the text to be processed. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import RemoveRepetitionsPunctuationRefiner
from dataflow.utils.storage import FileStorage

class RemoveRepetitionsPunctuationRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_repetitions_punctuation_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveRepetitionsPunctuationRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveRepetitionsPunctuationRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with repeated punctuation removed |

### 📋 Sample Input

```json
{"text":"Hello world!!!"}
{"text":"What??? Really!!! Amazing..."}
{"text":"Price is $100,,, okay???"}
```

### 📤 Sample Output

```json
{"text":"Hello world!"}
{"text":"What? Really! Amazing."}
{"text":"Price is $100, okay?"}
```

### 📊 Results Analysis

**Sample 1**: Repeated exclamation marks "!!!" → "!"

**Sample 2**: Multiple repeated punctuation "???" "!!!" "..." → "?" "!" "."

**Sample 3**: Repeated commas and question marks ",,," "???" → "," "?"

**Use Cases**:
- Clean excessive punctuation from user input
- Normalize social media text
- Text preprocessing and standardization

**Notes**:
- Preserves punctuation types, only removes repetitions
- Applicable to all punctuation in `string.punctuation`
