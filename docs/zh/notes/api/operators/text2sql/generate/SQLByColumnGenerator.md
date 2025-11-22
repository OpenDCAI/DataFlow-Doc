---
title: SQLByColumnGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text2sql/generate/sqlbycolumngenerator/
---

## 📘 概述 [SQLByColumnGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
SQLByColumnGenerator 是一个SQL生成算子，它根据数据库的schema信息（包括表结构、列信息等），自动调用大语言模型（LLM）合成SQL查询。该算子旨在生成覆盖不同难度、数据库Schema、函数和风格的SQL语句，主要用于Text2SQL任务的数据增强。

## __init__函数
```python
def __init__(self, 
             llm_serving: LLMServingABC, 
             database_manager: DatabaseManager,
             generate_num: int = 5,
             prompt_template = None
    )
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行SQL生成。 |
| **database_manager** | DatabaseManager | 必需 | 数据库管理器实例，用于获取数据库的schema和数据。 |
| **generate_num** | int | 5 | 为每个特定列生成的SQL查询数量。 |
| **prompt_template** | PromptABC | None | 提示词模板对象，用于构建生成SQL的输入。默认为`SelectSQLGeneratorPrompt`。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage,
        output_sql_key: str = "sql",
        output_db_id_key: str = "db_id"
    )
```
执行算子主逻辑，连接数据库获取schema信息，为每个数据库生成指定数量的SQL查询，并将结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **output_sql_key** | str | "sql" | 输出列名，对应生成的SQL查询字段。 |
| **output_db_id_key** | str | "db_id" | 输出列名，对应数据库ID字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| db_id | str | 数据库的ID。 |
| sql | str | 模型生成的SQL查询语句。 |

示例输出：
```json
{
"db_id":"chinook_1",
"sql":"SELECT COUNT(DISTINCT SupportRepId) FROM Employee"
}
```
