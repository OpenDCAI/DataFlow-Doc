---
title: ConversationStructureSampleEvaluator
createTime: 2026/11/01 00:00:00
permalink: /en/api/operators/conversations/eval/conversationstructuresampleevaluator/
---

## 📘 Overview
Checks standard `messages` conversation structure, including role order, tool calls, tool responses, and the final assistant response. It does not call a model or remove rows.

[Source](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/eval/conversation_structure_sample_evaluator.py)

## `__init__`
```python
def __init__(self, profile="conversation"):
```

### Init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| profile | str | "conversation" | Validation profile. `"conversation"` checks a full conversation, including tool calls; `"single_turn"` accepts only a single system/user/assistant turn. |

## `run`
```python
def run(self, storage, input_key="messages", output_valid_key="conversation_valid", output_error_key="conversation_error"):
```

### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | Required | DataFlow storage instance. |
| input_key | str | "messages" | Message column; it must exist. |
| output_valid_key | str | "conversation_valid" | New boolean validation column. |
| output_error_key | str | "conversation_error" | New error-detail column. |

### Behavior
`profile="conversation"` checks tool calls, tool responses, role order, and the final assistant response. `profile="single_turn"` accepts only a single system/user/assistant turn. This operator has no optional input columns, so `None` cannot disable a field. Valid rows receive `True` and `None`; invalid rows receive `False` and an error object. All original rows are retained.

## 🧠 Example Usage
```python
from dataflow.operators.conversations import ConversationStructureSampleEvaluator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="messages.jsonl")
ConversationStructureSampleEvaluator(profile="conversation").run(storage.step(), input_key="messages")
```

## 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| conversation_valid | bool | Whether the row passed conversation validation. |
| conversation_error | dict \| None | Error details on failure; `None` for a valid row. |

**Example Output:**
```json
{"messages":[{"role":"user","content":"Hello"},{"role":"assistant","content":"Hi"}],"conversation_valid":true,"conversation_error":null}
```
