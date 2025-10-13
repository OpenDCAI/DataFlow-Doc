---
title: SimHashDeduplicateFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/simhashdeduplicatefilter/
---

## 📘 Overview
The `SimHashDeduplicateFilter` is an operator that performs near-deduplication by detecting similar text using the SimHash algorithm and Hamming distance. It converts text to fixed-length fingerprints and determines text similarity by calculating the Hamming distance between them. This method is faster than semantic deduplication and is suitable for rapid preprocessing of large-scale datasets, especially for detecting character-level similarities.

## __init__ function
```python
def __init__(self, fingerprint_size: int = 64, bound: float = 0.1):
```
### init parameters
| Parameter          | Type  | Default | Description                                                                                             |
| :----------------- | :---- | :------ | :------------------------------------------------------------------------------------------------------ |
| **fingerprint_size** | int   | 64      | The length of the SimHash fingerprint in bits.                                                          |
| **bound**            | float | 0.1     | The similarity threshold. Texts with a similarity greater than `1 - bound` are considered duplicates. |

## Prompt Template Descriptions

## run function
```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label'):
```
#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :----------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance for reading input data and writing the filtered output. |
| **input_keys** | list | None | A list of column names to be combined and used for deduplication. Mutually exclusive with `input_key`. |
| **input_key** | str | None | The single column name to be used for deduplication. Mutually exclusive with `input_keys`. |
| **output_key** | str | 'minhash_deduplicated_label' | The name of the new column that stores the deduplication label. A value of 1 indicates the item is unique and kept. |

## 🧠 Example Usage

#### 🧾 Default Output Format
The operator filters the input data, keeping only the unique rows. A new column, specified by `output_key`, is added with a value of 1 for all kept rows.

| Field | Type | Description |
| :----------------------------- | :-- | :--------------------------------------------------------------------- |
| *original_fields* | - | The original fields from the input data remain unchanged. |
| minhash_deduplicated_label | int | The deduplication result label. The output only contains rows with a value of 1. |

Example Input (`input_key` = "text"):
```json
{"text": "This is a sample sentence for testing."}
{"text": "This is a sample sentence for our testing."}
{"text": "A completely different sentence."}
```
Example Output:
```json
{"text": "This is a sample sentence for testing.", "minhash_deduplicated_label": 1}
{"text": "A completely different sentence.", "minhash_deduplicated_label": 1}
```
