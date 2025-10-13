---
title: SQLComponentClassifier
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text2sql/eval/sqlcomponentclassifier/
---

## 📘 Overview

The `SQLComponentClassifier` is an operator designed to evaluate and classify the difficulty of SQL queries based on the number and complexity of their components. It analyzes a given SQL query and assigns a difficulty label (e.g., easy, medium, hard) based on predefined thresholds. This is particularly useful in Text2SQL tasks for categorizing data and understanding model performance across different complexity levels.

## __init__ function

```python
def __init__(self, 
    difficulty_thresholds: list,
    difficulty_labels: list
):
```

### init parameters

| Parameter Name | Type | Default Value | Description |
| :---------------------- | :--- | :------------ | :---------------------------------------------------------------------------------------------------------------------------- |
| **difficulty_thresholds** | list | Required | A list of numerical thresholds used to bin the SQL complexity scores into different difficulty levels. |
| **difficulty_labels** | list | Required | A list of string labels corresponding to the difficulty levels. The number of labels must be one greater than the number of thresholds. |

## run function

```python
def run(self, 
    storage: DataFlowStorage,
    input_sql_key: str = "SQL",
    output_difficulty_key: str = "sql_component_difficulty"
):
```

#### Parameters

| Name | Type | Default Value | Description |
| :---------------------- | :---------------- | :----------------------------- | :------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading and writing data. |
| **input_sql_key** | str | "SQL" | The column name in the input data that contains the SQL queries. |
| **output_difficulty_key** | str | "sql_component_difficulty" | The column name where the calculated difficulty label will be stored. |

## Prompt Template Descriptions



## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

| Field | Type | Description |
| :---------------------- | :--- | :------------------------------------------------ |
| (original_columns) | - | The original columns from the input data are preserved. |
| sql_component_difficulty | str | The assigned difficulty label for the SQL query. |

**Example Input:**

```json
{
    "question": "Show the name of singers ordered by their birth year.",
    "SQL": "SELECT name FROM singers ORDER BY birth_year"
}
```

**Example Output:**

```json
{
    "question": "Show the name of singers ordered by their birth year.",
    "SQL": "SELECT name FROM singers ORDER BY birth_year",
    "sql_component_difficulty": "easy"
}
```
