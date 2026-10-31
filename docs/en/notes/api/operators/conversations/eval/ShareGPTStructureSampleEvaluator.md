---
title: ShareGPTStructureSampleEvaluator
createTime: 2026/11/01 00:00:00
permalink: /en/api/operators/conversations/eval/sharegptstructuresampleevaluator/
---

## 📘 Overview
Checks text ShareGPT `from`/`value` messages and an optional top-level system field. It does not call a model, transform data, or remove rows.

[Source](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/eval/sharegpt_structure_sample_evaluator.py)

## `__init__`
```python
def __init__(self):
```

This operator has no initialization parameters.

## `run`
```python
def run(self, storage, input_key="conversations", input_system_key=None, output_valid_key="source_valid", output_error_key="source_error"):
```

### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | Required | DataFlow storage instance. |
| input_key | str | "conversations" | ShareGPT conversation column; it must exist. |
| input_system_key | str \| None | None | Top-level system column; `None` disables reading it. |
| output_valid_key | str | "source_valid" | New boolean validation column. |
| output_error_key | str | "source_error" | New error-detail column. |

### Behavior
Only text `from`/`value` messages are accepted; an enabled top-level system column must exist and cannot duplicate a system message already present in the conversation. `input_system_key=None` disables reading that column. Valid rows receive `True` and `None`; invalid rows receive `False` and an error object. All original rows are retained.

## 🧠 Example Usage
```python
from dataflow.operators.conversations import ShareGPTStructureSampleEvaluator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="sharegpt.jsonl")
ShareGPTStructureSampleEvaluator().run(storage.step(), input_key="conversations", input_system_key=None)
```

## 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| source_valid | bool | Whether the row passed ShareGPT structural validation. |
| source_error | dict \| None | Error details on failure; `None` for a valid row. |

**Example Output:**
```json
{"conversations":[{"from":"human","value":"Hello"},{"from":"gpt","value":"Hi"}],"source_valid":true,"source_error":null}
```
