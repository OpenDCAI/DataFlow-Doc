---
title: RemovePunctuationRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removepunctuationrefiner/
---

## 📘 Overview
The `RemovePunctuationRefiner` is an operator designed to remove all punctuation symbols from a given text field.

## __init__ function
```python
def __init__(self)
```
### init parameter description
| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | No parameters required for initialization. |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be processed. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import RemovePunctuationRefiner
from dataflow.utils.storage import FileStorage

class RemovePunctuationRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_punctuation_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemovePunctuationRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemovePunctuationRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with punctuation removed |

### 📋 Sample Input

```json
{"text":"Hello world"}
{"text":"Hello, world! How are you?"}
{"text":"Price: $100; Discount: 20%"}
{"text":"Email: test@example.com"}
{"text":"It's a wonderful day... isn't it?!"}
```

### 📤 Sample Output

```json
{"text":"Hello world"}
{"text":"Hello world How are you"}
{"text":"Price 100 Discount 20"}
{"text":"Email testexamplecom"}
{"text":"Its a wonderful day isnt it"}
```

### 📊 Results Analysis

In this test, 4 out of 5 input samples were modified:

**Sample 1 (No Punctuation)**:
- Original: "Hello world"
- Contains no punctuation marks
- **Unchanged** (remains as is)

**Sample 2 (Common Punctuation)**:
- Original: "Hello, world! How are you?"
- Removed comma, exclamation mark, question mark
- Result: "Hello world How are you"
- **Modified**

**Sample 3 (Special Symbols)**:
- Original: "Price: $100; Discount: 20%"
- Removed colon, dollar sign, semicolon, percent sign
- Result: "Price 100 Discount 20"
- **Modified**

**Sample 4 (Email Symbols)**:
- Original: "Email: test@example.com"
- Removed colon, @ symbol, periods
- Result: "Email testexamplecom"
- **Modified**

**Sample 5 (Contractions and Ellipsis)**:
- Original: "It's a wonderful day... isn't it?!"
- Removed apostrophes, ellipsis, question mark, exclamation mark
- Result: "Its a wonderful day isnt it"
- **Modified**

**Use Cases**:
- Text standardization and normalization
- Prepare data for word frequency analysis
- Remove noisy symbols from text
- Preprocessing before text classification

**Notes**:
- This operator is based on `string.punctuation` set, which includes: `!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`
- Removes all English punctuation marks
- Does not remove Chinese punctuation (e.g., 。，！？etc.)
- May leave extra spaces or cause word concatenation after punctuation removal
- Recommend using with `RemoveExtraSpacesRefiner` to clean extra spaces
