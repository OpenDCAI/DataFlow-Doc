---
title: Text-to-SQL Data Synthesis Pipeline
icon: material-symbols-light:checkbook-outline-rounded
createTime: 2025/06/17 02:00:31  
permalink: /en/guide/text2sqlpipeline/  
---

---
title: Text-to-SQL Data Synthesis Pipeline
icon: material-symbols-light:checkbook-outline-rounded
createTime: 2025/06/17 02:00:31  
permalink: /zh/guide/text2sqlpipeline/  
---

# Text-to-SQL Data Synthesis Pipeline

## 1. Overview

The core objective of the **Text-to-SQL Data Synthesis Pipeline** is to generate high-quality Q&A data containing training prompts and chain-of-thought for each sample by cleaning and augmenting existing Text-to-SQL data. This pipeline supports one-click end-to-end processing from raw data to final training data and currently offers the following two data generation modes:

### Supported Application Scenarios

- **Data Refinement Mode**
  - Filters, augments, and enhances existing data to generate high-quality training data
  - Input requirements: Must include the three essential elements: database ID, natural language question, and standard SQL answer

- **Data Synthesis Mode**
  - Directly generates training data from databases
  - Characteristics: No existing data samples required, supports zero-shot startup

### Processing Flow

1. **Data Filtering**
   - Execution Filtering: Removes invalid SQL and non-executable SQL statements
   - Consistency Filtering: Ensures consistency between the question, SQL, and database schema

2. **Data Generation**
   - SQL Variant Generation: Generates semantically equivalent variants based on existing SQL
   - SQL Synthesis: Generates new SQL statements based on the database schema
   - Question Generation: Generates corresponding natural language descriptions based on SQL and schema

3. **Training Data Construction**
   - Prompt Generation: Integrates natural language questions, database schema, and instruction prompts
   - Chain-of-Thought Generation: Constructs step-by-step reasoning processes

4. **Data Grading**
   - Syntax Difficulty Grading: Assigns levels based on the complexity of the SQL statement
   - Execution Difficulty Grading: Evaluates difficulty based on SQL execution pass rate

## 2. Quick Start

### Step 1: Install Dataflow Environment

```shell
pip install open-dataflow
```

### Step 2: Create Working Directory

```shell
mkdir run_dataflow
cd run_dataflow
```

### Step 3: Initialize Dataflow

```shell
dataflow init
```

After initialization, two pipeline files will be generated:

- `run_dataflow/pipelines/api_pipelines/text2sql_pipeline_gen.py`
- `run_dataflow/pipelines/api_pipelines/text2sql_pipeline_refine.py`

### Step 4: Configure API Keys and Endpoints

**Linux and macOS:**

```shell
export DF_API_KEY="sk-xxxxx"
```

**Windows:**

```powershell
$env:DF_API_KEY = "sk-xxxxx"
```

Configure the API endpoints in `text2sql_pipeline_gen.py` and `text2sql_pipeline_refine.py`:

```python
self.llm_serving = APILLMServing_request(
    api_url="https://api.openai.com/v1/chat/completions",
    model_name="gpt-4o",
    max_workers=100
)

cot_generation_api_llm_serving = APILLMServing_request(
    api_url="https://api.openai.com/v1/chat/completions",
    model_name="gpt-4o", # Optionally use a more powerful model for generating chain-of-thought
    max_workers=100
)

embedding_serving = APILLMServing_request(
    api_url="https://api.openai.com/v1/embeddings",
    model_name="text-embedding-ada-002",
    max_workers=100
)
```

Service Purpose Description:

- `llm_serving`: Handles general tasks
- `cot_generation_api_llm_serving`: Generates complex reasoning chains (Chain-of-Thought)
- `embedding_serving`: Generates text embedding vectors

### Step 5: Configure Database

#### Using Example Databases

The pipeline supports automatic download of example databases. When the `db_root_path` parameter is an empty string, the system will automatically download example database files from Hugging Face.

First, configure `HF_TOKEN` (can be obtained from the Hugging Face website):

**Linux and macOS:**

```shell
export HF_TOKEN="hf_xxxxx"
```

**Windows:**

```powershell
$env:HF_TOKEN = "hf_xxxxx"
```

After configuration, keep the `db_root_path` parameter as an empty string.

#### Using Custom Databases

To use custom databases, set the `db_root_path` parameter to the database folder path. Currently supports SQLite and MySQL databases.

##### SQLite Database Configuration

SQLite is a file-based database system. When using it, you need to specify the path where the database files are stored.

- **Database Root Directory**: The directory containing all database files
  - This directory should contain multiple database files in `.sqlite` or `.db` format
  - The filename of each database file is the `db_id`, in the format `db_id.sqlite` or `db_id.db`
  - The database manager supports directory structures with arbitrary nesting levels

**Directory Structure Example:**
```
databases/
  ├── california_schools.sqlite
  └── hospitals.sqlite
```

**Configuration Example:**
```python
# Automatically download example database
db_root_path = ""
model = Text2SQLGeneration_APIPipeline(db_root_path=db_root_path)

# Or manually specify a local database path
db_root_path = "/path/to/your/database"
model = Text2SQLGeneration_APIPipeline(db_root_path=db_root_path)

# Database Manager Configuration
database_manager = DatabaseManager(
    db_type="sqlite",
    config={
        "root_path": self.db_root_path
    }
)
```

> **Note**: `db_type` must be set to `"sqlite"`, and `root_path` is the path to the database folder.

##### MySQL Database Configuration

MySQL databases exist as servers and require connection information configuration.

**Configuration Example:**
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

> **Note**: Ensure the MySQL service is running and you have access permissions to the respective databases.

### Step 6: Configure SQL Source Files

Choose different pipelines based on your needs:

#### 6.1 Data Refinement Pipeline

Input data must contain the following fields:

- **db_id**: Database file name (Database ID)
- **question**: Natural language question
- **SQL**: Standard SQL answer

**Data Format Example (JSON):**
```json
{
  "db_id": "california_schools",
  "question": "What is the highest eligible free rate for K-12 students in the schools in Alameda County?",
  "SQL": "SELECT `Free Meal Count (K-12)` / `Enrollment (K-12)` FROM frpm WHERE `County Name` = 'Alameda' ORDER BY (CAST(`Free Meal Count (K-12)` AS REAL) / `Enrollment (K-12)`) DESC LIMIT 1"
}
```

**Storage Configuration:**
```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/Text2SQLPipeline/pipeline_refine.jsonl",
    cache_path="./cache_local",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl"
)
```

#### 6.2 Data Synthesis Pipeline

This mode does not require existing data and synthesizes data directly from the database. After configuring the database, set `first_entry_file_name` to an empty string:

```python
self.storage = FileStorage(
    first_entry_file_name="",
    cache_path="./cache",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl"
)
```

### Step 7: Run the Pipeline

```bash
python pipelines/api_pipelines/text2sql_pipeline_gen.py
```

or

```bash
python pipelines/api_pipelines/text2sql_pipeline_refine.py
```

You can choose to run any Pipeline based on your needs; the running method is similar. Subsequent sections will introduce the operators used in the Pipeline and how to configure their parameters.

## 3. Dataflow and Pipeline Logic

### 3.1 Data Filters

#### 3.1.1 **SQL Execution Filter (SQLExecutionFilter)**

The **SQL Execution Filter** (`SQLExecutionFilter`) verifies the correctness of SQL statements by actually executing them, filtering out SQL statements that cannot be executed normally.

**Functionality:**

* Verifies the executability of SQL statements
* Filters out SQL statements with syntax errors or execution failures

**Input**: SQL statement and database ID
**Output**: Executable SQL statements

```python
sql_execution_filter = SQLExecutionFilter(
    database_manager=database_manager
)
```

#### 3.1.2 **SQL Consistency Filter (SQLConsistencyFilter)**

The **SQL Consistency Filter** (`SQLConsistencyFilter`) checks the consistency between the SQL statement, the question, and the database schema, ensuring that the generated SQL correctly answers the corresponding question.

**Functionality:**

* Verifies consistency between the SQL statement, the question, and the database schema
* Filters out SQL statements that do not match the question or database schema

**Input**: SQL statement, database ID, and question
**Output**: SQL statements consistent with the question

```python
sql_consistency_filter = SQLConsistencyFilter(
    llm_serving=llm_serving,
    database_manager=database_manager,
    prompt_template=SQLConsistencyFilterPrompt()
)
```

### 3.2 Data Generators

#### 3.2.1 **SQL Generator (SQLGenerator)**

The **SQL Generator** (`SQLGenerator`) is responsible for generating SQL query statements based on the database schema, providing raw SQL data for subsequent data processing flows.

**Functionality:**

* Automatically generates SQL query statements based on the database schema
* Supports batch generation of a specified number of SQL statements

**Input**: Database schema information
**Output**: Generated SQL statements and corresponding database IDs

```python
sql_generator = SQLGenerator(
    llm_serving=llm_serving,
    database_manager=database_manager,
    generate_num=50,
    prompt_template=SelectSQLGeneratorPrompt()
)
```

#### 3.2.2 **SQL Variant Generator (SQLVariationGenerator)**

The **SQL Variant Generator** (`SQLVariationGenerator`) generates multiple functionally equivalent variants based on existing SQL statements, enriching the diversity of the dataset.

**Functionality:**

* Generates functionally equivalent SQL variants
* Increases the diversity and complexity of SQL statements

**Input**: Original SQL statement and database ID
**Output**: Collection of SQL variants

```python
sql_variation_generator = SQLVariationGenerator(
    llm_serving=llm_serving,
    database_manager=database_manager,
    num_variations=5,
    prompt_template=SQLVariationGeneratorPrompt()
)
```

#### 3.2.3 **Question Generator (Text2SQLQuestionGenerator)**

The **Question Generator** (`Text2SQLQuestionGenerator`) generates corresponding natural language questions based on given SQL statements, constructing Text-to-SQL question-answer pairs.

**Functionality:**

* Generates natural language questions based on SQL statements
* Supports generating multiple candidate questions

**Input**: SQL statement and database ID
**Output**: Natural language question

```python
text2sql_question_generator = Text2SQLQuestionGenerator(
    llm_serving=llm_serving,
    embedding_serving=embedding_serving,
    database_manager=database_manager,
    question_candidates_num=5,
    prompt_template=Text2SQLQuestionGeneratorPrompt()
)
```

#### 3.2.4 **Prompt Generator (Text2SQLPromptGenerator)**

The **Prompt Generator** (`Text2SQLPromptGenerator`) generates prompt templates for model training based on the question and database schema.

**Functionality:**

* Generates structured prompt templates
* Integrates question and database schema information

**Input**: Question and database ID
**Output**: Formatted prompt template

```python
text2sql_prompt_generator = Text2SQLPromptGenerator(
    database_manager=database_manager,
    prompt_template=Text2SQLPromptGeneratorPrompt()
)
```

#### 3.2.5 **Chain-of-Thought Generator (Text2SQLCoTGenerator)**

The **Chain-of-Thought Generator** (`Text2SQLCoTGenerator`) generates detailed reasoning processes for SQL queries, helping the model understand the conversion logic from question to SQL.

**Functionality:**

* Generates reasoning processes for SQL queries
* Supports retry mechanism to ensure generation quality

**Input**: SQL statement, question, and database ID
**Output**: Chain-of-thought reasoning process

```python
sql_cot_generator = Text2SQLCoTGenerator(
    llm_serving=cot_generation_api_llm_serving,
    database_manager=database_manager,
    max_retries=3,
    enable_retry=True,
    prompt_template=Text2SQLCotGeneratorPrompt()
)
```

### 3.3 Data Evaluators

#### 3.3.1 **Component Difficulty Evaluator (SQLComponentClassifier)**

The **Component Difficulty Evaluator** (`SQLComponentClassifier`) analyzes the component complexity of SQL statements and labels the difficulty level for data samples.

**Functionality:**

* Analyzes the component complexity of SQL statements
* Labels difficulty levels for samples

**Input**: SQL statement
**Output**: SQL component difficulty level

```python
sql_component_classifier = SQLComponentClassifier(
    difficulty_thresholds=[2, 4, 6],
    difficulty_labels=['easy', 'medium', 'hard', 'extra']
)
```

#### 3.3.2 **Execution Difficulty Evaluator (SQLExecutionClassifier)**

The **Execution Difficulty Evaluator** (`SQLExecutionClassifier`) evaluates the execution difficulty of SQL queries, making comprehensive judgments based on multiple generation results.

**Functionality:**

* Evaluates the execution difficulty of SQL queries
* Performs difficulty assessment based on multiple generations

**Input**: SQL statement, database ID, and prompt
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

### 3.4 Prompt Template System

Each component in the pipeline uses specialized prompt template classes to ensure generation quality and consistency:

- `SelectSQLGeneratorPrompt()` - SQL generation prompts
- `SQLVariationGeneratorPrompt()` - SQL variant generation prompts
- `Text2SQLQuestionGeneratorPrompt()` - Question generation prompts
- `Text2SQLPromptGeneratorPrompt()` - Training prompt generation
- `Text2SQLCotGeneratorPrompt()` - CoT reasoning generation prompts
- `SQLConsistencyFilterPrompt()` - Consistency filtering prompts

## 4. **Output Data**

- **Format**: `jsonl` (Each step generates a file)
- **Field Description**:
  - `db_id`: Database ID
  - `question`: Natural language question
  - `SQL`: Standard SQL answer
  - `prompt`: Prompt for training, includes natural language question, database schema, and prompt information
  - `cot_reasoning`: Chain-of-thought reasoning data, includes reasoning process and final answer, used for model training
  - `sql_component_difficulty`: SQL component complexity assessment
  - `sql_execution_difficulty`: SQL execution complexity assessment
- **Example**:
  ```json
  {
      "db_id":"california_schools",
      "SQL":"SELECT AVG(s.AvgScrRead) AS average_reading_score\nFROM satscores s\nINNER JOIN frpm f ON s.cds = f.CDSCode\nINNER JOIN schools sc ON f.CDSCode = sc.CDSCode\nWHERE s.cname = 'Alameda'\n  AND f.\"Charter School (Y\/N)\" = 1\n  AND f.\"Charter Funding Type\" = 'Directly funded'\n  AND sc.County = 'Alameda';",
      "question":"What is the average reading score for directly funded charter schools in Alameda County?",
      "prompt":"Task Overview: /* Given the following database schema: ... /* Answer the following: What is the average reading score for directly funded charter schools in Alameda County? * Let's think step by step",
      "cot_reasoning":"To translate the natural language question into an executable SQLite query, we will follow these steps. ... we can construct the full SQLite query based on these steps:\n\n```sql\nSELECT AVG(s.AvgScrRead) AS average_reading_score\nFROM satscores s\nINNER JOIN frpm f ON s.cds = f.CDSCode\nINNER JOIN schools sc ON f.CDSCode = sc.CDSCode\nWHERE s.cname = 'Alameda'\n  AND f.\"Charter School (Y\/N)\" = 1\n  AND f.\"Charter Funding Type\" = 'Directly funded'\n  AND sc.County = 'Alameda';\n```\n\nThis query follows the logic outlined above and ensures alignment with the reference solution.",
      "sql_component_difficulty":"medium",
      "sql_execution_difficulty":"medium"
  }
  ```

## 5. Execution Method

Two pipelines have been designed here, allowing different configurations to be executed via simple Python commands to meet various data requirements:

* **Data Synthesis Pipeline**:

  ```bash
  python /path/to/text2sql_generation_pipeline.py
  ```

* **Data Optimization Pipeline**:

  ```bash
  python /path/to/text2sql_refine_pipeline.py
  ```

## 6. Pipeline Example

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