---
title: HashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/hashdeduplicatefilter/
---

## 📘 Overview

`HashDeduplicateFilter` is an exact deduplication operator that identifies and filters duplicate data by calculating hash values of specified text fields. This operator supports multiple efficient hash algorithms, including md5, sha256, and xxh3, to meet different performance and security requirements.

## __init__ Function
```python
def __init__(self, hash_func: str = 'md5')
```
### Initialization Parameters
| Parameter Name | Type | Default | Description |
| :---------- | :---- | :------ | :------------------------------------------------ |
| **hash_func** | str | 'md5' | Hash function name. Options: 'md5', 'sha256', or 'xxh3'. |

## run Function
```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```
#### Parameters
| Name | Type | Default | Description |
| :----------- | :---------------- | :-------------------------------| :----------------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance responsible for reading and writing data. |
| **input_keys** | list | None | List of multiple fields to use for hash calculation. Choose one of `input_keys` or `input_key`. |
| **input_key** | str | None | Single field name to use for hash calculation. Choose one of `input_keys` or `input_key`. |
| **output_key** | str | 'minhash_deduplicated_label' | Output column name to mark whether data is duplicate (1 means unique, 0 means duplicate). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import HashDeduplicateFilter
from dataflow.utils.storage import FileStorage

class HashDeduplicateFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/hash_deduplicate_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = HashDeduplicateFilter(hash_func='md5')
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = HashDeduplicateFilterTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :------------------------------- | :---- | :------------------------------------------------------------------- |
| text | str | Original input text field |
| minhash_deduplicated_label | int | Deduplication marker. 1 means this data appears for the first time, 0 means duplicate data |

### 📋 Sample Input

```json
{"text": "This is the first unique sentence."}
{"text": "This is a duplicate sentence."}
{"text": "This is a duplicate sentence."}
{"text": "This is the second unique sentence."}
```

### 📤 Sample Output

```json
{"text": "This is the first unique sentence.", "minhash_deduplicated_label": 1}
{"text": "This is a duplicate sentence.", "minhash_deduplicated_label": 1}
{"text": "This is the second unique sentence.", "minhash_deduplicated_label": 1}
```

### 📊 Result Analysis

In this test, 3 unique data items were retained after deduplicating 4 input data items:

**Sample 1 (Unique)**:
- Text: "This is the first unique sentence."
- First occurrence
- **Retained** (minhash_deduplicated_label=1)

**Sample 2 (Unique)**:
- Text: "This is a duplicate sentence."
- First occurrence
- **Retained** (minhash_deduplicated_label=1)

**Sample 3 (Duplicate)**:
- Text: "This is a duplicate sentence."
- Identical to Sample 2
- **Filtered** (not in output)

**Sample 4 (Unique)**:
- Text: "This is the second unique sentence."
- First occurrence
- **Retained** (minhash_deduplicated_label=1)

**Use Cases**:
- Dataset deduplication, removing identical records
- Improve data diversity
- Reduce storage space and computational overhead
- Avoid duplicate samples in training data

**Hash Algorithm Selection**:
- **md5**: Balanced performance and collision rate, suitable for most scenarios (default)
- **sha256**: Higher security, extremely low collision rate
- **xxh3**: Fastest hash speed, suitable for ultra-large scale datasets

**Notes**:
- This operator performs exact deduplication, only completely identical text is identified as duplicate
- Retains the first occurrence, filters subsequent duplicate occurrences
- Supports single-field or multi-field combined deduplication (via `input_key` or `input_keys`)
- Hash values are not stored in output, only used for deduplication judgment
