---
title: Text-to-SQL Data Synthesis Pipeline  
icon: material-symbols-light:checkbook-outline-rounded  
createTime: 2025/06/17 02:00:31  
permalink: /en/guide/text2sqlpipeline/  

---

# Text-to-SQL Data Synthesis Pipeline

## 1. Overview

The core objective of the **Text-to-SQL Data Synthesis Pipeline** is to generate high-quality Q&A data containing training prompts and chain-of-thought reasoning processes by cleaning and augmenting existing Text-to-SQL data. The pipeline can complete the entire process from raw data to final training data with one click.

We support the following data requirements:
* Must contain three components: database ID, natural language question, and standard SQL answer
* Supports both `json` and `jsonl` input formats

The main workflow of the pipeline includes:
1. **Data Filtering**: Screening invalid SQL and data with inconsistent question descriptions
2. **Difficulty Classification**: Classifying difficulty levels based on SQL syntax complexity and execution pass rate
3. **Schema Processing**: Extracting and formatting database schema information
4. **Knowledge Generation**: Constructing additional knowledge required for mapping natural language questions to SQL queries
5. **Question Optimization**: Standardizing question expressions
6. **Prompt Generation**: Building high-quality Q&A data for training

---

## 2. Data Formats

### 2.1 Database Configuration

When parsing and executing databases, corresponding database information needs to be configured.

- **Schema Definition File**: `tables.json` (JSON format)
  - **Description**: This file defines the database schema information.
  - **Reference**: The `tables.json` file in the [Spider dataset](https://drive.google.com/file/d/1403EGqzIDoHMdQF4c9Bkyl7dZLZ5Wt6J/view).
  - **Example**:
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

- **Database Folder**: Contains executable database files
  - **Description**: The database folder stores actual database files. It contains multiple databases (`db_id_i`), each requiring a SQLite file (`db_id_i.sqlite`).
  - **Reference**: The `database` folder in the [Spider dataset](https://drive.google.com/file/d/1403EGqzIDoHMdQF4c9Bkyl7dZLZ5Wt6J/view).
  - **Structure Example**:
    ```
    - database
      - db_id_1
        - db_id_1.sqlite
      - db_id_2
        - db_id_2.sqlite
      - db_id_3
        - db_id_3.sqlite
    ```
  - **Demo Instructions**:  
    For demonstration purposes, we have prepared a sample database, available at:  
    https://huggingface.co/datasets/Open-Dataflow/dataflow-Text2SQL-database-example  
    **Usage Steps**:  
    1. Before executing the code, download the entire database (i.e., the `dev_databases` folder).  
    2. Ensure the file structure within the folder remains unchanged.  
    3. Modify the `db_root_path` parameter in the code to point to the local path of your downloaded `dev_databases` folder.  

### 2.2 Input Data

- **Supported Formats**: `json`, `jsonl`  
- **Required Fields**:  
  - `db_id`: Database ID
  - `question`: Natural language question  
  - `SQL`: Standard SQL answer
- **Optional Fields**: Other fields will be ignored, but it's recommended to keep only necessary fields to avoid conflicts with subsequent processing.  
- **Example** (`json`):
  ```json
  {
    "db_id": "california_schools",
    "question": "What is the highest eligible free rate for K-12 students in the schools in Alameda County?",
    "SQL": "SELECT `Free Meal Count (K-12)` / `Enrollment (K-12)` FROM frpm WHERE `County Name` = 'Alameda' ORDER BY (CAST(`Free Meal Count (K-12)` AS REAL) / `Enrollment (K-12)`) DESC LIMIT 1"
  }
  ```
- **Demo Dataset**:  
  `Text2SqlPipeline/bird_example/dev_20240627/dev.json`  
  Contains database IDs, natural language questions, and standard SQL answers, suitable for quick testing and demonstration.

### 2.3 Output Data

- **Format**: `jsonl` (Each step generates a file)  
- **Field Descriptions**:
  - `evidence`: Key evidence or intermediate results extracted during reasoning
  - `selected_schema`: Filtered database schema information
  - `raw_schema`: Original complete database schema
  - `ddl`: Database table structure definition statements
  - `whole_format_schema`: Complete formatted database schema description
  - `selected_format_schema`: Filtered formatted database schema description
  - `refined_question`: Semantically optimized natural language question
  - `rl_prompt`: Final generated prompt template
  - `sft_output`: Raw output of supervised fine-tuning (SFT) model
  - `sql_component_difficulty`: SQL component complexity assessment (easy/medium/hard/extra)
  - `sql_execution_difficulty`: SQL execution complexity assessment (easy/medium/hard)
- **Example**:
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

## 3. **Data Processing Workflow**

### 3.1 **SQL Filter (SQLFilter)**
**Function**:
* Eliminates gold SQL with execution exceptions
* Filters SQL inconsistent with question descriptions

**Input**: Raw input data  
**Output**: Valid Text-to-SQL data

### 3.2 **SQL Difficulty Classifier (SQLDifficultyClassifier)**
**Function**:
* Classifies difficulty levels based on SQL syntax complexity, referencing Spider standards
* Difficulty levels: easy/medium/hard/extra

**Input**: Filtered data  
**Output**: Data with difficulty labels

### 3.3 **Schema Linker (SchemaLinking)**
**Function**:
* Extracts associated tables and columns used from the full database schema
* Identifies mapping relationships between entities mentioned in questions and database schema

**Input**: Data with difficulty labels  
**Output**: Data containing schema linking information

### 3.4 **Schema Extractor (DatabaseSchemaExtractor)**
**Function**:
* Constructs complete database schema information
* Generates formatted schema descriptions
* Includes DDL statements and natural language descriptions

**Input**: Schema-linked data  
**Output**: Data with complete schema information

### 3.5 **Knowledge Generator (ExtraKnowledgeGeneration)**
**Function**:
* Constructs additional knowledge required for mapping natural language questions to SQL queries
* Explains quantifier corresponding values
* Clarifies noun entity mapping relationships

**Input**: Data with schema information  
**Output**: Data containing additional knowledge

### 3.6 **Question Optimizer (QuestionRefiner)**
**Function**:
* Standardizes question expressions
* Splits compound questions
* Unifies question formats (starting with What/How)

**Input**: Data with additional knowledge  
**Output**: Optimized question data

### 3.7 **Prompt Generator (PromptGeneration)**
**Function**:
* Constructs questions for SFT training
* Generates high-quality answers with chain-of-thought reasoning
* Creates questions for RL training

**Input**: Optimized question data  
**Output**: Training Q&A data

### 3.8 **Execution Difficulty Classifier (Text2SQLDifficultyClassifier)**
**Function**:
* Classifies generation difficulty based on execution pass rate
* Supports multi-model testing
* Difficulty levels: easy/medium/hard/extra

**Input**: Generated Q&A data  
**Output**: Final data with execution difficulty labels

## 4. **Output Data**

The final output data includes the following fields:
* **evidence**: Key evidence extracted during reasoning
* **selected_schema**: Filtered database schema information
* **raw_schema**: Original complete database schema
* **ddl**: Database table structure definition statements
* **whole_format_schema**: Complete formatted schema description
* **selected_format_schema**: Filtered formatted schema description
* **refined_question**: Optimized natural language question
* **rl_prompt**: Final generated prompt template
* **sft_output**: Raw output of supervised fine-tuning model
* **sql_component_difficulty**: SQL component complexity assessment
* **sql_execution_difficulty**: SQL execution complexity assessment

Example output:
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

## 5. Execution Method

The pipeline is executed via a simple Python command:

```bash
python test/test_text2sql.py
```
