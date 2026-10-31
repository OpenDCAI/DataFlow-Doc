---
title: QAStructureSampleEvaluator
createTime: 2026/11/01 00:00:00
permalink: /en/api/operators/text_sft/eval/qastructuresampleevaluator/
---

## 📘 Overview
Checks whether a QA sample contains nonblank question and answer fields. It does not call a model, transform data, or remove rows; it writes a structural validation result for every row.

[Source](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/eval/qa_structure_sample_evaluator.py)

## `__init__`
```python
def __init__(self):
```

This operator has no initialization parameters.

## `run`
```python
def run(self, storage, input_key="prompt", input_answer_key="answer", output_valid_key="source_valid", output_error_key="source_error"):
```

### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | Required | DataFlow storage instance. |
| input_key | str | "prompt" | Question column; it must exist. |
| input_answer_key | str | "answer" | Answer column; it must exist. |
| output_valid_key | str | "source_valid" | New boolean validation column. |
| output_error_key | str | "source_error" | New error-detail column. |

### Behavior
Both input fields must be nonblank strings. This operator has no optional input columns, so `None` cannot disable a run input. Valid rows receive `True` and `None`; invalid rows receive `False` and an error object containing `field`, `code`, `message`, and `row`. All original rows are retained.

## 🧠 Example Usage
```python
from dataflow.operators.text_sft.eval import QAStructureSampleEvaluator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="qa.jsonl")
QAStructureSampleEvaluator().run(storage.step(), input_key="prompt", input_answer_key="answer", output_valid_key="source_valid", output_error_key="source_error")
```

## 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| source_valid | bool | Whether the row passed QA structural validation. |
| source_error | dict \| None | Error details on failure; `None` for a valid row. |

**Example Output:**
```json
{"prompt":"What is 2 + 2?","answer":"4","source_valid":true,"source_error":null}
```
