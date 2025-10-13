---
title: SQLExecutionClassifier
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text2sql/eval/sqlexecutionclassifier/
---

## 📘 Overview
This operator evaluates the difficulty of SQL generation for a question based on the accuracy of generated SQLs. It asks the model to generate multiple SQL queries based on a natural language question, a database schema, and a prompt. By assessing the accuracy of these generated SQL queries, it determines the difficulty level of the question for the model.

## __init__ function
```python
@OPERATOR_REGISTRY.register()
class SQLExecutionClassifier(OperatorABC):
    def __init__(self,
                llm_serving: LLMServingABC,
                database_manager: DatabaseManager,
                num_generations: int = 10,
                difficulty_thresholds: list = [2, 5, 9],
                difficulty_labels: list = ['extra', 'hard', 'medium', 'easy']
            ):
```
### init parameters
| Parameter | Type | Default Value | Description |
| :---------------------- | :--------------- | :--------------------------------------- | :-------------------------------------------------------------------------------- |
| **llm_serving** | LLMServingABC | Required | Large language model serving instance. |
| **database_manager** | DatabaseManager | Required | Database manager instance for executing SQL queries. |
| **num_generations** | int | 10 | The number of SQL queries to generate for each question to assess difficulty. |
| **difficulty_thresholds** | list | `[2, 5, 9]` | A list of thresholds for the number of successful SQL executions to classify difficulty. |
| **difficulty_labels** | list | `['extra', 'hard', 'medium', 'easy']` | A list of labels corresponding to the difficulty thresholds. |

## run function
```python
def run(self, storage: DataFlowStorage,
        input_db_id_key: str = "db_id",
        input_sql_key: str = "SQL",
        input_prompt_key: str = "rl_prompt",
        output_difficulty_key: str = "sql_execution_difficulty"
    ):
```
#### Parameters
| Name | Type | Default Value | Description |
| :---------------------- | :---------------- | :--------------------------- | :----------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_db_id_key** | str | "db_id" | The column name in the input data that contains the database ID. |
| **input_sql_key** | str | "SQL" | The column name in the input data that contains the ground truth SQL query. |
| **input_prompt_key** | str | "rl_prompt" | The column name in the input data that contains the prompt for the LLM. |
| **output_difficulty_key** | str | "sql_execution_difficulty" | The column name for the output that will store the classified difficulty. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format (Output Format)
The operator adds the `output_difficulty_key` column to the input DataFrame. All existing columns from the input are preserved.

| Field | Type | Description |
| :------------------------- | :--- | :------------------------------------------------ |
| ... | ... | All original columns from the input data. |
| sql_execution_difficulty | str | The classified difficulty level (e.g., 'easy', 'medium', 'hard', 'extra'). |
