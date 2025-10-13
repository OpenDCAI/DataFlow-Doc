---
title: Text2SQLCoTGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text2sql/generate/text2sqlcotgenerator/
---

## 📘 Overview
The `Text2SQLCoTGenerator` is an operator that generates Chain-of-Thought (CoT) reasoning for converting natural language questions into SQL queries based on a given database schema. It leverages a large language model (LLM) to produce a detailed reasoning process that leads to the final SQL query, enhancing the model's transparency and accuracy for complex text-to-SQL tasks.

## `__init__`
```python
def __init__(self, 
             llm_serving: LLMServingABC, 
             database_manager: DatabaseManager,
             prompt_template=None
             )
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | Large Language Model serving instance, used for executing inference and generation. |
| **database_manager** | DatabaseManager | Required | Manages database connections, schema retrieval, and query execution. |
| **prompt_template** | PromptABC | None | Prompt template object for building the input. Defaults to `Text2SQLCotGeneratorPrompt` if not provided. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, 
        storage: DataFlowStorage, 
        input_sql_key: str = "SQL",
        input_question_key: str = "question",
        input_db_id_key: str = "db_id",
        input_evidence_key: str = "evidence",
        output_cot_key: str = "cot_reasoning"
        )
```
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance responsible for reading and writing data. |
| **input_sql_key** | str | "SQL" | Input column name for the gold SQL query. |
| **input_question_key**| str | "question" | Input column name for the natural language question. |
| **input_db_id_key** | str | "db_id" | Input column name for the database identifier. |
| **input_evidence_key**| str | "evidence" | Input column name for the evidence text. |
| **output_cot_key** | str | "cot_reasoning" | Output column name for the generated Chain-of-Thought reasoning. |

## 🧠 Example Usage
```python

```
