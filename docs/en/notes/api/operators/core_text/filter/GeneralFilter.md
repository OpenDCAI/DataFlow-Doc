---
title: GeneralFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/filter/generalfilter/
---

## 📘 Overview
The `GeneralFilter` operator is designed to filter a DataFrame using a list of flexible, user-defined filtering rules. Each rule is a function that returns a boolean Series, specifying which rows to keep. All provided rules are combined using a logical AND operation.

## __init__
```python
def __init__(self, filter_rules: list)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **filter_rules** | list | Required | A list of callable functions (e.g., lambda expressions) used for filtering. Each function must accept a DataFrame and return a boolean Series. |

## Prompt Template Descriptions
<br>

## run
```python
def run(self, storage: DataFlowStorage)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading the input DataFrame and writing the filtered output DataFrame. |

## 🧠 Example Usage
<br>
