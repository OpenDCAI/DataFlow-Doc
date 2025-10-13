---
title: AgenticRAGWidthQAGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/agentic_rag/generate/agenticragwidthqagenerator/
---

## 📘 Overview
The `AgenticRAGWidthQAGenerator` is an operator designed to combine two question-answer (QA) pairs to generate a new, more complex question. This process involves multiple steps of generation, verification, and scoring, using a large language model (LLM) to ensure the quality and relevance of the newly created questions. It is a key component in workflows aimed at broadening the scope and complexity of a question dataset.

## `__init__`
```python
def __init__(self, llm_serving: LLMServingABC = None)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | The large language model serving instance, used for executing inference and generation. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(
    self,
    storage: DataFlowStorage,
    input_question_key: str = "question",
    input_identifier_key: str = "identifier",
    input_answer_key: str = "answer",
    output_question_key: str = "generated_width_task"
)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_question_key** | str | "question" | The column name for the input questions. |
| **input_identifier_key** | str | "identifier" | The column name for the input identifiers. |
| **input_answer_key** | str | "answer" | The column name for the input answers. |
| **output_question_key** | str | "generated_width_task" | The column name for the generated wider questions. |

## 🧠 Example Usage
```python
#
```
