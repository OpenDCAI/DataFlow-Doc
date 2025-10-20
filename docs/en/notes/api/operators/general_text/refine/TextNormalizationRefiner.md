---
title: TextNormalizationRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/textnormalizationrefiner/
---

## 📘 Overview

`TextNormalizationRefiner` is a text normalization operator designed to standardize date and currency formats in text data. This operator converts various common date representations (such as `MM/DD/YYYY`, `Month DD, YYYY`) to the standard `YYYY-MM-DD` format, and converts US dollar currency representations (such as `$50`) to `50 USD` format, thereby improving data consistency and uniformity.

## __init__ function

```python
def __init__(self)
```

### init parameter description

| Parameter | Type | Default | Description |
| :---  | :--- | :------ | :---------- |
| **None** | -    | -       | This operator requires no initialization parameters. |

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name          | Type              | Default | Description                                 |
| :------------ | :---------------- | :------ | :------------------------------------------ |
| **storage**   | DataFlowStorage   | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str               | Required | Input column name for text field to be normalized. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import TextNormalizationRefiner
from dataflow.utils.storage import FileStorage

class TextNormalizationRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/text_normalization_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = TextNormalizationRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = TextNormalizationRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with normalized date and currency formats |

### 📋 Sample Input

```json
{"text":"Event on 12/25/2024 at $50"}
{"text":"Meeting on January 15, 2025"}
{"text":"Cost: $100, Discount: $20"}
```

### 📤 Sample Output

```json
{"text":"Event on 2024-25-12 at 50 USD"}
{"text":"Meeting on 2025-01-15"}
{"text":"Cost: 100 USD, Discount: 20 USD"}
```

### 📊 Results Analysis

**Sample 1**: Date "12/25/2024" → "2024-25-12", Currency "$50" → "50 USD"
**Sample 2**: Date "January 15, 2025" → "2025-01-15"
**Sample 3**: Multiple currencies "$100" "$20" → "100 USD" "20 USD"

**Use Cases**:
- Unify date formats
- Normalize currency representation
- Data standardization

**Notes**:
- Dates converted to YYYY-MM-DD format
- Currency converted to "amount USD" format
