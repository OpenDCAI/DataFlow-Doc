---
title: SQLExecutionFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text2sql/filter/sqlexecutionfilter/
---

## 📘 概述

[SQLExecutionFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个 SQL 执行过滤算子，通过在指定数据库中实际执行 SQL 查询，来筛选掉无法成功执行的条目。它确保了数据流中只有语法正确且可执行的 SQL 查询得以保留，常用于 Text2SQL 任务的数据清洗或验证环节。

## __init__函数

```python
def __init__(self, database_manager: DatabaseManager)
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **database_manager** | DatabaseManager | 必需 | 数据库管理器实例，用于连接数据库并执行 SQL 查询。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_sql_key: str = "sql", input_db_id_key: str = "db_id")
```

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_sql_key** | str | "sql" | 输入列名，对应 SQL 查询字段。 |
| **input_db_id_key** | str | "db_id" | 输入列名，对应数据库 ID 字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

算子会过滤输入数据，仅保留 SQL 可成功执行的行。输出的数据格式与输入完全相同，但行数可能减少。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | | (输入中的所有原始字段都将被保留) |
| `[input_sql_key]` | str | 输入的 SQL 查询文本。 |
| `[input_db_id_key]` | str | 对应的数据库 ID。 |

**示例输入：**
(假设 `input_sql_key` 为 "sql", `input_db_id_key` 为 "db_id")
```json
[
  {
    "question": "Find the names of all departments.",
    "db_id": "company_1",
    "sql": "SELECT dept_name FROM departments"
  },
  {
    "question": "What are the names of employees in the 'Sales' department?",
    "db_id": "company_1",
    "sql": "SELECT name FROMm employees WHERE department = 'Sales'"
  },
  {
    "question": "Count the number of projects.",
    "db_id": "company_1",
    "sql": "SELECT count(*) FROM projects"
  }
]
```
**示例输出：**
(第二个条目的 SQL 包含语法错误 "FROMm"，因此被过滤掉)
```json
[
  {
    "question": "Find the names of all departments.",
    "db_id": "company_1",
    "sql": "SELECT dept_name FROM departments"
  },
  {
    "question": "Count the number of projects.",
    "db_id": "company_1",
    "sql": "SELECT count(*) FROM projects"
  }
]
```
