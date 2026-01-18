---
title: CCNetDeduplicateFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/filter/ccnetdeduplicatefilter/
---

## 📘 Overview
[CCNetDeduplicateFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/deduplicate/ccnet_deduplicate_filter.py) is a deduplication operator that uses the CCNet method. It identifies and removes duplicate data entries by computing the SHA-1 hash of specified content and filtering based on the first N bits of the hash. This allows for precise and efficient exact deduplication.

## __init__ function
```python
def __init__(self, bit_length: int = 64):
```
### init Parameters
| Parameter | Type | Default | Description |
| :---------- | :--- | :------ | :------------------------------------------- |
| **bit_length** | int | 64 | The number of bits of the SHA-1 hash to use for duplicate detection. |

## Prompt Template Descriptions

## run function
```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```
#### Parameters
| Name | Type | Default | Description |
| :----------- | :---------------- | :----------------------------- | :------------------------------------------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_keys** | list | None | A list of column names whose content will be concatenated and used to compute the hash. Use either this or `input_key`. |
| **input_key** | str | None | The name of a single column whose content will be used to compute the hash. Use either this or `input_keys`. |
| **output_key** | str | 'minhash_deduplicated_label' | The name of the new column added to store the deduplication label. `1` indicates a unique item, `0` indicates a duplicate. |

## 🧠 Example Usage
```python

```

#### 🧾 Output Format
The operator adds a new column (specified by `output_key`) to the data. It marks the first occurrence of an item with `1` and subsequent duplicates with `0`. The final output stored contains only the unique rows (where the label is `1`).

| Field | Type | Description |
| :----------------------------- | :--- | :------------------------------------------------------------------------------------------------ |
| *original_fields* | - | The original fields from the input data are preserved. |
| minhash_deduplicated_label | int | The deduplication label. The output file will only contain rows where this value is `1`. |

**Example Input:**
```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)..."
}
```
**Example Output:**
```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)...",
  "minhash_deduplicated_label": 1
}
```
