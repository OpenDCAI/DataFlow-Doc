---
title: Text-to-SQL Data Synthesis Pipeline
icon: material-symbols-light:checkbook-outline-rounded
createTime: 2025/06/17 02:00:31  
permalink: /en/guide/text2sqlpipeline/  
---

# Text-to-SQL Data Synthesis Pipeline

## 1. Overview

The core objective of the **Text-to-SQL Data Synthesis Pipeline** is to refine and expand existing Text-to-SQL data, generating high-quality question-answer pairs for each sample that include training prompts and chain-of-thought (CoT) reasoning. This pipeline automates the entire process from raw data to final training data with a single command. It currently supports two data generation modes:

### Supported Application Scenarios:
* **Data Optimization Mode**:
  - Filter, expand, and enhance existing datasets to produce high-quality training data.
  - Input Requirements: Must include database ID, natural language question, and standard SQL answer.
* **Data Synthesis Mode**:
  - Directly generate training data from database schemas.
  - Feature: Zero-shot initialization — no existing data samples required.

### Processing Workflow:
1. **Data Filtering**:
   - Execution Filtering: Remove invalid or non-executable SQL statements.
   - Consistency Filtering: Ensure alignment between questions, SQL, and database schema.
2. **Data Generation**:
   - SQL Variant Generation: Create semantically equivalent variants of existing SQL queries.
   - SQL Synthesis: Generate new SQL statements based on database schema.
   - Question Generation: Produce corresponding natural language questions from SQL and schema.
3. **Training Data Construction**:
   - Prompt Generation: Integrate natural language questions, database schema, and instructional cues.
   - Chain-of-Thought Generation: Build step-by-step reasoning processes.
4. **Data Grading**:
   - Syntax Difficulty Grading: Classify complexity levels based on SQL structure.
   - Execution Difficulty Grading: Evaluate difficulty based on SQL execution success rates.

## 2. Input Data

Depending on requirements, we provide two pipelines: one for data optimization (refining existing data), and another for data synthesis (generating data directly from databases).

### 2.1 Data Optimization Pipeline

The input data for this pipeline includes the following fields:

* **db_id**: Database file name (i.e., database ID)
* **question**: Natural language question
* **SQL**: Standard SQL answer

- **Example** (`json`):
  ```json
  {
    "db_id": "california_schools",
    "question": "What is the highest eligible free rate for K-12 students in the schools in Alameda County?",
    "SQL": "SELECT `Free Meal Count (K-12)` / `Enrollment (K-12)` FROM frpm WHERE `County Name` = 'Alameda' ORDER BY (CAST(`Free Meal Count (K-12)` AS REAL) / `Enrollment (K-12)`) DESC LIMIT 1"
  }
  ```
- **Demo Dataset**:  
  `example_data/Text2SQLPipeline/pipeline_refine.jsonl`  
  Contains database IDs, natural language questions, and standard SQL answers, suitable for quick testing and demonstration.

Input data can be stored in specified files (e.g., `json`, `jsonl`) and managed/loaded via a `FileStorage` object. The example loads default paths; in practice, you may customize paths to load your own data and cache locations:

```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/Text2SQLPipeline/pipeline_refine.jsonl",
    cache_path="./cache_local",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl"
)
```

### 2.2 Data Synthesis Pipeline

This pipeline does not require existing data—it generates training data directly from databases. Therefore, only database configuration is needed. After configuring the database, pass it to `DatabaseManager`. In this case, set `first_entry_file_name` to `""` since no initial dataset is provided.

```python
self.storage = FileStorage(
    first_entry_file_name="",
    cache_path="./cache",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl"
)
```

## 3. Configuration Guide

Before executing the pipeline, review the following configuration instructions to properly set parameters.

### 3.1 Database Configuration

**Automatic Database Download**: The pipeline supports automatic downloading of sample databases. When `db_root_path` is an empty string, the system will automatically download sample databases from Hugging Face.

For parsing and execution, database information must be configured. Currently, SQLite and MySQL databases are supported.

#### 3.1.1 SQLite Database

SQLite is a file-based database system, requiring specification of the file storage path.

- **Database Root Directory**: Directory containing all database files  
  - **Note**: This directory should contain multiple `.sqlite` or `.db` files. The database manager automatically scans and loads all such files.
  
  - **Critical Note**: Each database file’s name serves as the `db_id`, and must follow the format `db_id.sqlite` or `db_id.db`, matching the `db_id` field in input data.

  - **Supported Directory Structures**:  
    The database manager supports arbitrarily nested folder structures. Examples:
    ```
    databases/
      ├── california_schools.sqlite
      └── hospitals.sqlite
    ```

    ```
    databases/
      ├── forder1/
      │   └── california_schools.sqlite
      └── forder2/
          └── hospitals.sqlite
    ```

    ```
    databases/
      ├── california_schools.sqlite
      └── forder1/
          └── hospitals.sqlite
    ```

  - **Sample Databases**:  
    We provide sample databases for testing, which the pipeline auto-downloads:  
    [https://huggingface.co/datasets/Open-Dataflow/dataflow-Text2SQL-database-example](https://huggingface.co/datasets/Open-Dataflow/dataflow-Text2SQL-database-example)

    **Auto-download Configuration**:
    ```python
    # Auto-download sample database (recommended)
    db_root_path = ""
    model = Text2SQLGeneration_APIPipeline(db_root_path=db_root_path)
    
    # Or manually specify local database path
    db_root_path = "/path/to/your/database"
    model = Text2SQLGeneration_APIPipeline(db_root_path=db_root_path)
    ```

    Database Manager Configuration:
    ```python
    database_manager = DatabaseManager(
        db_type="sqlite",
        config={
            "root_path": self.db_root_path
        }
    )
    ```

    > Note: `db_type` must be set to `"sqlite"`, and `root_path` must point to the directory containing database files.

#### 3.1.2 MySQL Database

MySQL operates as a server-based system, requiring connection credentials. Ensure your MySQL service is running and credentials are correctly configured. In DataFlow, we use the `pymysql` library to connect to MySQL servers.

- **Configuration Steps**:
  1. Prepare MySQL server details.
  2. Configure them in `database_manager`:
    ```python
    database_manager = DatabaseManager(
        db_type="mysql",
        config={
            "host": "localhost",
            "user": "root",
            "password": "password"
        }
    )
    ```
   > Note: `db_type` must be `"mysql"`. In `config`, provide `host`, `user`, and `password` matching your MySQL server. Ensure target databases exist on the server and you have appropriate access permissions.

### 3.2 Model Configuration

#### 3.2.1 API LLM Service Configuration

In DataFlow, we use the `APILLMServing_request` class to manage API-based LLM services.

```python
llm_serving = APILLMServing_request(
    api_url="http://api.openai.com/v1/chat/completions",
    model_name="gpt-4o",
    max_workers=100
)

# Recommended: Use a more powerful model for CoT generation
cot_generation_api_llm_serving = APILLMServing_request(
    api_url="http://api.openai.com/v1/chat/completions",
    model_name="gpt-4o",  # Can be replaced with a stronger model
    max_workers=100
)

embedding_serving = APILLMServing_request(
    api_url="http://api.openai.com/v1/embeddings",
    model_name="text-embedding-ada-002",
    max_workers=100
)
```

Where:
- `llm_serving`: Handles general tasks.
- `cot_generation_api_llm_serving`: Generates complex chain-of-thought reasoning.
- `embedding_serving`: Generates text embedding vectors.

## 4. Data Flow & Pipeline Logic

### 4.1 Data Filters

#### 4.1.1 **SQL Execution Filter (SQLExecutionFilter)**

The **SQL Execution Filter** validates SQL executability by actually running queries, filtering out malformed or failing statements.

**Functionality**:
- Verifies SQL executable status
- Removes syntactically incorrect or execution-failed SQL

**Input**: SQL statement and database ID  
**Output**: Valid, executable SQL statements

```python
sql_execution_filter = SQLExecutionFilter(
    database_manager=database_manager
)
```

#### 4.1.2 **SQL Consistency Filter (SQLConsistencyFilter)**

The **SQL Consistency Filter** ensures alignment between SQL, natural language questions, and database schema.

**Functionality**:
- Validates consistency among SQL, question, and schema
- Filters mismatched SQL queries

**Input**: SQL statement, database ID, and question  
**Output**: Consistent SQL statements

```python
sql_consistency_filter = SQLConsistencyFilter(
    llm_serving=llm_serving,
    database_manager=database_manager,
    prompt_template=SQLConsistencyFilterPrompt()
)
```

### 4.2 Data Generators

#### 4.2.1 **SQL Generator (SQLGenerator)**

The **SQL Generator** produces SQL queries from database schema, providing raw SQL for downstream processing.

**Functionality**:
- Automatically generates SQL queries from schema
- Supports batch generation of specified quantities

**Input**: Database schema  
**Output**: Generated SQL statements and associated database IDs

```python
sql_generator = SQLGenerator(
    llm_serving=llm_serving,
    database_manager=database_manager,
    generate_num=50,
    prompt_template=SelectSQLGeneratorPrompt()
)
```

#### 4.2.2 **SQL Variation Generator (SQLVariationGenerator)**

The **SQL Variation Generator** creates semantically equivalent variants of existing SQL queries to increase dataset diversity.

**Functionality**:
- Generates functionally equivalent SQL variants
- Enhances diversity and complexity of SQL expressions

**Input**: Original SQL and database ID  
**Output**: Set of SQL variants

```python
sql_variation_generator = SQLVariationGenerator(
    llm_serving=llm_serving,
    database_manager=database_manager,
    num_variations=5,
    prompt_template=SQLVariationGeneratorPrompt()
)
```

#### 4.2.3 **Question Generator (Text2SQLQuestionGenerator)**

The **Question Generator** converts given SQL queries into natural language questions, forming Text-to-SQL QA pairs.

**Functionality**:
- Generates natural language questions from SQL
- Supports multiple candidate questions per SQL

**Input**: SQL and database ID  
**Output**: Natural language questions

```python
text2sql_question_generator = Text2SQLQuestionGenerator(
    llm_serving=llm_serving,
    embedding_serving=embedding_serving,
    database_manager=database_manager,
    question_candidates_num=5,
    prompt_template=Text2SQLQuestionGeneratorPrompt()
)
```

#### 4.2.4 **Prompt Generator (Text2SQLPromptGenerator)**

The **Prompt Generator** constructs structured training prompts by integrating questions and database schema.

**Functionality**:
- Builds structured prompt templates
- Combines question and schema context

**Input**: Question and database ID  
**Output**: Formatted prompt template

```python
text2sql_prompt_generator = Text2SQLPromptGenerator(
    database_manager=database_manager,
    prompt_template=Text2SQLPromptGeneratorPrompt()
)
```

#### 4.2.5 **Chain-of-Thought Generator (Text2SQLCoTGenerator)**

The **Chain-of-Thought Generator** produces detailed reasoning steps explaining how a question transforms into SQL, aiding model comprehension.

**Functionality**:
- Generates step-by-step reasoning for SQL queries
- Includes retry mechanisms to ensure quality

**Input**: SQL, question, and database ID  
**Output**: Chain-of-thought reasoning

```python
sql_cot_generator = Text2SQLCoTGenerator(
    llm_serving=cot_generation_api_llm_serving,
    database_manager=database_manager,
    max_retries=3,
    enable_retry=True,
    prompt_template=Text2SQLCotGeneratorPrompt()
)
```

### 4.3 Data Evaluators

#### 4.3.1 **Component Difficulty Classifier (SQLComponentClassifier)**

The **Component Difficulty Classifier** analyzes SQL component complexity and assigns difficulty levels.

**Functionality**:
- Analyzes structural complexity of SQL
- Labels samples with difficulty tiers

**Input**: SQL statement  
**Output**: SQL component difficulty level

```python
sql_component_classifier = SQLComponentClassifier(
    difficulty_thresholds=[2, 4, 6],
    difficulty_labels=['easy', 'medium', 'hard', 'extra']
)
```

#### 4.3.2 **Execution Difficulty Classifier (SQLExecutionClassifier)**

The **Execution Difficulty Classifier** evaluates SQL execution difficulty using statistical analysis across multiple generations.

**Functionality**:
- Assesses execution difficulty based on success rates
- Uses multiple attempts for robust evaluation

**Input**: SQL, database ID, and prompt  
**Output**: SQL execution difficulty level

```python
sql_execution_classifier = SQLExecutionClassifier(
    llm_serving=llm_serving,
    database_manager=database_manager,
    num_generations=10,
    difficulty_thresholds=[2, 5, 9],
    difficulty_labels=['extra', 'hard', 'medium', 'easy']
)
```

### 4.4 Prompt Template System

Each component uses dedicated prompt templates to ensure consistent, high-quality outputs:

- `SelectSQLGeneratorPrompt()` – SQL generation prompt
- `SQLVariationGeneratorPrompt()` – SQL variation generation prompt  
- `Text2SQLQuestionGeneratorPrompt()` – Question generation prompt
- `Text2SQLPromptGeneratorPrompt()` – Training prompt generation
- `Text2SQLCotGeneratorPrompt()` – CoT reasoning prompt
- `SQLConsistencyFilterPrompt()` – Consistency filtering prompt

## 5. Output Data

- **Format**: `jsonl` (each pipeline step generates its own file)  
- **Fields**:
  - `db_id`: Database ID
  - `question`: Natural language question
  - `SQL`: Standard SQL answer
  - `prompt`: Training prompt combining question, schema, and instructions
  - `cot_reasoning`: Chain-of-thought reasoning with step-by-step logic and final answer
  - `sql_component_difficulty`: SQL component complexity grade
  - `sql_execution_difficulty`: SQL execution difficulty grade
- **Example**:
  ```json
  {
      "db_id":"california_schools",
      "SQL":"SELECT AVG(s.AvgScrRead) AS average_reading_score\nFROM satscores s\nINNER JOIN frpm f ON s.cds = f.CDSCode\nINNER JOIN schools sc ON f.CDSCode = sc.CDSCode\nWHERE s.cname = 'Alameda'\n  AND f.\"Charter School (Y/N)\" = 1\n  AND f.\"Charter Funding Type\" = 'Directly funded'\n  AND sc.County = 'Alameda';",
      "question":"What is the average reading score for directly funded charter schools in Alameda County?",
      "prompt":"Task Overview: /* Given the following database schema: ... /* Answer the following: What is the average reading score for directly funded charter schools in Alameda County? * Let's think step by step",
      "cot_reasoning":"To translate the natural language question into an executable SQLite query, we will follow these steps. ... we can construct the full SQLite query based on these steps:\n\n```sql\nSELECT AVG(s.AvgScrRead) AS average_reading_score\nFROM satscores s\nINNER JOIN frpm f ON s.cds = f.CDSCode\nINNER JOIN schools sc ON f.CDSCode = sc.CDSCode\nWHERE s.cname = 'Alameda'\n  AND f.\"Charter School (Y/N)\" = 1\n  AND f.\"Charter Funding Type\" = 'Directly funded'\n  AND sc.County = 'Alameda';\n```\n\nThis query follows the logic outlined above and ensures alignment with the reference solution.",
      "sql_component_difficulty":"medium",
      "sql_execution_difficulty":"medium"
  }
  ```

## 6. Execution Methods

Two pipelines are designed for different data needs, executed via simple Python commands:

* **Data Synthesis Pipeline**:

  ```bash
  python /path/to/text2sql_generation_pipeline.py
  ```

* **Data Optimization Pipeline**:

  ```bash
  python /path/to/text2sql_refine_pipeline.py
  ```

## 7. Pipeline Example

Below is an example demonstrating how to chain multiple operators for reasoning data processing. This example shows initializing and sequentially executing filtering and cleaning steps.

* **Data Synthesis Pipeline**:

```python
class Text2SQLGeneration_APIPipeline():
    def __init__(self, db_root_path=""):
        self.logger = get_logger()
        self.db_root_path = db_root_path

        # Automatic database download
        if not db_root_path:
            try:
                self.db_root_path = download_and_extract_database(self.logger)
                self.logger.info(f"Using automatically downloaded database at: {self.db_root_path}")
            except Exception as e:
                self.logger.error(f"Failed to auto-download database: {e}")
                raise 
        else:
            self.logger.info(f"Using manually specified database path: {self.db_root_path}")

        self.storage = FileStorage(
            first_entry_file_name="",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )

        self.llm_serving = APILLMServing_request(
            api_url="http://api.openai.com/v1/chat/completions",
            model_name="gpt-4o",
            max_workers=100
        )

        cot_generation_api_llm_serving = APILLMServing_request(
            api_url="http://api.openai.com/v1/chat/completions",
            model_name="gpt-4o", 
            max_workers=100
        )

        embedding_serving = APILLMServing_request(
            api_url="http://api.openai.com/v1/embeddings",
            model_name="text-embedding-ada-002",
            max_workers=100
        )

        database_manager = DatabaseManager(
            db_type="sqlite",
            config={
                "root_path": self.db_root_path
            }
        )
        
        self.sql_generator_step1 = SQLGenerator(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            generate_num=50,
            prompt_template=SelectSQLGeneratorPrompt()
        )

        self.sql_execution_filter_step2 = SQLExecutionFilter(
            database_manager=database_manager,
        )

        self.text2sql_question_generator_step3 = Text2SQLQuestionGenerator(
            llm_serving=self.llm_serving,
            embedding_serving=embedding_serving,
            database_manager=database_manager,
            question_candidates_num=5,
            prompt_template=Text2SQLQuestionGeneratorPrompt()
        )

        self.text2sql_prompt_generator_step4 = Text2SQLPromptGenerator(
            database_manager=database_manager,
            prompt_template=Text2SQLPromptGeneratorPrompt()
        )

        self.sql_cot_generator_step5 = Text2SQLCoTGenerator(
            llm_serving=cot_generation_api_llm_serving,
            database_manager=database_manager,
            max_retries=3,
            enable_retry=True,
            prompt_template=Text2SQLCotGeneratorPrompt()
        )

        self.sql_component_classifier_step6 = SQLComponentClassifier(
            difficulty_thresholds=[2, 4, 6],
            difficulty_labels=['easy', 'medium', 'hard', 'extra']
        )

        self.sql_execution_classifier_step7 = SQLExecutionClassifier(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            num_generations=10,
            difficulty_thresholds=[2, 5, 9],
            difficulty_labels=['extra', 'hard', 'medium', 'easy']
        )
        
    def forward(self):
        sql_key = "SQL"
        db_id_key = "db_id"
        question_key = "question"

        self.sql_generator_step1.run(
            storage=self.storage.step(),
            output_sql_key=sql_key,
            output_db_id_key=db_id_key
        )

        self.sql_execution_filter_step2.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key
        )

        self.text2sql_question_generator_step3.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            output_question_key=question_key
        )

        self.text2sql_prompt_generator_step4.run(
            storage=self.storage.step(),
            input_question_key=question_key,
            input_db_id_key=db_id_key,
            output_prompt_key="prompt"
        )

        self.sql_cot_generator_step5.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_question_key=question_key,
            input_db_id_key=db_id_key,
            output_cot_key="cot_reasoning"
        )

        self.sql_component_classifier_step6.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            output_difficulty_key="sql_component_difficulty"
        )

        self.sql_execution_classifier_step7.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            input_prompt_key="prompt",
            output_difficulty_key="sql_execution_difficulty"
        )

if __name__ == "__main__":
    # Set db_root_path to your local DB path, or "" to auto-download
    db_root_path = ""
    
    model = Text2SQLGeneration_APIPipeline(db_root_path=db_root_path)
    model.forward()
```

* **Data Optimization Pipeline**:
```python
class Text2SQLRefine_APIPipeline():
    def __init__(self, db_root_path=""):
        self.logger = get_logger()
        self.db_root_path = db_root_path

        # Automatic database download
        if not db_root_path:
            try:
                self.db_root_path = download_and_extract_database(self.logger)
                self.logger.info(f"Using automatically downloaded database at: {self.db_root_path}")
            except Exception as e:
                self.logger.error(f"Failed to auto-download database: {e}")
                raise 
        else:
            self.logger.info(f"Using manually specified database path: {self.db_root_path}")

        self.storage = FileStorage(
            first_entry_file_name="../example_data/Text2SQLPipeline/pipeline_refine.jsonl",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl"
        )

        self.llm_serving = APILLMServing_request(
            api_url="http://api.openai.com/v1/chat/completions",
            model_name="gpt-4o",
            max_workers=100
        )

        cot_generation_api_llm_serving = APILLMServing_request(
            api_url="http://api.openai.com/v1/chat/completions",
            model_name="gpt-4o", 
            max_workers=100
        )

        embedding_serving = APILLMServing_request(
            api_url="http://api.openai.com/v1/embeddings",
            model_name="text-embedding-ada-002",
            max_workers=100
        )

        database_manager = DatabaseManager(
            db_type="sqlite",
            config={
                "root_path": self.db_root_path
            }
        )
        
        self.sql_execution_filter_step1 = SQLExecutionFilter(
            database_manager=database_manager
        )

        self.sql_consistency_filter_step2 = SQLConsistencyFilter(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            prompt_template=SQLConsistencyFilterPrompt()
        )

        self.sql_variation_generator_step3 = SQLVariationGenerator(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            num_variations=5,
            prompt_template=SQLVariationGeneratorPrompt()
        )

        self.sql_execution_filter_step4 = SQLExecutionFilter(
            database_manager=database_manager
        )

        self.text2sql_question_generator_step5 = Text2SQLQuestionGenerator(
            llm_serving=self.llm_serving,
            embedding_serving=embedding_serving,
            database_manager=database_manager,
            question_candidates_num=5,
            prompt_template=Text2SQLQuestionGeneratorPrompt()
        )

        self.text2sql_prompt_generator_step6 = Text2SQLPromptGenerator(
            database_manager=database_manager,
            prompt_template=Text2SQLPromptGeneratorPrompt()
        )

        self.sql_cot_generator_step7 = Text2SQLCoTGenerator(
            llm_serving=cot_generation_api_llm_serving,
            database_manager=database_manager,
            max_retries=3,
            enable_retry=True,
            prompt_template=Text2SQLCotGeneratorPrompt()
        )

        self.sql_component_classifier_step8 = SQLComponentClassifier(
            difficulty_thresholds=[2, 4, 6],
            difficulty_labels=['easy', 'medium', 'hard', 'extra']
        )

        self.sql_execution_classifier_step9 = SQLExecutionClassifier(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            num_generations=10,
            difficulty_thresholds=[2, 5, 9],
            difficulty_labels=['extra', 'hard', 'medium', 'easy']
        )

    def forward(self):
        sql_key = "SQL"
        db_id_key = "db_id"
        question_key = "question"

        self.sql_execution_filter_step1.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key
        )

        self.sql_consistency_filter_step2.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            input_question_key=question_key
        )

        self.sql_variation_generator_step3.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key
        )

        self.sql_execution_filter_step4.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key
        )

        self.text2sql_question_generator_step5.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            output_question_key=question_key
        )

        self.text2sql_prompt_generator_step6.run(
            storage=self.storage.step(),
            input_question_key=question_key,
            input_db_id_key=db_id_key,
            output_prompt_key="prompt"
        )

        self.sql_cot_generator_step7.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_question_key=question_key,
            input_db_id_key=db_id_key,
            output_cot_key="cot_reasoning"
        )

        self.sql_component_classifier_step8.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            output_difficulty_key="sql_component_difficulty"
        )

        self.sql_execution_classifier_step9.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            input_prompt_key="prompt",
            output_difficulty_key="sql_execution_difficulty"
        )

if __name__ == "__main__":
    # Set db_root_path to your local DB path, or "" to auto-download
    db_root_path = ""

    model = Text2SQLRefine_APIPipeline(db_root_path=db_root_path)
    model.forward()
```