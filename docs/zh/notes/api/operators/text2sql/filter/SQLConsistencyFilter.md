---
title: SQLConsistencyFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text2sql/filter/sqlconsistencyfilter/
---

## 📘 概述

`SQLConsistencyFilter` 算子用于对数据条目进行过滤，通过调用大语言模型（LLM）来检测给定的 SQL 查询和自然语言问题之间的一致性，即判断该 SQL 是否能正确地解决对应的问题。

## `__init__`函数

```python
def __init__(self, 
        llm_serving: LLMServingABC, 
        database_manager: DatabaseManager,
        prompt_template = None
    ):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行一致性判断。 |
| **database_manager** | DatabaseManager | 必需 | 数据库管理器实例，用于获取数据库相关信息。 |
| **prompt_template** | PromptABC | None | 提示词模板对象。如果为 `None`，则默认使用 `SQLConsistencyFilterPrompt`。 |

### Prompt模板说明

## `run`函数

```python
def run(self, storage: DataFlowStorage,
        input_sql_key: str = "SQL",
        input_db_id_key: str = "db_id",
        input_question_key: str = "question"
    ):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_sql_key** | str | "SQL" | 输入数据中SQL查询所在的列名。 |
| **input_db_id_key** | str | "db_id" | 输入数据中数据库ID所在的列名。 |
| **input_question_key** | str | "question" | 输入数据中自然语言问题所在的列名。 |

## 🧠 示例用法
