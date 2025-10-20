---
title: Text2SQLQuestionGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text2sql/generate/text2sqlquestiongenerator/
---

## 📘 概述

[Text2SQLQuestionGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/text2sql_question_generator.py) 是一个为 Text-to-SQL 任务生成自然语言问题的算子。它根据输入的 SQL 查询和数据库 schema，调用大语言模型（LLM）生成多个候选问题，并利用嵌入模型选出最合适的一个。

## \_\_init\_\_函数

```python
def __init__(self, 
            llm_serving: LLMServingABC, 
            embedding_serving: LLMServingABC, 
            database_manager: DatabaseManager, 
            question_candidates_num: int = 5,
            prompt_template = None
            ):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :----------------------- | :---------------- | :--- | :----------------------------------------------------------------------- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于生成自然语言问题。 |
| **embedding_serving** | LLMServingABC | 必需 | 嵌入模型服务实例，用于计算候选问题之间的相似度以选择最佳问题。 |
| **database_manager** | DatabaseManager | 必需 | 数据库管理器实例，用于获取数据库的 schema 信息。 |
| **question_candidates_num** | int | 5 | 为每个SQL查询生成的候选问题的数量。 |
| **prompt_template** | PromptABC | None | 用于构建LLM输入的提示词模板对象。如果为 None，则使用默认的 `Text2SQLQuestionGeneratorPrompt`。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| ----------------- | ------ | ---- | ------ |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage,
        input_sql_key: str = "sql",
        input_db_id_key: str = "db_id",
        output_question_key: str = "question",
        output_evidence_key: str = "evidence"
    ):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :-------------------- | :---------------- | :---------- | :--------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_sql_key** | str | "sql" | 输入列名，对应SQL查询字段。 |
| **input_db_id_key** | str | "db_id" | 输入列名，对应数据库ID字段。 |
| **output_question_key** | str | "question" | 输出列名，对应生成的自然语言问题字段。 |
| **output_evidence_key** | str | "evidence" | 输出列名，对应生成的外部知识或证据字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :------- | :--- | :------------------- |
| ... | ... | 输入数据中的原有字段。 |
| question | str | 模型生成的自然语言问题。 |
| evidence | str | 模型生成问题时所依赖的外部知识。 |
