---
title: SQLExecutionFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text2sql/filter/sqlexecutionfilter/
---

## 📘 Overview
The `SQLExecutionFilter` is an operator designed to filter data entries by executing their associated SQL queries against a specified database. It retains only the entries for which the SQL query executes successfully, effectively cleaning the dataset by removing invalid or non-executable queries.

## `__init__` function
```python
def __init__(self, database_manager: DatabaseManager):
```
### init parameter description
| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **database_manager** | DatabaseManager | Required | An instance for managing database connections and executing queries. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_sql_key: str = "sql", input_db_id_key: str = "db_id")
```
#### Parameters
| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_sql_key** | str | "sql" | The column name in the input data that contains the SQL queries. |
| **input_db_id_key** | str | "db_id" | The column name in the input data that contains the database identifiers. |

## 🧠 Example Usage
```python

```

#### 🧾 Default output format (Output Format)
The operator filters the input DataFrame, so the output format consists of the same columns as the input, but only contains the rows where the SQL query was successfully executed.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | | Original columns from the input are preserved. |
| sql | str | The SQL query that was successfully executed. |
| db_id | str | The database ID against which the query was executed. |
