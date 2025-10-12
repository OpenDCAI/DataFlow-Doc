---
title: NgramHashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/ngramhashdeduplicatefilter/
---

## 📘 Overview

`NgramHashDeduplicateFilter` operator combines n-gram techniques with hashing algorithms to identify similar text, achieving approximate deduplication. It segments text into multiple n-gram fragments, calculates hash values for each fragment, and determines text similarity by comparing hash set similarity.

## `__init__` Function

```python
def __init__(self, n_gram: int = 3, hash_func: str = 'md5', diff_size : int = 1)
```

### Init Parameters

| Parameter | Type | Default | Description |
| :---------- | :---- | :------ | :------------------------------------------- |
| **n_gram** | int | 3 | Number of fragments to segment text into. |
| **hash_func** | str | 'md5' | Hash function type, supports 'md5', 'sha256', and 'xxh3'. |
| **diff_size** | int | 1 | Hash set difference threshold; values below this will be judged as similar text. |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```

#### Parameters

| Name | Type | Default | Description |
| :----------- | :---------------- | :------------------------------- | :----------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_keys** | list | None | List of input column names for deduplication. Choose one of `input_key` or `input_keys`. |
| **input_key** | str | None | Single input column name for deduplication. Choose one of `input_key` or `input_keys`. |
| **output_key** | str | 'minhash_deduplicated_label' | Output deduplication label column name. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import NgramHashDeduplicateFilter
from dataflow.utils.storage import FileStorage

class NgramHashDeduplicateFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/ngramhash_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = NgramHashDeduplicateFilter(
            n_gram=3,
            hash_func='md5',
            diff_size=1
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='minhash_deduplicated_label'
        )

if __name__ == "__main__":
    test = NgramHashDeduplicateFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

The operator adds a new column specified by `output_key` to the output DataFrame to mark whether data is unique (1 for unique), retaining only unique rows.

| Field | Type | Description |
| :------------------------------- | :---- | :--------------------------------- |
| [Original fields] | - | All original input fields retained. |
| [output_key] | int | Deduplication label; value of 1 indicates this row is unique data. |

### 📋 Example Input

```json
{"text": "这是第一个测试文本，用于检测去重功能。"}
{"text": "这是第一个测试文本，用于检测去重功能。"}
{"text": "这是完全不同的第二个测试文本。"}
```

### 📤 Example Output

```json
{"text": "这是第一个测试文本，用于检测去重功能。", "minhash_deduplicated_label": 1}
{"text": "这是完全不同的第二个测试文本。", "minhash_deduplicated_label": 1}
```

### 📊 Result Analysis

**Sample 1 (First text)**:
- Segment text into 3 n-gram parts
- Calculate MD5 hash value for each part
- Hash set appears for first time
- **Retained** (unique sample)

**Sample 2 (Duplicate text)**:
- Hash set identical to Sample 1
- Hash intersection size ≥ diff_size (1)
- **Filtered out** (duplicate)

**Sample 3 (Different text)**:
- Hash set significantly different from previous samples
- Hash intersection size < diff_size
- **Retained** (unique sample)

**How It Works**:
1. Evenly segment text into `n_gram` parts
2. Calculate hash value for each part (supports md5, sha256, xxh3)
3. Compare hash set intersection size
4. Intersection < `diff_size` considered different text

**Use Cases**:
- Fast text deduplication
- Large-scale dataset preprocessing
- Detect approximate duplicate content
- Web content deduplication

**Notes**:
- Larger `n_gram` means more segments and higher precision
- Smaller `diff_size` means stricter deduplication
- Supports three hash functions: md5 (fast), sha256 (secure), xxh3 (fastest)
- Suitable for character-level similarity detection
