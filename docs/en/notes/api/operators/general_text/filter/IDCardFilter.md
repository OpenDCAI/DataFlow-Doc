---
title: IDCardFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/idcardfilter/
---

## 📘 Overview
The `IDCardFilter` is an operator designed to detect and filter text that contains terms related to ID cards. It uses regular expression matching to identify ID card number patterns and associated keywords to protect sensitive information.

## `__init__` function
```python
def __init__(self, threshold: int = 3)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | int | 3 | The number of matches for ID-related terms at which a text entry is filtered out. |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'id_card_filter_label')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be filtered. |
| **output_key** | str | 'id_card_filter_label' | The name of the output column where the filter result (0 or 1) will be stored. |

## Prompt Template Descriptions
(No prompt templates are used for this operator.)

## 🧠 Example Usage
```python
# Insufficient information to provide a complete example.
```

#### 🧾 Output Format
The operator adds a new column (`output_key`) to the input DataFrame and then filters it, returning only the rows that pass the check (where the `output_key` column has a value of 1).

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | - | Original columns from the input DataFrame. |
| id_card_filter_label | int | A label added by the operator. The output only contains rows where this value is 1. |
