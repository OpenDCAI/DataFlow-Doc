---
title: HashDeduplicateFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/hashdeduplicatefilter/
---

## 📘 Overview
[HashDeduplicateFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/hash_deduplicate_filter.py) is an exact deduplication operator that uses various hash functions to identify and filter duplicate data. It supports 'md5', 'sha256', and 'xxh3' algorithms to compute hash values from text fields, ensuring that only unique records are retained.

## `__init__` function
```python
def __init__(self, hash_func: str = 'md5')
```
| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **hash_func** | str | 'md5' | The name of the hash function to use. Supported options are 'md5', 'sha256', and 'xxh3'. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| --- | --- | --- | --- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```
| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance responsible for reading and writing data. |
| **input_keys** | list | None | A list of field names to use for hash calculation. Mutually exclusive with `input_key`. |
| **input_key** | str | None | A single field name to use for hash calculation. Mutually exclusive with `input_keys`. |
| **output_key** | str | 'minhash_deduplicated_label' | The name of the output column for the deduplication label. |

## 🧠 Example Usage
```python

```
#### 🧾 Default Output Format
The operator adds a new column (specified by `output_key`) to the input data. This column contains a label: `1` for the first occurrence of an item (unique) and `0` for subsequent duplicates. The final output dataframe only contains the rows marked as unique (`1`).

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original input fields. |
| minhash_deduplicated_label | int | The deduplication label. Only rows with a value of `1` are kept in the output. |

**Example Input:**
```json
{"text": "This is the first unique sentence."}
{"text": "This is a second unique sentence."}
{"text": "This is the first unique sentence."}
```
**Example Output:**
```json
{"text": "This is the first unique sentence.", "minhash_deduplicated_label": 1}
{"text": "This is a second unique sentence.", "minhash_deduplicated_label": 1}
```
