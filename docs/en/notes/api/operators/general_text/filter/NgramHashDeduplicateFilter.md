---
title: NgramHashDeduplicateFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/ngramhashdeduplicatefilter/
---

## 📘 Overview
The `NgramHashDeduplicateFilter` is an operator that detects and removes near-duplicate text entries from a dataset. It works by splitting text into multiple n-gram segments, computing hash values for each segment, and judging text similarity by comparing the resulting hash sets.

## `__init__`
```python
def __init__(self, n_gram: int = 3, hash_func: str = 'md5', diff_size : int = 1):
```
| Parameter | Type | Default | Description |
| :-------------- | :---- | :-------- | :----------------------------------------------------------------------------------- |
| **n_gram** | int | 3 | The number of segments to split the text into for hashing. |
| **hash_func** | str | 'md5' | The hashing algorithm to use. Supported options are 'md5', 'sha256', and 'xxh3'. |
| **diff_size** | int | 1 | The hash set difference threshold. Texts are considered duplicates if the difference between their hash sets is less than this value. |

## Prompt Template Descriptions

## `run`
```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label'):
```
Executes the main operator logic to read a DataFrame from storage, perform n-gram hash-based deduplication, and write the filtered result back to storage.

| Parameter | Type | Default | Description |
| :------------- | :---------------- | :------------------------------- | :----------------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_keys** | list | None | A list of input column names to be combined and checked for duplication. |
| **input_key** | str | None | A single input column name containing the text to be deduplicated. Use either `input_key` or `input_keys`. |
| **output_key** | str | 'minhash_deduplicated_label' | The name of the new column that will be added to store the deduplication label (1 for unique, 0 for duplicate). |

## 🧠 Example Usage

## 🧾 Output Format
The operator filters the input DataFrame and writes a new DataFrame to storage containing only the unique rows. A new column, specified by `output_key`, is added to the DataFrame, where a value of `1` indicates that the row is unique.

| Field | Type | Description |
| :------------------------------- | :-- | :----------------------------------------------------------------------- |
| *original_columns* | - | The original columns from the input DataFrame are preserved. |
| **minhash_deduplicated_label** | int | The label indicating uniqueness. This column will have a value of `1` for all rows in the output DataFrame. The column name is determined by the `output_key` parameter. |
