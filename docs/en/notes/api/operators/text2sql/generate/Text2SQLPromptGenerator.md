---
title: Text2SQLPromptGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text2sql/generate/text2sqlpromptgenerator/
---

## 📘 Overview

The `Text2SQLPromptGenerator` is an operator designed to create prompts for Text-to-SQL tasks. It extracts schema information from a specified database and combines it with a natural language question to generate a detailed prompt suitable for a large language model. This operator facilitates the automated generation of context-rich prompts, which is a crucial step in building accurate Text-to-SQL systems.

## `__init__` function

```python
def __init__(self, 
            database_manager: DatabaseManager,
            prompt_template = None
        ):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **database_manager** | DatabaseManager | Required | An instance of DatabaseManager to handle database interactions and schema retrieval. |
| **prompt_template** | PromptABC | `Text2SQLPromptGeneratorPrompt()` | The prompt template object used to structure the final prompt. Defaults to a standard Text2SQL prompt. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(self, storage: DataFlowStorage, 
        input_question_key: str = "question",
        input_db_id_key: str = "db_id",
        input_evidence_key: str = "evidence",
        output_prompt_key: str = "prompt"
    ):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading input data and writing results. |
| **input_question_key** | str | "question" | The column name in the input data that contains the natural language question. |
| **input_db_id_key** | str | "db_id" | The column name in the input data that contains the database identifier. |
| **input_evidence_key** | str | "evidence" | The column name for optional evidence or hints to be included in the prompt. |
| **output_prompt_key** | str | "prompt" | The column name where the generated prompt will be stored in the output data. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

The output includes all original columns from the input data, with an additional column containing the generated prompt.

| Field | Type | Description |
| :--- | :--- | :--- |
| question | str | The input natural language question. |
| db_id | str | The identifier for the database. |
| evidence | str | Optional evidence or hints provided in the input. |
| prompt | str | The generated prompt for the Text-to-SQL task. |

**Example Input:**
```json
{
    "question": "What are the names of the departments with more than 10 employees?",
    "db_id": "company_database",
    "evidence": ""
}
```
**Example Output:**
```json
{
    "question": "What are the names of the departments with more than 10 employees?",
    "db_id": "company_database",
    "evidence": "",
    "prompt": "Given the database schema for 'company_database', please generate the SQL query for the following question: What are the names of the departments with more than 10 employees?"
}
```
