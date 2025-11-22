---
title: DBOperator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/db/generate/dboperator/
---

# 📘 Overview

`DBOperator` is an operator designed to execute a given SQL expression against a database storage system.

## `__init__`
```python
def __init__(self, expr)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **expr** | str | Required | The SQL expression to execute. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, storage:MyScaleDBStorage, input_key:str)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | MyScaleDBStorage | Required | The database storage instance to use. |
| **input_key** | str | Required | The key for the input data. |

## 🧠 Example Usage
```python

```
