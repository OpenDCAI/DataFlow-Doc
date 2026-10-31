---
title: AlpacaStructureSampleEvaluator
createTime: 2026/11/01 00:00:00
permalink: /en/api/operators/text_sft/eval/alpacastructuresampleevaluator/
---

## 📘 Overview
Checks the structure of Alpaca instruction/output fields and optional context, history, and system fields. It does not call a model or remove rows.

[Source](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/eval/alpaca_structure_sample_evaluator.py)

## `__init__`
```python
def __init__(self):
```

This operator has no initialization parameters.

## `run`
```python
def run(self, storage, input_key="instruction", input_answer_key="output", input_context_key=None, input_history_key=None, input_system_key=None, output_valid_key="source_valid", output_error_key="source_error"):
```

### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | Required | DataFlow storage instance. |
| input_key | str | "instruction" | Instruction column; it must exist. |
| input_answer_key | str | "output" | Answer column; it must exist. |
| input_context_key | str \| None | None | Context column; `None` disables reading it. |
| input_history_key | str \| None | None | History column; `None` disables reading it. |
| input_system_key | str \| None | None | System column; `None` disables reading it. |
| output_valid_key | str | "source_valid" | New boolean validation column. |
| output_error_key | str | "source_error" | New error-detail column. |

### Behavior
Instruction and output must be nonblank strings; enabled optional columns must exist and have the expected format. An optional input set to `None` is disabled and is not read. Valid rows receive `True` and `None`; invalid rows receive `False` and an error object. All original rows are retained.

## 🧠 Example Usage
```python
from dataflow.operators.text_sft.eval import AlpacaStructureSampleEvaluator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="alpaca.jsonl")
AlpacaStructureSampleEvaluator().run(storage.step(), input_key="instruction", input_answer_key="output", input_context_key=None, input_history_key=None, input_system_key=None)
```

## 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| source_valid | bool | Whether the row passed Alpaca structural validation. |
| source_error | dict \| None | Error details on failure; `None` for a valid row. |

**Example Output:**
```json
{"instruction":"Explain gravity.","output":"Gravity attracts objects with mass.","source_valid":true,"source_error":null}
```
