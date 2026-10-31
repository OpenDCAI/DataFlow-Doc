---
title: AlpacaMessagesGenerator
createTime: 2026/11/01 00:00:00
permalink: /en/api/operators/text_sft/generate/alpacamessagesgenerator/
---

## 📘 Overview
Converts Alpaca-style fields into standard `messages`. Optional context, history, and system columns are supported; no model is called and no rows are removed.

[Source](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/generate/alpaca_messages_generator.py)

## `__init__`
```python
def __init__(self, system_prompt=None):
```

### Init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| system_prompt | str \| None | None | Optional system prompt. `None` adds no system message; a nonblank string is inserted first. |

## `run`
```python
def run(self, storage, input_key="instruction", input_answer_key="output", output_key="messages", input_context_key=None, input_history_key=None, input_system_key=None):
```

### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | Required | DataFlow storage instance. |
| input_key | str | "instruction" | Instruction column; it must exist. |
| input_answer_key | str | "output" | Answer column; it must exist. |
| output_key | str | "messages" | New message column; it must not overwrite an existing column. |
| input_context_key | str \| None | None | Optional context column; `None` disables reading it. |
| input_history_key | str \| None | None | Optional history column; `None` disables reading it. |
| input_system_key | str \| None | None | Optional top-level system column; `None` disables reading it. |

### Behavior
`instruction` and `output` must be nonblank strings; enabled optional columns must exist and have the expected format. Context is included in the user message, history is converted to prior messages, and the system column or constructor prompt supplies a system message. Original fields, order, and row count are preserved; invalid input raises an exception.

## 🧠 Example Usage
```python
from dataflow.operators.text_sft.generate import AlpacaMessagesGenerator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="alpaca.jsonl")
operator = AlpacaMessagesGenerator(system_prompt=None)
operator.run(storage.step(), input_key="instruction", input_answer_key="output", output_key="messages", input_context_key=None, input_history_key=None, input_system_key=None)
```

## 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| messages | list[dict] | Messages converted from the Alpaca fields. |

**Example Output:**
```json
{"instruction":"Explain gravity.","output":"Gravity attracts objects with mass.","messages":[{"role":"user","content":"Explain gravity."},{"role":"assistant","content":"Gravity attracts objects with mass."}]}
```
