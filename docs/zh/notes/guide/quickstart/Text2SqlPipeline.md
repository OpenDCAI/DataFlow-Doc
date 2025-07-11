---
title: Text-to-SQL数据合成流水线
icon: material-symbols-light:checkbook-outline-rounded
createTime: 2025/06/17 02:00:31  
permalink: /zh/guide/text2sqlpipeline/  
---

# Text-to-SQL数据合成流水线

## 1. 概述

**Text-to-SQL数据合成流水线**的核心目标是通过清洗和扩充现有的Text-to-SQL数据，为每个样本生成包含训练提示词（prompt）和长链推理过程（chain-of-thought）的高质量问答数据。流水线能够一键完成从原始数据到最终训练数据的全流程处理。

我们支持以下数据要求：
* 必须包含数据库id、自然语言问题和标准SQL答案三个部分
* 支持`json`和`jsonl`输入格式

流水线的主要流程包括：
1. **数据过滤**：筛选无效SQL和问题描述不一致的数据
2. **难度分类**：基于SQL语法复杂度和执行通过率划分难度等级
3. **Schema处理**：提取和格式化数据库Schema信息
4. **知识生成**：构建自然语言问题到SQL查询所需的额外知识
5. **问题优化**：标准化问题表述
6. **提示词生成**：构建用于训练的高质量问答数据

---

## 2. 数据格式

### 2.1 数据库配置

在进行数据库解析和执行时，需要配置相应的数据库信息。

- **Schema定义文件**：`tables.json`（JSON格式）
  - **说明**：该文件用于定义数据库的Schema信息。
  - **参照**：[Spider dataset](https://drive.google.com/file/d/1403EGqzIDoHMdQF4c9Bkyl7dZLZ5Wt6J/view)中的`tables.json`文件。
  - **示例**：
    ```json
    [
      {
        "db_id": "banking",
        "table_names_original": ["accounts", "customers", "transactions"],
        "table_names": ["Accounts", "Customers", "Transactions"],
        "column_names_original": [
          [-1, "*"],
          [0, "account_id"],
          [0, "customer_id"],
          [0, "balance"],
          [1, "customer_id"],
          [1, "name"],
          [1, "email"],
          [2, "transaction_id"],
          [2, "account_id"],
          [2, "amount"],
          [2, "date"]
        ],
        "column_names": [
          [-1, "*"],
          [0, "Account ID"],
          [0, "Customer ID"],
          [0, "Balance"],
          [1, "Customer ID"],
          [1, "Name"],
          [1, "Email"],
          [2, "Transaction ID"],
          [2, "Account ID"],
          [2, "Amount"],
          [2, "Date"]
        ],
        "column_types": [
          "text",
          "integer",
          "integer",
          "real",
          "integer",
          "text",
          "text",
          "integer",
          "integer",
          "real",
          "date"
        ],
        "primary_keys": [1, 4, 7],
        "foreign_keys": [
          [2, 4],
          [8, 1]
        ]
      }
    ]
    ```

- **数据库文件夹**：包含可执行的数据库文件
  - **说明**：数据库文件夹中存放实际的数据库文件。其中有大量数据库（`db_id_i`），每个数据库中需要有sqlite文件（`db_id_i.sqlite`）
  - **参照**：[Spider dataset](https://drive.google.com/file/d/1403EGqzIDoHMdQF4c9Bkyl7dZLZ5Wt6J/view)中的`database`文件夹。
  - **结构示例**：
    ```
    - database
      - db_id_1
        - db_id_1.sqlite
      - db_id_2
        - db_id_2.sqlite
      - db_id_3
        - db_id_3.sqlite
    ```
  - **演示说明**：  
    为便于演示，我们已准备了一个示例数据库，存放于以下地址：  
    https://huggingface.co/datasets/Open-Dataflow/dataflow-Text2SQL-database-example  
    **使用步骤**：  
    1. 请在执行代码前，完整下载该数据库（即 `dev_databases` 文件夹）  
    2. 确保文件夹内的文件结构保持不变  
    3. 将代码中的 `db_root_path` 参数修改为您本地 `dev_databases` 文件夹的实际路径  

### 2.2 输入数据

- **支持格式**：`json`、`jsonl`  
- **必需字段**：  
  - `db_id`：数据库id
  - `question`：自然语言问题  
  - `SQL`：标准SQL答案
- **可选字段**：其它字段会被忽略，但建议只保留必要字段，避免与后续处理冲突。  
- **示例**（`json`）：
  ```json
  {
    "db_id": "california_schools",
    "question": "What is the highest eligible free rate for K-12 students in the schools in Alameda County?",
    "SQL": "SELECT `Free Meal Count (K-12)` / `Enrollment (K-12)` FROM frpm WHERE `County Name` = 'Alameda' ORDER BY (CAST(`Free Meal Count (K-12)` AS REAL) / `Enrollment (K-12)`) DESC LIMIT 1"
  }
  ```
- **演示数据集**：  
  `Text2SqlPipeline/bird_example/dev_20240627/dev.json`  
  包含数据库id、自然语言问题和标准SQL答案，适用于快速测试和演示。

### 2.3 输出数据

- **格式**：`jsonl`（每个步骤都会生成一个文件）  
- **字段说明**：
  - `evidence`: 推理过程中提取的关键证据或中间结果
  - `selected_schema`: 经过筛选的数据库schema信息
  - `raw_schema`: 原始完整的数据库schema信息
  - `ddl`: 数据库表结构定义语句
  - `whole_format_schema`: 完整格式化的数据库schema说明
  - `selected_format_schema`: 筛选后格式化的数据库schema说明
  - `refined_question`: 经过语义优化的自然语言问题
  - `rl_prompt`: 最终生成的提示词模板
  - `sft_output`: 监督式微调(SFT)模型的原始输出
  - `sql_component_difficulty`: SQL组件复杂度评估（easy/medium/hard/extra）
  - `sql_execution_difficulty`: SQL执行复杂度评估（easy/medium/hard）
- **示例**：
  ```json
  {
    "evidence": "Eligible free rate = `Free Meal Count` / `Enrollment`",
    "selected_schema": "[{'table_name': ...]}]",
    "raw_schema": "{'tables': {'frpm': [...], 'schools': [...]}}",
    "ddl": "CREATE TABLE frpm (...);\nCREATE TABLE schools (...);",
    "whole_format_schema": "## Table: frpm ...",
    "selected_format_schema": "Table frpm ...",
    "refined_question": "What is the highest free benefit rate for K-12 in Alameda?",
    "rl_prompt": "Task: Generate SQL from schema...\nSchema: {...}\nQuestion: {...}",
    "sft_output": "Let's think step by step...",
    "sql_component_difficulty": "medium",
    "sql_execution_difficulty": "medium"
  }
  ```

## 3. **数据处理流程**

### 3.1 **SQL过滤器（SQLFilter）**
**功能**：
* 剔除执行异常的gold SQL
* 过滤与问题描述不一致的SQL

**输入**：原始输入数据
**输出**：有效的Text-to-SQL数据

### 3.2 **SQL难度分类器（SQLDifficultyClassifier）**
**功能**：
* 参考Spider标准，基于SQL语法复杂度划分难度等级
* 难度等级：easy/medium/hard/extra

**输入**：过滤后的数据
**输出**：带有难度标签的数据

### 3.3 **模式链接器（SchemaLinking）**
**功能**：
* 基于SQL查询，从全量数据库Schema中提取使用的关联表和列

**输入**：带有难度标签的数据
**输出**：包含Schema链接信息的数据

### 3.4 **Schema提取器（DatabaseSchemaExtractor）**
**功能**：
* 构建完整的数据库Schema信息
* 生成格式化的Schema描述
* 包括DDL语句和自然语言描述

**输入**：Schema链接后的数据
**输出**：带有完整Schema信息的数据

### 3.5 **知识生成器（ExtraKnowledgeGeneration）**
**功能**：
* 构建自然语言问题推到至SQL查询所需的额外知识
* 解释量词对应数值
* 明确名词实体映射关系

**输入**：带有Schema信息的数据
**输出**：包含额外知识的数据

### 3.6 **问题优化器（QuestionRefiner）**
**功能**：
* 标准化问题表述
* 拆分复合问句
* 统一提问句式（What/How开头）

**输入**：包含额外知识的数据
**输出**：优化后的问题数据

### 3.7 **提示词生成器（PromptGeneration）**
**功能**：
* 构建用于SFT训练的问题
* 生成长链推理过程的高质量回答
* 生成用于RL训练的问题

**输入**：优化后的问题数据
**输出**：训练用的问答数据

### 3.8 **执行难度分类器（Text2SQLDifficultyClassifier）**
**功能**：
* 基于执行通过率划分生成难度
* 支持多模型测试
* 难度等级：easy/medium/hard/extra

**输入**：生成的问答数据
**输出**：带有执行难度标签的最终数据

## 4. **输出数据**

最终输出数据包含以下字段：
* **evidence**：推理过程中提取的关键证据
* **selected_schema**：从SQL中提取的数据库schema信息
* **raw_schema**：原始完整的数据库schema
* **ddl**：数据库表结构定义语句
* **whole_format_schema**：完整格式化的schema说明
* **selected_format_schema**：筛选后格式化的schema说明
* **refined_question**：优化后的自然语言问题
* **rl_prompt**：最终生成的提示词模板
* **sft_output**：监督式微调模型的原始输出
* **sql_component_difficulty**：SQL组件复杂度评估
* **sql_execution_difficulty**：SQL执行复杂度评估

示例输出：
```json
{
  "evidence": "Eligible free rate = `Free Meal Count` / `Enrollment`",
  "selected_schema": "[{'table_name': ...]}]",
  "raw_schema": "{'tables': {'frpm': [...], 'schools': [...]}}",
  "ddl": "CREATE TABLE frpm (...);\nCREATE TABLE schools (...);",
  "whole_format_schema": "## Table: frpm ...",
  "selected_format_schema": "Table frpm ...",
  "refined_question": "What is the highest free benefit rate for K-12 in Alameda?",
  "rl_prompt": "Task: Generate SQL from schema...\nSchema: {...}\nQuestion: {...}",
  "sft_output": "Let's think step by step...",
  "sql_component_difficulty": "medium",
  "sql_execution_difficulty": "medium"
}
```

## 5. 运行方式

该流水线通过简单的Python命令执行：

```bash
python test/test_text2sql.py
```
