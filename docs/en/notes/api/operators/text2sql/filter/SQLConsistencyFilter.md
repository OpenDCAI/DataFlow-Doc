---
title: SQLConsistencyFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text2sql/filter/sqlconsistencyfilter/
---

# 📘 `SQLConsistencyFilter`

`SQLConsistencyFilter` is an operator designed to filter entries by checking whether a given SQL query correctly corresponds to and can solve a natural language question. It leverages a large language model (LLM) to perform this consistency check against a specific database schema.

## `__init__`

```python
def __init__(self, 
        llm_serving: LLMServingABC, 
        database_manager: DatabaseManager,
        prompt_template = None
    ):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | The large language model serving instance used for consistency checks. |
| **database_manager** | DatabaseManager | Required | The database manager instance to fetch database schemas and details. |
| **prompt_template** | PromptABC | SQLConsistencyFilterPrompt | The prompt template object used to build the input for the LLM. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`

```python
def run(self, storage: DataFlowStorage,
        input_sql_key: str = "SQL",
        input_db_id_key: str = "db_id",
        input_question_key: str = "question"
    ):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading and writing data. |
| **input_sql_key** | str | "SQL" | The input column name for the SQL query. |
| **input_db_id_key**| str | "db_id" | The input column name for the database ID. |
| **input_question_key** | str | "question" | The input column name for the natural language question. |

## 🧠 Example Usage

```python

```

#### 🧾 Output Format

The output of this operator is a filtered DataFrame containing only the rows that passed the consistency check. The schema (columns) of the output DataFrame is identical to the input DataFrame.
