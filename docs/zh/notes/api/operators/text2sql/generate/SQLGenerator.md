---
title: SQLGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text2sql/generate/sqlgenerator/
---

## 📘 概述
[SQLGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个SQL生成算子，它基于数据库信息，合成SQL，旨在覆盖不同的难度、数据库Schema、函数和风格。

## `__init__`函数
```python
def __init__(self, 
             llm_serving: LLMServingABC, 
             database_manager: DatabaseManager,
             generate_num: int = 300,
             prompt_template = None
    )
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **database_manager** | DatabaseManager | 必需 | 数据库管理器实例，用于访问和检索数据库Schema。 |
| **generate_num** | int | 300 | 为每个数据库生成的SQL查询数量。 |
| **prompt_template** | PromptABC | None | 提示词模板对象，用于构建输入。如果为`None`，则默认使用`SelectSQLGeneratorPrompt`。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage,
        output_sql_key: str = "sql",
        output_db_id_key: str = "db_id"
    )
```
执行算子主逻辑，基于数据库Schema信息生成SQL查询，并将结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责写入生成的数据。 |
| **output_sql_key** | str | "sql" | 输出列名，对应生成的SQL查询。 |
| **output_db_id_key** | str | "db_id" | 输出列名，对应SQL查询所属的数据库ID。 |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| sql | str | 模型生成的SQL查询语句。 |
| db_id | str | SQL查询对应的数据库ID。 |

示例输入：
该算子不直接处理JSONL格式的输入行，而是通过`database_manager`读取数据库信息。

示例输出：
```json
{
"sql":"SELECT T1.name FROM singer ORDER BY T1.age DESC",
"db_id":"singer"
}
{
"sql":"SELECT count(*) FROM singer WHERE citizenship  =  'France'",
"db_id":"singer"
}
```
