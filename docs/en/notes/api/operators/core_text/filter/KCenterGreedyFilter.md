---
title: KCenterGreedyFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/filter/kcentergreedyfilter/
---

## 📘 Overview

The `KCenterGreedyFilter` is an operator designed to select a representative subset of document fragments from a large dataset. It utilizes the K-Center Greedy algorithm, based on text embeddings, to ensure the selected samples are diverse and effectively cover the feature space of the original data. This operator is particularly useful for creating a smaller, high-quality dataset for subsequent tasks, such as generating seed Question-Answer pairs.

## `__init__` function

```python
def __init__(self, num_samples: int, embedding_serving : LLMServingABC = None)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **num_samples** | int | Required | The target number of samples to select from the dataset. |
| **embedding_serving** | LLMServingABC | None | An embedding service instance used to generate vector representations of the input text. |

### Prompt Template Descriptions

*(This operator does not use prompt templates.)*

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str = "content")
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading the input DataFrame and writing the filtered output. |
| **input_key** | str | "content" | The column name in the input DataFrame that contains the text content to be filtered. |

## 🧠 Example Usage

```python
# No example usage provided
```

#### 🧾 Output Format

The operator filters the rows of the input DataFrame and writes the resulting subset back to storage. The schema of the output data is identical to the input, but it contains only the `num_samples` rows selected by the algorithm.

**Example Input Data:**
A DataFrame with multiple rows and a column specified by `input_key` (e.g., "content").

**Example Output Data:**
A new DataFrame stored to a file, containing a subset of the original rows. All original columns are preserved for the selected rows.
