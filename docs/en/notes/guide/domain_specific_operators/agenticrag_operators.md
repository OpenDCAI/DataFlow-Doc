---
title: AgenticRAG Operators
createTime: 2025/06/24 11:43:42
permalink: /en/guide/agenticrag_operators/
---

# AgenticRAG Operators

## Overview

AgenticRAG Operators are a specialized suite of tools designed for agentic RAG (Retrieval-Augmented Generation) tasks, with a particular focus on generating question-and-answer (QA) samples from provided text to support RL-based agentic RAG training. These operators are primarily categorized into two groups: **Data Generation Operators (Generators)** and **Evaluating Operators (Evaluators)**.

- 🚀 **Independent Innovation**: Core algorithms developed from scratch, filling existing algorithmic gaps or further improving performance, breaking through current performance bottlenecks.
- ✨ **Open Source First**: First integration of this operator into mainstream community frameworks, facilitating use by more developers and achieving open-source sharing.

## Data Generation Operators

Data Generation Operators are responsible for producing RAG-related RL training data, including automated prompt creation, question and answer generation, and QA scoring.

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Application Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Official Repository or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">AgenticRAGAtomicTaskGenerator✨</td>
      <td class="tg-0pky">Atomic Task Generation</td>
      <td class="tg-0pky">Generates high-quality questions and verifiable answers based on the given text content.</td>
      <td class="tg-0pky">Refined and improved from <a href="https://github.com/OPPO-PersonalAI/TaskCraft" target="_blank">https://github.com/OPPO-PersonalAI/TaskCraft</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">AgenticRAGWidthQAGenerator✨</td>
      <td class="tg-0pky">QA Breadth Expansion</td>
      <td class="tg-0pky">Combines multiple QA pairs to generate new, more difficult QA pairs.</td>
      <td class="tg-0pky">Refined and improved from <a href="https://github.com/OPPO-PersonalAI/TaskCraft" target="_blank">https://github.com/OPPO-PersonalAI/TaskCraft</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">AgenticRAGDepthQAGenerator✨</td>
      <td class="tg-0pky">QA Depth Expansion</td>
      <td class="tg-0pky">Expands individual QA pairs into new, more challenging QA pairs.</td>
      <td class="tg-0pky">Refined and improved from <a href="https://github.com/OPPO-PersonalAI/TaskCraft" target="_blank">https://github.com/OPPO-PersonalAI/TaskCraft</a></td>
    </tr>
  </tbody>
</table>

## Data Evaluation Operators

Data evaluation operators are responsible for assessing reinforcement learning training data related to RAG, including quality scoring for questions and answers.

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Application Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Official Repository or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">AgenticRAGQAF1SampleEvaluator🚀</td>
      <td class="tg-0pky">QA Scoring</td>
      <td class="tg-0pky">Assesses the verifiability of answers with and without the presence of gold documents in QA tasks.</td>
      <td class="tg-0pky">-</td>
    </tr>
  </tbody>
</table>

## Operator Interface Usage Instructions

Specifically, for operators that specify storage paths or call models, we provide encapsulated **model interfaces** and **storage object interfaces**. You can predefine model API parameters for operators in the following way:

```python
from dataflow.llmserving import APILLMServing_request

llm_serving = APILLMServing_request(
                api_url="your_api_url",
                model_name="model_name",
                max_workers=5
        )
```

You can predefine storage parameters for operators in the following way:

```python
from dataflow.utils.storage import FileStorage

 self.storage = FileStorage(
            first_entry_file_name="your_file_path",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="json", # jsonl, json, ...
        )
```

The `llm_serving` and `self.storage` used in the following text are the interface objects defined here. Complete usage examples can be found in `DataFlow/dataflow/statics/pipelines/api_pipelines/agentic_rag_pipeline.py`.

For parameter passing, the constructor of operator objects mainly passes information related to operator configuration, which can be configured once and called multiple times; while the `X.run()` function passes `key` information related to IO. Details can be seen in the operator description examples below.

## Detailed Operator Descriptions

### Data Generation Operators

#### 1. AgenticRAGAtomicTaskGenerator

**Function Description:**  This operator is used to generate appropriate high-quality questions and verifiable answers for the provided text content.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: Large language model interface object to use (default: predefined value above)
- `run()`
  - `storage`: Storage interface object (default: predefined value above)
  - `input_key`: Field name of the input text content (default: `"prompts"`)  
  - `output_question_key`: Field name for the output question (default: `"question"`)  
  - `output_answer_key`: Field name for the output answer (default: `"answer"`)  
  - `output_refined_answer_key`: Field name for the output refined answer (default: `"refined_answer"`)  
  - `output_optional_answer_key`: Field name for the output optional refined answer (default: `"optional_answer"`)  
  - `output_golden_doc_answer_key`: Field name for the output answer based on gold documents (default: `"golden_doc_answer"`)

**Key Features:**

- Supports various types of text content  
- Capable of generating appropriate question-answer pairs  
- Generates verifiable answers and alternative answers

**Usage Example:**

```python
atomic_task_generator = AgenticRAGAtomicTaskGenerator(
            llm_serving=self.llm_serving
        )

result = atomic_task_generator.run(
            storage = self.storage.step(),
            input_key = "contents",
        )
```

#### 2. AgenticRAGWidthQAGenerator

**Function Description:** This operator is used to combine two QA pairs and generate a new question.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: Large language model interface object to use (default: predefined value above)
- `run()`
  - `storage`: Storage interface object (default: predefined value above)
  - `input_question_key`: Field name for the input question (default: `"question"`)  
  - `input_identifier_key`: Field name for the input identifier (default: `"identifier"`)  
  - `input_answer_key`: Field name for the input answer (default: `"answer"`)  
  - `output_question_key`: Field name for the output question (default: `"generated_width_task"`)

**Key Features:**

- Combines two QA pairs to generate a more complex new question.

**Usage Example:**

```python
width_qa_generator = AgenticRAGWidthQAGenerator(
            llm_serving=self.llm_serving
        )

result = width_qa_generator.run(
    storage = self.storage.step(),
    input_question_key = "question",
    input_identifier_key = "identifier",
    input_answer_key = "refined_answer"
)
```

#### 3. AgenticRAGDepthQAGenerator

**Function Description:** This operator is used to generate deeper questions based on existing QA pairs.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: Large language model interface object to use (default: predefined value above)
- `run()`
  - `storage`: Storage interface object (default: predefined value above)
  - `input_key`: Field name for the input (default: `"question"`)  
  - `output_key`: Field name for the output (default: `"depth_question"`)

**Key Features:**

- Generates deeper questions based on existing QA pairs

**Usage Example:**

```python
depth_qa_generator = AgenticRAGDepthQAGenerator(
            llm_serving=self.llm_serving
        )

result = depth_qa_generator.run(
    storage = self.storage.step(),
    input_key = "question",
    output_key = "depth_question"
)
```

### Data Evaluation Operators

#### 1. AgenticRAGQAF1SampleEvaluator

**Function Description:** This operator is used to evaluate the verifiability of QA tasks with and without support from gold documents.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: Large language model interface object to use (default: predefined value above)
- `run()`
  - `storage`: Storage interface object (default: predefined value above)
  - `prediction_key`: Field name for the input prediction (default: `"refined_answer"`)  
  - `ground_truth_key`: Field name for the input ground truth answer (default: `"golden_doc_answer"`)  
  - `output_key`: Field name for the output QA quality score (default: `"F1Score"`)

**Key Features:**

- Generates verifiability evaluation results with and without gold document support, facilitating subsequent filtering.

**Usage Example:**

```python
f1_scorer = AgenticRAGQAF1SampleEvaluator()
result = f1_scorer.run(
            storage=self.storage.step(),
            output_key="F1Score",
            input_prediction_key="refined_answer",
            input_ground_truth_key="golden_doc_answer"
        )
```