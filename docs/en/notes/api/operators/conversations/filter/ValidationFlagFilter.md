---
title: ValidationFlagFilter
createTime: 2026/11/01 00:00:00
permalink: /en/api/operators/conversations/filter/validationflagfilter/
---

## 📘 Overview
Filters rows using an existing boolean validation column. Rows with `True` are kept and rows with `False` are removed; no model is called and no column is added.

[Source](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/filter/validation_flag_filter.py)

## `__init__`
```python
def __init__(self):
```

This operator has no initialization parameters.

## `run`
```python
def run(self, storage, input_key="source_valid"):
```

### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | Required | DataFlow storage instance. |
| input_key | str | "source_valid" | Required boolean validation column; it must exist. |

### Behavior
Every value in the validation column must be exactly `True` or `False`. `input_key` is required; `None` cannot disable filtering. Passing rows and all original fields are retained, failing rows are removed, and the operator returns an empty output-column list.

## 🧠 Example Usage
```python
from dataflow.operators.conversations import ValidationFlagFilter
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="validated.jsonl")
ValidationFlagFilter().run(storage.step(), input_key="source_valid")
```

## 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| original fields | unchanged | Only rows with `True` are retained; no new field is added. |

**Example Output:**
```json
{"prompt":"Hello","source_valid":true}
```
