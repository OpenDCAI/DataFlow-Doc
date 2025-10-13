---
title: RandomDomainKnowledgeRowGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/generate/randomdomainknowledgerowgenerator/
---

## 📘 Overview
The `RandomDomainKnowledgeRowGenerator` operator is used to batch generate domain knowledge-related text by combining a system prompt (`system_prompt`) and a user-defined prompt template (`user_prompt`). It supports generating a specified number of outputs according to the `generation_num` parameter when there is no input data. Note: The domains referenced for the randomly generated data are manually predefined.

## `__init__` function
```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "You are a helpful agent.", user_prompt: str = "{}")
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | The Large Language Model serving instance, which must implement the `LLMServingABC` interface. |
| **system_prompt** | str | "You are a helpful agent." | The system prompt that defines the model's behavior. |
| **user_prompt** | str | "{}" | The user prompt template. It can flexibly insert input content or an entire row dictionary via the `{}` placeholder. |

### Prompt Template Descriptions
| Prompt Template Name | Main Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, output_key: str = "generated_content", generation_num: int = 1)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **output_key** | str | "generated_content" | The name of the output column for the generated content. |
| **generation_num** | int | 1 | The number of content items to generate when there is no input data. |

## 🧠 Example Usage
```python

```
#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| generated_content | str | The generated text content. |
