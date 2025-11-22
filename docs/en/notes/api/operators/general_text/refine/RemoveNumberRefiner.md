---
title: RemoveNumberRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removenumberrefiner/
---

## 📘 Overview
The `RemoveNumberRefiner` is an operator designed to remove all numeric characters (0-9) from a specified text field within a dataset. It processes each text entry, filters out digits, and updates the dataset with the refined text. This is useful for cleaning textual data where numbers are irrelevant.

## `__init__` function
```python
def __init__(self)
```
This operator does not require any parameters during initialization.

## `run` function
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
from dataflow.operators.general_text import RemoveNumberRefiner
from dataflow.utils.storage import FileStorage

class RemoveNumberRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_number_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveNumberRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveNumberRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with numbers removed |

### 📋 Sample Input

```json
{"text":"Hello world without numbers."}
{"text":"Born in 1990 and moved in 2020."}
{"text":"Price is $100 for 5 items."}
{"text":"Call me at 123-456-7890."}
{"text":"Room 404, Building 3, Floor 12."}
```

### 📤 Sample Output

```json
{"text":"Hello world without numbers."}
{"text":"Born in  and moved in ."}
{"text":"Price is $ for  items."}
{"text":"Call me at --."}
{"text":"Room , Building , Floor ."}
```

### 📊 Results Analysis

In this test, 4 out of 5 input samples were modified:

**Sample 1 (No Numbers)**:
- Original: "Hello world without numbers."
- Contains no numeric characters
- **Unchanged** (remains as is)

**Sample 2 (Years)**:
- Original: "Born in 1990 and moved in 2020."
- Removed all numeric characters 1, 9, 9, 0, 2, 0, 2, 0
- Result: "Born in  and moved in ."
- **Modified**

**Sample 3 (Prices and Quantities)**:
- Original: "Price is $100 for 5 items."
- Removed digits 1, 0, 0, 5, kept currency symbol and punctuation
- Result: "Price is $ for  items."
- **Modified**

**Sample 4 (Phone Number)**:
- Original: "Call me at 123-456-7890."
- Removed all digits, kept hyphens and punctuation
- Result: "Call me at --."
- **Modified**

**Sample 5 (Room Numbers)**:
- Original: "Room 404, Building 3, Floor 12."
- Removed all digits 4, 0, 4, 3, 1, 2
- Result: "Room , Building , Floor ."
- **Modified**

**Use Cases**:
- Remove noisy numbers from text
- Prepare data for pure text analysis
- Privacy protection (remove potentially sensitive numeric information)
- Text normalization processing

**Notes**:
- This operator uses the `isdigit()` method to identify numeric characters
- Only removes Arabic numerals 0-9
- Does not remove Chinese numerals (e.g., 一, 二, 三)
- May leave extra spaces after number removal; recommend using with `RemoveExtraSpacesRefiner`
- Removes all numbers including dates, prices, IDs, etc.; use with caution
