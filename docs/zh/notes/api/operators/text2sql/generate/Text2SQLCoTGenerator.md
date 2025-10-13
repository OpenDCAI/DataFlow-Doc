---
title: Text2SQLCoTGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text2sql/generate/text2sqlcotgenerator/
---

## 📘 概述

[Text2SQLCoTGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个为 Text-to-SQL 任务生成思维链（Chain-of-Thought, CoT）的算子。它根据输入的自然语言问题和数据库 Schema，调用大语言模型（LLM）生成详细的推理过程，最终推导出目标 SQL 查询语句。

## `__init__`函数

```python
def __init__(self, 
             llm_serving: LLMServingABC, 
             database_manager: DatabaseManager,
             prompt_template = None
            )
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **database_manager** | DatabaseManager | 必需 | 数据库管理器实例，用于处理数据库 Schema 和执行 SQL 验证。 |
| **prompt_template** | PromptABC | `Text2SQLCotGeneratorPrompt()` | 提示词模板对象，用于构建生成 CoT 推理过程的输入。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, 
        input_sql_key: str = "SQL",
        input_question_key: str = "question",
        input_db_id_key: str = "db_id",
        input_evidence_key: str = "evidence",
        output_cot_key: str = "cot_reasoning"
    )
```

执行算子主逻辑，从存储中读取输入数据，为每个条目生成 Text-to-SQL 的思维链（CoT）推理过程，并将结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_sql_key** | str | "SQL" | 输入列名，对应真实的 SQL 查询语句。 |
| **input_question_key** | str | "question" | 输入列名，对应用户的自然语言问题。 |
| **input_db_id_key** | str | "db_id" | 输入列名，对应数据库的 ID。 |
| **input_evidence_key** | str | "evidence" | 输入列名，对应相关的证据或上下文信息。 |
| **output_cot_key** | str | "cot_reasoning" | 输出列名，对应生成的 CoT 推理过程字段。 |

## 🧠 示例用法
