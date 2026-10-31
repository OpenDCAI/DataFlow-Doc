---
title: PreferenceStructureSampleEvaluator
createTime: 2026/11/01 00:00:00
permalink: /en/api/operators/text_sft/eval/preferencestructuresampleevaluator/
---

## 📘 Overview
Checks whether the prompt, chosen, and rejected fields of a preference sample are nonblank strings. It does not call a model or remove rows.

[Source](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/eval/preference_structure_sample_evaluator.py)

## `__init__`
```python
def __init__(self):
```

This operator has no initialization parameters.

## `run`
```python
def run(self, storage, input_prompt_key="prompt", input_chosen_key="chosen", input_rejected_key="rejected", output_valid_key="preference_valid", output_error_key="preference_error"):
```

### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | Required | DataFlow storage instance. |
| input_prompt_key | str | "prompt" | Prompt column; it must exist. |
| input_chosen_key | str | "chosen" | Preferred answer column; it must exist. |
| input_rejected_key | str | "rejected" | Rejected answer column; it must exist. |
| output_valid_key | str | "preference_valid" | New boolean validation column. |
| output_error_key | str | "preference_error" | New error-detail column. |

### Behavior
The three input column names must be nonblank and distinct; the corresponding row values must also be nonblank strings. This operator has no optional input columns, so `None` cannot disable a field. Valid rows receive `True` and `None`; invalid rows receive `False` and an error object. All original rows are retained.

## 🧠 Example Usage
```python
from dataflow.operators.text_sft.eval import PreferenceStructureSampleEvaluator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="preference.jsonl")
PreferenceStructureSampleEvaluator().run(storage.step(), input_prompt_key="prompt", input_chosen_key="chosen", input_rejected_key="rejected")
```

## 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| preference_valid | bool | Whether the row passed preference validation. |
| preference_error | dict \| None | Error details on failure; `None` for a valid row. |

**Example Output:**
```json
{"prompt":"Which answer is better?","chosen":"The concise answer.","rejected":"An empty answer.","preference_valid":true,"preference_error":null}
```
