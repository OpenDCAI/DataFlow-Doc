---
title: MinHashDeduplicateFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/minhashdeduplicatefilter/
---

# 📘 Overview
`MinHashDeduplicateFilter` is an operator that performs efficient near-duplicate detection using MinHash and Locality-Sensitive Hashing (LSH). It converts texts into MinHash signatures and uses LSH to quickly find similar texts, enabling near-deduplication for large-scale datasets.

## __init__
```python
def __init__(self, num_perm=128, threshold=0.9, use_n_gram=True, ngram=5):
```
### Parameters
| Parameter | Type | Default | Description |
| :---------- | :--- | :-------- | :-------------------------------------------------------------- |
| **num_perm** | int | 128 | The number of permutations for generating MinHash signatures. |
| **threshold** | float | 0.9 | The Jaccard similarity threshold above which texts are considered duplicates. |
| **use_n_gram** | bool | True | Specifies whether to use n-gram tokenization for creating MinHash. |
| **ngram** | int | 5 | The value of 'n' for n-gram tokenization if `use_n_gram` is True. |

## run
```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label'):
```
### Parameters
| Parameter | Type | Default | Description |
| :------------ | :---------------- | :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance used for reading the input DataFrame and writing the deduplicated output. |
| **input_keys** | list | None | A list of column names whose content will be concatenated and used for deduplication. Use this for comparing combined text from multiple fields. |
| **input_key** | str | None | The name of the single column to be used for deduplication. Either `input_key` or `input_keys` must be provided, but not both. |
| **output_key** | str | 'minhash_deduplicated_label' | The name of the new column that will be added to the DataFrame to store the deduplication label (1 for unique, 0 for duplicate). |

## 🧠 Example Usage
```python
# Blank as per request
```

#### 🧾 Output Format
The operator filters the input dataframe, keeping only the rows identified as unique. It also adds a new column (specified by `output_key`) to the dataframe, where `1` indicates a unique item.

| Field | Type | Description |
| :--------------------------- | :--- | :------------------------------------------- |
| *(original_fields)* | * | Original fields from the input data. |
| **minhash_deduplicated_label** | int | The label indicating uniqueness; always `1` in the output dataframe as duplicates are removed. |

**Example Input:**
```json
{"text": "This is the first sentence."}
{"text": "This is the second sentence."}
{"text": "This is the first sentence."}
```
**Example Output:**
```json
{"text": "This is the first sentence.", "minhash_deduplicated_label": 1}
{"text": "This is the second sentence.", "minhash_deduplicated_label": 1}
```