---
title: ShareGPTMessagesGenerator
createTime: 2026/11/01 00:00:00
permalink: /en/api/operators/conversations/generate/sharegptmessagesgenerator/
---

## 📘 Overview
Converts ShareGPT `from`/`value` conversations into standard `messages`. An optional top-level system column is supported; no model is called and no rows are removed.

[Source](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/generate/sharegpt_messages_generator.py)

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
def run(self, storage, input_key="conversations", output_key="messages", input_system_key=None):
```

### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | Required | DataFlow storage instance. |
| input_key | str | "conversations" | ShareGPT conversation column; it must exist. |
| output_key | str | "messages" | New message column; it must not overwrite an existing column. |
| input_system_key | str \| None | None | Top-level system column; `None` disables reading it. |

### Behavior
Only text `from`/`value` messages are supported; weights and multimodal fields are not supported. An enabled system column must exist. The constructor prompt or top-level system value becomes the first system message; both cannot be set together, and a conversation that already contains a system message cannot receive another one. Original fields, order, and row count are preserved.

## 🧠 Example Usage
```python
from dataflow.operators.conversations import ShareGPTMessagesGenerator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="sharegpt.jsonl")
operator = ShareGPTMessagesGenerator(system_prompt=None)
operator.run(storage.step(), input_key="conversations", output_key="messages", input_system_key=None)
```

## 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| messages | list[dict] | Standard role/content message list. |

**Example Output:**
```json
{"conversations":[{"from":"human","value":"Hello"},{"from":"gpt","value":"Hi"}],"messages":[{"role":"user","content":"Hello"},{"role":"assistant","content":"Hi"}]}
```
