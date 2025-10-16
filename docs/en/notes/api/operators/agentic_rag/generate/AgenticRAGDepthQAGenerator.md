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
This operator does not use prompt templates; it generates and processes deeper question-answer pairs directly through multi-round reasoning steps.

## `run` function

```python
def run(
        self,
        storage: DataFlowStorage,
        input_key:str = "question",
        output_key:str = "depth_question",
        ):
```
Executes the main operator logic: reads the input DataFrame from storage, generates deeper questions over multiple rounds of reasoning, and writes the results—including newly generated columns—back to storage.

#### Parameters

| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | "question" | The input column name, corresponding to the question field. |
| **output_key** | str | "depth_question" | The base name for the output columns that will store the generated deeper questions. |

## 🧠 Example Usage

```python
from dataflow.operators.agentic_rag.generate.agenticrag_depth_qa_generator import AgenticRAGDepthQAGenerator
from dataflow.utils.storage import DataFlowStorage

# Initialize the operator
generator = AgenticRAGDepthQAGenerator(
    llm_serving=your_llm_serving_instance,
    n_rounds=2
)

# Run the operator
storage = DataFlowStorage()
generator.run(
    storage=storage,
    input_key="question",
    output_key="depth_question"
)
```

#### 🧾 Default Output Format (Output Format)

| Field | Type | Description |
| :--- | :--- | :--- |
| **identifier** | str | Content identifier extracted from the original question |
| **new_identifier_{i}** | str | New identifiers generated in round i |
| **relation_{i}** | str | Relations between identifiers in round i |
| **depth_question_{i}** | str | Deeper questions generated in round i |

**Example Input:**

```json
{
  "question": "What is machine learning?"
}
```

**Example Output:**

```json
{
  "question": "What is machine learning?",
  "identifier": "machine learning concepts",
  "new_identifier_1": "artificial intelligence algorithms",
  "relation_1": "is a subset of",
  "depth_question_1": "How do artificial intelligence algorithms work in machine learning systems?",
  "new_identifier_2": "statistical learning theory",
  "relation_2": "provides foundation for",
  "depth_question_2": "What role does statistical learning theory play in the development of machine learning algorithms?"
}
```
