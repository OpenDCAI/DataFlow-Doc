---
title: Text2SQLQuestionGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text2sql/generate/text2sqlquestiongenerator/
---

# 📘 Text2SQLQuestionGenerator

## Overview

The `Text2SQLQuestionGenerator` operator is designed to generate natural language questions corresponding to given SQL queries. If an entry lacks a natural language question, this operator generates multiple candidate questions, evaluates them, and selects the best one to complete the data entry. It leverages language models for generation and embedding models for selection, interacting with a database manager to retrieve schema information.

## `__init__`

```python
def __init__(self, 
            llm_serving: LLMServingABC, 
            embedding_serving: LLMServingABC, 
            database_manager: DatabaseManager, 
            question_candidates_num: int = 5,
            prompt_template = None
            )
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | An instance of a large language model serving class, used for generating question candidates. |
| **embedding_serving** | LLMServingABC | Required | An instance of an embedding model serving class, used to create embeddings for selecting the best question. |
| **database_manager** | DatabaseManager | Required | A manager to interact with the database and retrieve schema information. |
| **question_candidates_num** | int | 5 | The number of candidate questions to generate for each SQL query. |
| **prompt_template** | PromptABC | None | The prompt template object used to construct the input for the LLM. Defaults to `Text2SQLQuestionGeneratorPrompt` if not provided. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`

```python
def run(self, 
        storage: DataFlowStorage,
        input_sql_key: str = "sql",
        input_db_id_key: str = "db_id",
        output_question_key: str = "question",
        output_evidence_key: str = "evidence"
        )
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading and writing data. |
| **input_sql_key** | str | "sql" | The column name in the input data that contains the SQL query. |
| **input_db_id_key** | str | "db_id" | The column name in the input data that contains the database ID. |
| **output_question_key** | str | "question" | The column name for storing the generated natural language question in the output data. |
| **output_evidence_key** | str | "evidence" | The column name for storing the generated evidence or external knowledge in the output data. |

## 🧠 Example Usage
