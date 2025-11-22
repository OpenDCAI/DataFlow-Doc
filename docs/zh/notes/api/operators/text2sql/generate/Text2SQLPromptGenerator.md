---
title: Text2SQLPromptGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text2sql/generate/text2sqlpromptgenerator/
---

## 📘 概述

`Text2SQLPromptGenerator` 是一个为Text-to-SQL任务生成提示词（prompt）的算子。它通过从指定的数据库中提取Schema信息，并结合用户输入的自然语言问题，构建出适用于大语言模型的完整提示词。该算子支持自定义提示词模板，以适应不同的模型和需求。

## \_\_init\_\_函数

```python
def __init__(self, 
            database_manager: DatabaseManager,
            prompt_template = None
        ):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **database_manager** | DatabaseManager | 必需 | 数据库管理实例，用于获取数据库的schema和内容信息。 |
| **prompt_template** | PromptABC | None | 提示词模板对象，用于构建最终的Text-to-SQL提示词。默认为内置的`Text2SQLPromptGeneratorPrompt`。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, 
        input_question_key: str = "question",
        input_db_id_key: str = "db_id",
        input_evidence_key: str = "evidence",
        output_prompt_key: str = "prompt"
    ):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_question_key** | str | "question" | 输入列名，对应自然语言问题字段。 |
| **input\_db\_id\_key** | str | "db_id" | 输入列名，对应数据库ID字段。 |
| **input\_evidence\_key** | str | "evidence" | 输入列名，对应相关证据或上下文信息字段。 |
| **output\_prompt\_key** | str | "prompt" | 输出列名，对应生成的完整提示词字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| (原始输入字段) | - | 保留输入的所有原始字段。 |
| prompt | str | 根据数据库schema和问题生成的完整提示词。 |

示例输入：

```json
{
  "question": "告诉我所有员工的名字和他们的部门。",
  "db_id": "employee_db"
}
```

示例输出：

```json
{
  "question": "告诉我所有员工的名字和他们的部门。",
  "db_id": "employee_db",
  "prompt": "Given the following database schema and content:\nCREATE TABLE employees (id INT, name VARCHAR, department_id INT);\nCREATE TABLE departments (id INT, name VARCHAR);\n/*\n3 example rows from table employees:\n...\n3 example rows from table departments:\n...\n*/\n---\nQuestion: 告诉我所有员工的名字和他们的部门。\nAnswer:"
}
```
