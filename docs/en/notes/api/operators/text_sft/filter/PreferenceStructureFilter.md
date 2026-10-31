---
title: PreferenceStructureFilter
createTime: 2026/11/01 00:00:00
permalink: /en/api/operators/text_sft/filter/preferencestructurefilter/
---

## 📘 Overview
Filters preference data using the `preference_valid` boolean validation column. Passing rows are kept and failing rows are removed; no model is called and no column is added.

[Source](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/filter/preference_structure_filter.py)

## `__init__`
```python
def __init__(self):
```

This operator has no initialization parameters.

## `run`
```python
def run(self, storage, input_key="preference_valid"):
```

### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | Required | DataFlow storage instance. |
| input_key | str | "preference_valid" | Required boolean validation column; it must exist. |

### Behavior
Every value in the validation column must be exactly `True` or `False`. `input_key` is required; `None` cannot disable filtering. Passing rows and all original fields are retained, failing rows are removed, and the operator returns an empty output-column list.

## 🧠 Example Usage
```python
from dataflow.operators.text_sft.filter import PreferenceStructureFilter
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="preference_validated.jsonl")
PreferenceStructureFilter().run(storage.step(), input_key="preference_valid")
```

## 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| original fields | unchanged | Only rows with `preference_valid=True` are retained; no new field is added. |

**Example Output:**
```json
{"prompt":"Which answer is better?","preference_valid":true}
```
