---
title: SQLExecutionClassifier
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text2sql/eval/sqlexecutionclassifier/
---

## 📘 概述 [SQLExecutionClassifier](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
SQLExecutionClassifier 是一个SQL执行分类算子。它让模型根据自然语言问题、数据库Schema和提示词，多次生成SQL，并通过生成SQL的准确率，评估该问题对于模型的难度。

## __init__函数
```python
def __init__(self,
            llm_serving: LLMServingABC,
            database_manager: DatabaseManager,
            num_generations: int = 10,
            difficulty_thresholds: list = [2, 5, 9],
            difficulty_labels: list = ['extra', 'hard', 'medium', 'easy']
        ):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :---------------------- | :--------------- | :--------------------------------- | :--------------------------------------------- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于生成SQL。 |
| **database_manager** | DatabaseManager | 必需 | 数据库管理实例，用于执行SQL并比对结果。 |
| **num_generations** | int | 10 | 对每个问题生成SQL查询的次数。 |
| **difficulty_thresholds** | list | [2, 5, 9] | 难度分类的阈值列表，根据SQL执行正确次数划分。 |
| **difficulty_labels** | list | ['extra', 'hard', 'medium', 'easy'] | 难度分类的标签列表。 |

### Prompt模板说明

## run函数
```python
def run(self, storage: DataFlowStorage,
        input_db_id_key: str = "db_id",
        input_sql_key: str = "SQL",
        input_prompt_key: str = "rl_prompt",
        output_difficulty_key: str = "sql_execution_difficulty"
    ):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :---------------------- | :---------------- | :--------------------------- | :--------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_db_id_key** | str | "db_id" | 输入列名，对应数据库ID字段。 |
| **input_sql_key** | str | "SQL" | 输入列名，对应标准SQL查询字段。 |
| **input_prompt_key** | str | "rl_prompt" | 输入列名，对应生成SQL所用的提示词字段。 |
| **output_difficulty_key** | str | "sql_execution_difficulty" | 输出列名，对应评估出的难度标签字段。 |

## 🧠 示例用法
