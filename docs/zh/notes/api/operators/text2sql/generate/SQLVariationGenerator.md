---
title: SQLVariationGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text2sql/generate/sqlvariationgenerator/
---

## 📘 概述

[SQLVariationGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个 SQL 变种生成算子，用于根据输入的 SQL 查询和数据库结构，调用大语言模型（LLM）生成多种语义相同但表达方式不同的 SQL 变体。该算子通过数据替换、函数变换、难度变换等操作，丰富 SQL 数据集，可用于 Text2SQL 模型的训练与评估。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC, 
             database_manager: DatabaseManager,
             num_variations: int = 10,
             prompt_template = None
             ):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | `LLMServingABC` | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **database_manager** | `DatabaseManager` | 必需 | 数据库管理器实例，用于获取数据库的 schema 和数据。 |
| **num_variations** | `int` | `10` | 针对每个原始 SQL 查询要生成的变种数量。 |
| **prompt_template** | `PromptABC` | `SQLVariationGeneratorPrompt()` | 提示词模板对象，用于构建生成任务的提示词。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage,
        input_sql_key: str = "sql",
        input_db_id_key: str = "db_id"
    ):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | `DataFlowStorage` | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_sql_key** | `str` | `"sql"` | 输入列名，对应原始 SQL 查询字段。 |
| **input_db_id_key** | `str` | `"db_id"` | 输入列名，对应数据库 ID 字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

算子会读取输入 `DataFrame`，并在此基础上追加生成的 SQL 变种作为新的行。输出的 `DataFrame` 将包含所有原始行和新增的变种行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| {input_sql_key} | `str` | 原始 SQL 或模型生成的 SQL 变种。 |
| {input_db_id_key} | `str` | 对应的数据库 ID。 |
