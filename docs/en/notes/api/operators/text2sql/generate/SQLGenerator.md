---
title: SQLGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text2sql/generate/sqlgenerator/
---

## 📘 Overview

The `SQLGenerator` is an operator designed to synthesize SQL queries based on provided database information. It interacts with a database manager to retrieve schema details and uses a large language model (LLM) to generate a specified number of SQL queries, covering various complexities and styles. This is particularly useful for creating datasets for Text-to-SQL tasks.

## `__init__` function

```python
def __init__(self,
             llm_serving: LLMServingABC,
             database_manager: DatabaseManager,
             generate_num: int = 300,
             prompt_template = None
    ):
```

### `init` Parameters

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | An instance of a large language model serving class, used for generating the SQL queries. |
| **database_manager** | DatabaseManager | Required | A manager instance that handles database connections and retrieves schema information (e.g., CREATE and INSERT statements). |
| **generate_num** | int | 300 | The number of SQL queries to generate for each database schema. |
| **prompt_template** | PromptABC | `SelectSQLGeneratorPrompt()` | The prompt template object used to construct the input for the LLM. Defaults to a standard SQL generation prompt if not provided. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(self,
        storage: DataFlowStorage,
        output_sql_key: str = "sql",
        output_db_id_key: str = "db_id"
    )
```

#### Parameters

| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance used for writing the generated data. |
| **output_sql_key** | str | "sql" | The column name in the output for the generated SQL query. |
| **output_db_id_key** | str | "db_id" | The column name in the output for the corresponding database ID. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

The operator processes database schemas provided by the `DatabaseManager` and writes a `DataFrame` to storage. Each row in the output corresponds to one generated SQL query.

| Field | Type | Description |
| :--- | :--- | :--- |
| db_id | str | The identifier of the database for which the SQL was generated. |
| sql | str | The generated SQL query. |

**Example Input:**

This operator does not process row-by-row JSON input. Instead, it uses the `DatabaseManager` to access database schemas.

**Example Output:**

```json
{
"db_id": "concert_singer",
"sql": "SELECT name, country, age FROM singer ORDER BY age DESC"
}
```
