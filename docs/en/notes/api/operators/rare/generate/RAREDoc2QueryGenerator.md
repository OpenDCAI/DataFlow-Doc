---
title: RAREDoc2QueryGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/rare/generate/raredoc2querygenerator/
---

## 📘 Overview
The `RAREDoc2QueryGenerator` is an operator that uses Large Language Models (LLMs) to generate reasoning-intensive questions for given documents. It takes a document as input, constructs a prompt, and calls an LLM service to produce a corresponding question and scenario.

## __init__
```python
def __init__(self, llm_serving: LLMServingABC):
```
### init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | An instance of a large language model service, used for executing inference and generation. |

### Prompt Template Descriptions


## run
```python
def run(
    self,
    storage: DataFlowStorage,
    input_key: str = "text",
    output_question_key: str = "question",
    output_scenario_key: str = "scenario",
    max_attempts: int = 3
):
```
Executes the main logic of the operator, reading an input DataFrame from storage, generating reasoning-intensive questions and scenarios, and writing the results back to storage.
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | "text" | Input column name, corresponding to the document content field. |
| **output_question_key** | str | "question" | Output column name for the generated question. |
| **output_scenario_key** | str | "scenario" | Output column name for the generated scenario. |
| **max_attempts** | int | 3 | The maximum number of attempts to parse the LLM response upon failure. |

## 🧠 Example Usage
