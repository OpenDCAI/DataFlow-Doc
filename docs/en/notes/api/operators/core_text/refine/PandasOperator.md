---
title: PandasOperator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/refine/pandasoperator/
---

## 📘 Overview

The `PandasOperator` applies a list of user-defined transformation functions to a DataFrame. Each function takes a DataFrame as input and returns a modified DataFrame, allowing for flexible and sequential data manipulation like adding columns, renaming, sorting, and more.

## \_\_init\_\_ function

```python
def __init__(self, process_fn: list):
```

### init Parameters

| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **process_fn** | list | Required | A list of functions to apply to the DataFrame. Each function must accept a DataFrame and return a DataFrame. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run function

```python
def run(self, storage: DataFlowStorage):
```

#### Parameters

| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading the input DataFrame and writing the modified DataFrame. |

## 🧠 Example Usage

```python

```
