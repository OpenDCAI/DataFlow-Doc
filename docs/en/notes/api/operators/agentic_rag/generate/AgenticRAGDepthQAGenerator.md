---
title: AgenticRAGDepthQAGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/agentic_rag/generate/agenticragdepthqagenerator/
---

## 📘 Overview

[AgenticRAGDepthQAGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/rag/agentic_rag/depth_qa_generator.py) is an operator used to generate deeper questions based on existing QA pairs. It iteratively refines and expands upon an initial question to create more complex and in-depth queries over multiple rounds.

## `__init__` function

```python
def __init__(self,
             llm_serving: LLMServingABC = None,
             n_rounds:int = 2
             ):
```

### `init` Parameters

| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | An LLM serving instance for executing inference and generation. |
| **n_rounds** | int | 2 | The number of rounds to generate deeper questions. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |
| | | | |
| | | | |

## `run` function

```python
def run(
        self,
        storage: DataFlowStorage,
        input_key:str = "question",
        output_key:str = "depth_question",
        ):
```

#### Parameters

| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | "question" | The input column name, corresponding to the question field. |
| **output_key** | str | "depth_question" | The base name for the output columns that will store the generated deeper questions. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format (Output Format)

| Field | Type | Description |
| :--- | :--- | :--- |
| | | |
| | | |

**Example Input:**

```json

```

**Example Output:**

```json

```
