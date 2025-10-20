---
title: MultiTurnConversationGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/conversations/generate/multiturnconversationgenerator/
---

## 📘 Overview
The `MultiTurnConversationGenerator` simulates multi-turn conversations based on composition tasks and their sub-task functions using an LLM service. The process involves three agents: User, Assistant, and Tool, interacting to complete the conversation.

## __init__ function
```python
def __init__(self, llm_serving: LLMServingABC):
```
### init parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | LLM serving object implementing the LLMServingABC interface. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| --- | --- | --- | --- |
| | | | |

## run function
```python
def run(self, storage: DataFlowStorage, input_task_key: str, input_sub_tasks_keys: list[str], input_functions_key: list[str], output_conversations_key: str = "conversations"):
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_task_key** | str | Required | Field name for the main task (composition task). |
| **input_sub_tasks_keys** | list[str] | Required | List of field names for sub-tasks. |
| **input_functions_key** | list[str] | Required | Field name containing sub-task functions. |
| **output_conversations_key** | str | "conversations" | Field name for storing the generated conversations. |

## 🧠 Example Usage
```python

```
#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| (original fields) | - | The original input fields are preserved. |
| conversations | list | A list of dictionaries representing the generated multi-turn conversation. |
