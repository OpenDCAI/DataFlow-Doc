---
title: SemDeduplicateFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/semdeduplicatefilter/
---

## 📘 Overview

[SemDeduplicateFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/sem_deduplicate_filter.py) is a semantic deduplication operator that identifies and filters out near-duplicate text based on BERT embeddings. It calculates the cosine similarity between text embedding vectors to detect semantically similar texts and retains only unique samples, improving dataset diversity by removing redundant information.

## `__init__`

```python
__init__(self, eps: float = 0.05, model_name: str = 'sentence-transformers/all-MiniLM-L6-v2', model_cache_dir: str = './dataflow_cache', device: str = 'cuda')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **eps** | float | 0.05 | Similarity threshold. A smaller value indicates that a higher cosine similarity is required to be considered a duplicate. The default of 0.05 means entries with a cosine similarity > 0.95 are flagged as duplicates. |
| **model_name** | str | 'sentence-transformers/all-MiniLM-L6-v2' | The name of the pretrained sentence-transformer model to use for generating embeddings. |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded model. |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda' or 'cpu'). |

## Prompt Template Descriptions

## `run`

```python
run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_keys** | list | None | A list of column names to be combined and used for deduplication. Use either `input_keys` or `input_key`. |
| **input_key** | str | None | The name of a single column to be used for deduplication. Use either `input_key` or `input_keys`. |
| **output_key** | str | 'minhash_deduplicated_label' | The column name where the deduplication label (1 for unique, 0 for duplicate) will be stored. |

## 🧠 Example Usage

#### 🧾 Default Output Format

The operator adds a new column (specified by `output_key`) to the DataFrame with a label indicating uniqueness and then filters the DataFrame, keeping only the rows marked as unique.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input data. |
| minhash_deduplicated_label | int | The label assigned by the operator. The output data is filtered to only include rows where this value is 1 (unique). |
