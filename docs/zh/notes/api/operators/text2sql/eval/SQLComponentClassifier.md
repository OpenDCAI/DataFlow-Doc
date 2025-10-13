---
title: SQLComponentClassifier
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text2sql/eval/sqlcomponentclassifier/
---

## 📘 概述

`SQLComponentClassifier` 是一个SQL难度评估算子，它根据SQL查询语句的组件数量和复杂度来评估其难度级别。该算子通过分析SQL结构（如`SELECT`, `WHERE`, `GROUP BY`, `ORDER BY`, `JOIN`等）来量化其复杂性，并根据用户定义的阈值将其分类为不同的难度等级（例如：简单、中等、困难）。

## `__init__`函数

```python
def __init__(self, 
    difficulty_thresholds: list,
    difficulty_labels: list
):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **difficulty_thresholds** | list | 必需 | 用于划分难度等级的数值阈值列表。 |
| **difficulty_labels** | list | 必需 | 与阈值对应的难度标签列表，其长度应比`difficulty_thresholds`多一个。 |

## `run`函数

```python
def run(self, 
    storage: DataFlowStorage,
    input_sql_key: str = "SQL",
    output_difficulty_key: str = "sql_component_difficulty"
):
```

### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_sql_key** | str | "SQL" | 输入列名，对应SQL查询语句字段。 |
| **output_difficulty_key** | str | "sql_component_difficulty" | 输出列名，对应生成的SQL难度等级字段。 |

## Prompt模板说明

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入的原始字段。 |
| sql_component_difficulty | str | 模型评估出的SQL难度等级。 |

**示例输入：**
```json
{
    "question": "Find the names of all students.",
    "SQL": "SELECT name FROM student"
}
```
**示例输出：**
```json
{
    "question": "Find the names of all students.",
    "SQL": "SELECT name FROM student",
    "sql_component_difficulty": "easy"
}
```
