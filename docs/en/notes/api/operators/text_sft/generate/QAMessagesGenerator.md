---
title: QAMessagesGenerator
createTime: 2026/11/01 00:00:00
permalink: /en/api/operators/text_sft/generate/qamessagesgenerator/
---

## 📘 Overview
Converts QA data (question and answer) into a two-turn `messages` format. It does not call a model or remove rows; it adds one output column to the input data.

[Source](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/generate/qa_messages_generator.py)

## `__init__`
```python
def __init__(self, system_prompt=None):
```

### Init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| system_prompt | str \| None | None | Optional system prompt. `None` adds no system message; a nonblank string is inserted as the first system message. |

## `run`
```python
def run(self, storage, input_key="prompt", input_answer_key="answer", output_key="messages"):
```

### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | Required | DataFlow storage instance. |
| input_key | str | "prompt" | Question column; it must exist. |
| input_answer_key | str | "answer" | Answer column; it must exist. |
| output_key | str | "messages" | New message column; it must not overwrite an existing column. |

### Behavior
For each row, `prompt` and `answer` must be nonblank strings. The output is `[{{"role": "user", "content": prompt}}, {{"role": "assistant", "content": answer}}]`; a configured system prompt is inserted first. Original fields, row order, and row count are preserved; invalid input raises an exception.

## 🧠 Example Usage
```python
from dataflow.operators.text_sft.generate import QAMessagesGenerator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="qa.jsonl")
operator = QAMessagesGenerator(system_prompt=None)
operator.run(storage.step(), input_key="prompt", input_answer_key="answer", output_key="messages")
```

## 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| messages | list[dict] | Messages ordered as user/assistant, optionally preceded by system. |

**Example Output:**
```json
{"prompt":"What is 2 + 2?","answer":"4","messages":[{"role":"user","content":"What is 2 + 2?"},{"role":"assistant","content":"4"}]}
```
