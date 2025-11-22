---
title: SQLVariationGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text2sql/generate/sqlvariationgenerator/
---

## 📘 Overview

The `SQLVariationGenerator` operator generates variations of SQL based on existing SQLs, including data replacement, function transformation, and difficulty transformation, to generate more diverse SQLs. It takes an existing SQL query and its corresponding database schema as input, then leverages a large language model (LLM) to produce a specified number of new, related SQL queries.

## `__init__` function

```python
def __init__(self, 
             llm_serving: LLMServingABC, 
             database_manager: DatabaseManager,
             num_variations: int = 10,
             prompt_template = None
             )
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | The large language model serving instance used for generation. |
| **database_manager** | DatabaseManager | Required | Manages database connections and schema retrieval. |
| **num_variations** | int | 10 | The number of SQL variations to generate for each input SQL query. |
| **prompt_template** | PromptABC | SQLVariationGeneratorPrompt() | The prompt template object used to construct the input for the LLM. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(self, 
        storage: DataFlowStorage,
        input_sql_key: str = "sql",
        input_db_id_key: str = "db_id"
        )
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading and writing data. |
| **input_sql_key** | str | "sql" | The column name in the input data that contains the SQL queries. |
| **input_db_id_key** | str | "db_id" | The column name in the input data that contains the database identifiers. |

## 🧠 Example Usage

```python

```

#### 🧾 Output Format

The operator modifies the input dataframe by appending new rows, each containing a generated SQL variation. The original data is preserved.

| Field | Type | Description |
| :--- | :--- | :--- |
| **[input_sql_key]** | str | The original or a newly generated SQL query. |
| **[input_db_id_key]** | str | The identifier for the database associated with the SQL query. |
| *...* | *...* | Other columns from the original input data are preserved. |
