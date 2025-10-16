---
title: AgenticRAGWidthQAGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/agentic_rag/generate/agenticragwidthqagenerator/
---

## 📘 Overview
The `AgenticRAGWidthQAGenerator` is an operator designed to combine two question-answer (QA) pairs to generate a new, more complex question. This process involves multiple steps of generation, verification, and scoring, using a large language model (LLM) to ensure the quality and relevance of the newly created questions. It is a key component in workflows aimed at broadening the scope and complexity of a question dataset.

## `__init__` function
```python
def __init__(self, llm_serving: LLMServingABC = None)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | The large language model serving instance, used for executing inference and generation. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
This operator does not use prompt templates; it generates, merges, and verifies complex QA pairs directly through multi-step reasoning without relying on intermediate prompt templates.

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
from dataflow.operators.agentic_rag.generate.agenticrag_width_qa_generator import AgenticRAGWidthQAGenerator
from dataflow.utils.storage import DataFlowStorage

# Initialize the operator
generator = AgenticRAGWidthQAGenerator(
    llm_serving=your_llm_serving_instance
)

# Run the operator
storage = DataFlowStorage()
generator.run(
    storage=storage,
    input_question_key="question",
    input_identifier_key="identifier",
    input_answer_key="answer",
    output_question_key="generated_width_task"
)
```

#### 🧾 Output Format
The operator modifies the input DataFrame by adding several new columns.

| Field | Type | Description |
| :--- | :--- | :--- |
| **generated_width_task** | str | The generated complex question combining multiple QA pairs |
| **content_identifier** | str | Combined content identifier from merged questions |
| **qa_index** | list | Indices of the original QA pairs that were merged |
| **index** | int | Index of the generated question |
| **original_answer** | list | List of original answers from merged QA pairs |
| **original_question** | list | List of original questions from merged QA pairs |
| **state** | int | Validation state (1 for valid, 0 for invalid) |

**Example Input:**
```json
[
  {
    "question": "What is machine learning?",
    "identifier": "ml_concepts",
    "answer": "Machine learning is a subset of AI that enables computers to learn without explicit programming."
  },
  {
    "question": "How does deep learning work?",
    "identifier": "dl_concepts", 
    "answer": "Deep learning uses neural networks with multiple layers to process data and make predictions."
  }
]
```

**Example Output:**
```json
{
  "generated_width_task": "How do machine learning and deep learning work together in modern AI systems?",
  "content_identifier": "ml_dl_integration",
  "qa_index": [0, 1],
  "index": 0,
  "original_answer": [
    "Machine learning is a subset of AI that enables computers to learn without explicit programming.",
    "Deep learning uses neural networks with multiple layers to process data and make predictions."
  ],
  "original_question": [
    "What is machine learning?",
    "How does deep learning work?"
  ],
  "state": 1
}
```
