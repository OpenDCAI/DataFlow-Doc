---
title: SQLByColumnGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text2sql/generate/sqlbycolumngenerator/
---

## 📘 Overview

[SQLByColumnGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/...) is an operator designed to synthesize SQL queries based on database information. It iterates through connected databases, analyzes their schemas, and leverages a Large Language Model (LLM) to generate a variety of SQL queries. This process helps create diverse and relevant datasets for tasks like Text-to-SQL model training and evaluation, covering different complexities, functions, and styles.

## `__init__` function

```python
def __init__(self, 
             llm_serving: LLMServingABC, 
             database_manager: DatabaseManager,
             generate_num: int = 5,
             prompt_template = None
    ):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | An instance of a Large Language Model serving class, used for generating SQL queries. |
| **database_manager** | DatabaseManager | Required | A manager instance that handles database connections and retrieves schema information. |
| **generate_num** | int | 5 | The number of SQL queries to generate for each special column within a database schema. |
| **prompt_template** | PromptABC | SelectSQLGeneratorPrompt | The prompt template object used to construct inputs for the LLM. Defaults to `SelectSQLGeneratorPrompt`. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(self, storage: DataFlowStorage,
        output_sql_key: str = "sql",
        output_db_id_key: str = "db_id"
    ):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance used for writing the generated data. |
| **output_sql_key** | str | "sql" | The column name for the generated SQL queries in the output. |
| **output_db_id_key** | str | "db_id" | The column name for the corresponding database ID in the output. |

## 🧠 Example Usage

```python
# Blank
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| db_id | str | The identifier of the database for which the SQL was generated. |
| sql | str | The generated SQL query string. |

**Example Input:**

This operator does not require a specific input file, as it generates data based on the database schemas accessible via the `database_manager`.

**Example Output:**

```json
{
  "db_id": "chinook_1",
  "sql": "SELECT T1.Title, T2.Name FROM Album AS T1 JOIN Artist AS T2 ON T1.ArtistId = T2.ArtistId ORDER BY T2.Name DESC LIMIT 3;"
}
```
