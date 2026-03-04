---
title: Text-to-SQL Data Synthesis Pipeline
icon: material-symbols-light:checkbook-outline-rounded
createTime: 2025/06/17 02:00:31
permalink: /en/guide/text2sqlpipeline/
---

# Text-to-SQL Data Synthesis Pipeline

## 1. Overview

The core objective of the **Text-to-SQL Data Synthesis Pipeline** is to generate high-quality QA data containing training prompts and chain-of-thought for each sample by cleaning and augmenting existing Text-to-SQL data. This pipeline supports one-click processing from raw data to final training data, currently offering the following two data generation modes:

### Supported Application Scenarios

- **Data Refinement Mode**
  - Filters, expands, and enhances existing data to generate high-quality training data
  - Input requirements: Database files, SQL data samples (each containing a database ID and SQL query)

- **Data Synthesis Mode**
  - Directly generates training data based on databases
  - Input requirements: Database files, no existing SQL data samples required

### Processing Pipeline

1. **Data Filtering**
   - Execution Filtering: Executes SQL statements to eliminate invalid and non-executable SQL
   - Executability Filtering: Uses the database to generate query plans (EXPLAIN) for SQL, filtering out non-executable statements without executing them, saving time while achieving filtering
   - Consistency Filtering: Ensures consistency among the natural language question, SQL, and database schema

2. **Data Generation**
   - SQL Variation Generation: Generates semantically richer variations based on existing SQL
   - SQL Synthesis: Generates new SQL statements from scratch based on the database schema
   - Question Generation: Generates corresponding natural language descriptions based on SQL and schema

3. **Training Data Construction**
   - Prompt Generation: Integrates natural language questions, database schema, and instruction prompts
   - Chain-of-Thought Generation: Constructs a step-by-step reasoning process (Chain-of-Thought), generating multiple reasoning candidate processes
   - Reasoning Candidate Voting: Selects the best reasoning process from multiple candidates

4. **Data Difficulty Grading**
   - Syntax Difficulty Grading: Grades based on the complexity of the SQL statement
   - Execution Difficulty Grading: Assesses difficulty based on SQL execution pass rates

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

- `run_dataflow/api_pipelines/text2sql_pipeline_gen.py`
- `run_dataflow/api_pipelines/text2sql_pipeline_refine.py`

### Step 4: Configure API Keys and Endpoints

**Linux and macOS:**

```shell
export DF_API_KEY="sk-xxxxx"
```

**Windows:**

```powershell
$env:DF_API_KEY = "sk-xxxxx"
```

Configure the API endpoints in `text2sql_pipeline_gen.py` and `text2sql_pipeline_refine.py`. Here, `llm_serving` is the base model for constructing data, and `embedding_serving` is used when generating natural language queries to create multiple queries, vectorize them, and select the best one.

```python
self.llm_serving = APILLMServing_request(
    api_url="https://api.openai.com/v1/chat/completions",
    model_name="gpt-4o",
    max_workers=100
)

self.embedding_serving = APILLMServing_request(
    api_url="https://api.openai.com/v1/embeddings",
    model_name="text-embedding-ada-002",
    max_workers=100
)
```

### Step 5: Configure Database

#### Using Example Databases

The pipeline supports automatic downloading of example databases. When the `db_root_path` parameter is an empty string, the system will automatically download example database files from Hugging Face.

First, configure `HF_TOKEN` (can be obtained from the Hugging Face website):

**Linux and macOS:**

```shell
export HF_TOKEN="hf_xxxxx"
```

**Windows:**

```powershell
$env:HF_TOKEN = "hf_xxxxx"
```

After configuration, simply keep the `db_root_path` parameter as an empty string.

#### Using Custom Databases

To use custom databases, set the `db_root_path` parameter to the path of your database folder. Currently supports SQLite and MySQL databases.

##### SQLite Database Configuration

SQLite is a file-based database system. When using it, you need to specify the storage path for the database files.

- **Database Root Directory**: Directory containing all database files
  - This directory should contain multiple database files in `.sqlite` or `.db` format
  - The filename of each database file is the `db_id`, formatted as `db_id.sqlite` or `db_id.db`
  - The database manager supports nested directory structures of any depth

**Directory Structure Example:**
```
databases/
  ├── california_schools.sqlite
  └── hospitals.sqlite
```

**Configuration Example:**
```python
# Automatically download example databases
db_root_path = ""
model = Text2SQLGeneration_APIPipeline(db_root_path=db_root_path)

# Or manually specify local database path
db_root_path = "/path/to/your/database"
model = Text2SQLGeneration_APIPipeline(db_root_path=db_root_path)

# Database manager configuration
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

> **Note**: Ensure the MySQL service is running and you have access permissions to the relevant database.

### Step 6: Configure SQL Source File

Choose different pipelines based on your needs:

#### 6.1 Data Refinement Pipeline

Input data must contain at least the following fields; other fields can be retained and will not be affected:

- **db_id**: Database file name (Database ID)
- **SQL**: Standard SQL answer

**Data Format Example (JSON):**
```json
{
  "db_id": "california_schools",
  "SQL": "SELECT `Free Meal Count (K-12)` / `Enrollment (K-12)` FROM frpm WHERE `County Name` = 'Alameda' ORDER BY (CAST(`Free Meal Count (K-12)` AS REAL) / `Enrollment (K-12)`) DESC LIMIT 1"
}
```

**Storage Configuration:**
```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/Text2SQLPipeline/pipeline_refine.jsonl", # This can also be replaced with your SQL dataset file path
    cache_path="./cache",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl"
)
```

#### 6.2 Data Synthesis Pipeline

This mode does not require existing data; it synthesizes data directly from databases. After configuring the database, set `first_entry_file_name` to an empty string:

```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/Text2SQLPipeline/empty.jsonl", # The data synthesis pipeline does not require original datasets. However, since DataFlow requires file input, an empty jsonl file is introduced as input
    cache_path="./cache",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl"
)
```

### Step 7: Run the Pipeline

```bash
python api_pipelines/text2sql_pipeline_gen.py
```

or

```bash
python api_pipelines/text2sql_pipeline_refine.py
```

You can choose to run any pipeline based on your needs; the run methods are similar. The following sections will introduce the operators used in the pipeline and parameter configuration methods.

## 3. Data Flow and Pipeline Logic

### 3.1 Data Filters

#### 3.1.1 **SQL Execution Filter (SQLExecutionFilter)**

The **SQL Execution Filter** (`SQLExecutionFilter`) validates SQL statement correctness by actually executing them, filtering out SQL statements that cannot be executed normally.

**Functionality:**

* Validates SQL statement executability
* Filters out SQL statements with syntax errors or execution failures

**Input**: SQL statement and database ID  
**Output**: Normally executable SQL statements; non-executable ones are deleted

```python
sql_execution_filter = SQLExecutionFilter(
    database_manager=database_manager
)
```

#### 3.1.2 **SQL Consistency Filter (Text2SQLCorrespondenceFilter)**

The **SQL Consistency Filter** (`Text2SQLCorrespondenceFilter`) checks consistency between the SQL statement, the question, and the database schema, ensuring the generated SQL correctly answers the corresponding question.

**Functionality:**

* Validates consistency between the SQL statement, the natural language question, and the database schema
* Filters out SQL statements that do not match the natural language question or database schema

**Input**: SQL statement, database ID, natural language question, and evidence  
**Output**: SQL statements consistent with the natural language question and database schema; inconsistent ones are filtered and deleted

```python
text2sql_correspondence_filter = Text2SQLCorrespondenceFilter(
    llm_serving=llm_serving,
    database_manager=database_manager,
    prompt_template=Text2SQLCorrespondenceFilterPrompt()
)
```

#### 3.1.3 **SQL Executability Filter (SQLExecutabilityFilter)**

The **SQL Executability Filter** (`SQLExecutabilityFilter`) uses the database to generate query plans (EXPLAIN) for SQL, filtering out non-executable statements without executing them, saving time while achieving filtering. In the database, being able to generate a query plan indicates executability, so this method can filter out non-executable SQL statements.

**Functionality:**
* Uses the database to generate query plans for SQL, filtering out non-executable SQL statements
* Does not execute SQL, saving time while achieving filtering

**Input**: SQL statement and database ID  
**Output**: Executable SQL statements; non-executable ones are deleted

```python
sql_executability_filter = SQLExecutabilityFilter(
    database_manager=database_manager
)
```

### 3.2 Data Generators

#### 3.2.1 **SQL Generator (SQLGenerator)**

The **SQL Generator** (`SQLGenerator`) is responsible for generating SQL query statements based on the database schema, providing raw SQL data for subsequent data processing workflows.

**Functionality:**

* Automatically generates SQL query statements based on the database schema
* Supports batch generation of a specified number of SQL statements

**Input**: Database schema information  
**Output**: Generated SQL statements, corresponding database ID, and SQL complexity label (`sql_complexity_type`)

```python
sql_generator = SQLGenerator(
    llm_serving=llm_serving,
    database_manager=database_manager,
    generate_num=50,
    prompt_template=SelectSQLGeneratorPrompt()
)
```

#### 3.2.2 **SQL Variation Generator (SQLVariationGenerator)**

The **SQL Variation Generator** (`SQLVariationGenerator`) generates multiple functionally equivalent variants based on existing SQL statements, enriching dataset diversity.

**Functionality:**

* Generates functionally equivalent SQL variations
* Increases the diversity and complexity of SQL statements

**Input**: Original SQL statement and database ID
**Output**: Set of SQL variations

```python
sql_variation_generator = SQLVariationGenerator(
    llm_serving=llm_serving,
    database_manager=database_manager,
    num_variations=5,
    prompt_template=SQLVariationGeneratorPrompt()
)
```

#### 3.2.3 **Question Generator (Text2SQLQuestionGenerator)**

The **Question Generator** (`Text2SQLQuestionGenerator`) generates corresponding natural language questions based on given SQL statements, constructing Text-to-SQL QA pairs.

**Functionality:**

* Generates natural language questions based on SQL statements
* Supports generating multiple candidate questions

**Input**: SQL statement and database ID  
**Output**: Natural language question and evidence (`question` / `evidence`), along with a question type field `question_type`

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

The **Prompt Generator** (`Text2SQLPromptGenerator`) generates prompt templates for model training based on questions and database schema.

**Functionality:**

* Generates structured prompt templates
* Integrates question and database schema information

**Input**: Question, evidence, and database ID  
**Output**: Formatted prompt template

```python
text2sql_prompt_generator = Text2SQLPromptGenerator(
    database_manager=database_manager,
    prompt_template=Text2SQLPromptGeneratorPrompt()
)
```

#### 3.2.5 **Chain-of-Thought Generator (Text2SQLCoTGenerator)**

The **Chain-of-Thought Generator** (`Text2SQLCoTGenerator`) generates multiple detailed reasoning processes for SQL queries, helping the model understand the translation logic from questions to SQL.

**Functionality:**

* Generates reasoning processes for SQL queries
* To ensure quality, generates multiple reasoning process candidates (without validation)

**Input**: SQL statement, question, evidence, and database ID  
**Output**: Multiple reasoning process candidates (`cot_responses`), to be used for subsequent voting to select the best reasoning process

```python
sql_cot_generator = Text2SQLCoTGenerator(
    llm_serving=llm_serving,
    database_manager=database_manager,
    sampling_num=3,
    prompt_template=Text2SQLCotGeneratorPrompt()
)
```

#### 3.2.6 **Reasoning Process Voter (Text2SQLCoTVotingGenerator)**

The **Reasoning Process Voter** (`Text2SQLCoTVotingGenerator`) performs execution consistency voting on multiple reasoning process candidates to select the best reasoning process.

**Functionality:**

* Performs execution consistency voting on multiple reasoning process candidates
* Selects and outputs the best reasoning process

**Input**: `cot_responses` and database ID  
**Output**: Final reasoning process `cot_reasoning`

```python
sql_cot_voter = Text2SQLCoTVotingGenerator(
    database_manager=database_manager
)
```

### 3.3 Data Evaluators

#### 3.3.1 **Component Difficulty Evaluator (SQLComponentClassifier)**

The **Component Difficulty Evaluator** (`SQLComponentClassifier`) analyzes the component complexity of SQL statements and annotates difficulty levels for data samples.

**Functionality:**

* Analyzes the component complexity of SQL statements
* Annotates difficulty levels for samples

**Input**: SQL statement
**Output**: SQL component difficulty level

```python
sql_component_classifier = SQLComponentClassifier(
    difficulty_thresholds=[2, 4, 6],
    difficulty_labels=['easy', 'medium', 'hard', 'extra']
)
```

#### 3.3.2 **Execution Difficulty Evaluator (SQLExecutionClassifier)**

The **Execution Difficulty Evaluator** (`SQLExecutionClassifier`) evaluates the execution difficulty of SQL queries based on comprehensive judgment from multiple generation results.

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

Each component in the pipeline uses a dedicated prompt template class to ensure generation quality and consistency:

- `SelectSQLGeneratorPrompt()` - SQL generation prompts
- `SQLVariationGeneratorPrompt()` - SQL variation generation prompts
- `Text2SQLQuestionGeneratorPrompt()` - Question generation prompts
- `Text2SQLPromptGeneratorPrompt()` - Training prompt generation
- `Text2SQLCotGeneratorPrompt()` - CoT reasoning generation prompts
- `Text2SQLCorrespondenceFilterPrompt()` - Consistency filtering prompts

## 4. **Output Data**

- **Format**: `jsonl` (A file is generated for each step)
- **Field Descriptions**:
  - `db_id`: Database ID
  - `question`: Natural language question
  - `question_type`: Natural language question type
  - `evidence`: Evidence/external knowledge accompanying question generation
  - `SQL`: Standard SQL answer
  - `sql_variation_type`: SQL variation type (only exists in data generated by the SQL refinement pipeline)
  - `sql_complexity_type`: SQL complexity type (only exists in data generated by the SQL synthesis pipeline)
  - `prompt`: Prompt used for training, containing natural language question, database schema, and prompt information
  - `cot_reasoning`: Chain-of-thought data, containing reasoning process and final answer, used for model training
  - `sql_component_difficulty`: SQL component difficulty evaluation
  - `sql_execution_difficulty`: SQL execution difficulty evaluation
- **Example**:
  ```json
  {
      "db_id":"california_schools",
      "SQL":"SELECT AVG(s.AvgScrRead) AS average_reading_score\nFROM satscores s\nINNER JOIN frpm f ON s.cds = f.CDSCode\nINNER JOIN schools sc ON f.CDSCode = sc.CDSCode\nWHERE s.cname = 'Alameda'\n  AND f.\"Charter School (Y\/N)\" = 1\n  AND f.\"Charter Funding Type\" = 'Directly funded'\n  AND sc.County = 'Alameda';",
      "question":"What is the average reading score for directly funded charter schools in Alameda County?",
      "evidence":"This question focuses on directly funded charter schools in Alameda County.",
      "prompt":"Task Overview: /* Given the following database schema: ... /* Answer the following: What is the average reading score for directly funded charter schools in Alameda County? * Let's think step by step",
      "cot_reasoning":"To translate the natural language question into an executable SQLite query, we will follow these steps. ... we can construct the full SQLite query based on these steps:\n\n```sql\nSELECT AVG(s.AvgScrRead) AS average_reading_score\nFROM satscores s\nINNER JOIN frpm f ON s.cds = f.CDSCode\nINNER JOIN schools sc ON f.CDSCode = sc.CDSCode\nWHERE s.cname = 'Alameda'\n  AND f.\"Charter School (Y\/N)\" = 1\n  AND f.\"Charter Funding Type\" = 'Directly funded'\n  AND sc.County = 'Alameda';\n```\n\nThis query follows the logic outlined above and ensures alignment with the reference solution.",
      "sql_component_difficulty":"medium",
      "sql_execution_difficulty":"medium"
  }
  ```

## 5. Running Methods

Two pipelines are designed here, executed via simple Python commands with different configurations to meet various data needs:

* **Data Synthesis Pipeline**:

  ```bash
  python api_pipelines/text2sql_pipeline_gen.py
  ```

* **Data Refinement Pipeline**:

  ```bash
  python api_pipelines/text2sql_pipeline_refine.py
  ```

## 6. Pipeline Examples

The following provides example pipelines demonstrating how to use multiple operators for reasoning data processing. These examples show how to initialize a reasoning data processing pipeline and sequentially execute various filtering and cleaning steps.

* **Data Synthesis Pipeline**:

```python
class Text2SQLGeneration_APIPipeline():
    def __init__(self, db_root_path=""):
        self.logger = get_logger()
        self.db_root_path = db_root_path

        if not db_root_path:
            try:
                self.db_root_path = download_and_extract_database(self.logger)
                self.logger.info(f"Using automatically downloaded database at: {self.db_root_path}")
            except Exception as e:
                self.logger.error(f"Failed to auto-download database: {e}")
                raise
        else:
            self.logger.info(f"Using manually specified database path: {self.db_root_path}")

        if not os.path.exists(self.db_root_path):
            raise FileNotFoundError(f"Database path does not exist: {self.db_root_path}")

        self.storage = FileStorage(
            first_entry_file_name="../example_data/Text2SQLPipeline/empty.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )

        self.llm_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/chat/completions",
            model_name="gpt-4o",
            max_workers=100
        )

        self.embedding_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/embeddings",
            model_name="text-embedding-ada-002",
            max_workers=100
        )

        # SQLite and MySQL are currently supported
        # db_type can be sqlite or mysql, which must match your database type
        # If sqlite is selected, root_path must be provided, this path must exist and contain database files
        # If mysql is selected, host, user, password must be provided, these credentials must be correct and have access permissions
        # MySQL example:
        # database_manager = DatabaseManager(
        #     db_type="mysql",
        #     config={
        #         "host": "localhost",
        #         "user": "root",
        #         "password": "your_password",
        #         "database": "your_database_name"
        #     }
        # )
        # SQLite example:
        database_manager = DatabaseManager(
            db_type="sqlite",
            config={
                "root_path": self.db_root_path
            }
        )

        self.sql_generator_step1 = SQLGenerator(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            generate_num=2,
            prompt_template=SelectSQLGeneratorPrompt()
        )

        self.sql_executability_filter_step2 = SQLExecutabilityFilter(
            database_manager=database_manager
        )

        self.text2sql_question_generator_step3 = Text2SQLQuestionGenerator(
            llm_serving=self.llm_serving,
            embedding_serving=self.embedding_serving,
            database_manager=database_manager,
            question_candidates_num=3,
            prompt_template=Text2SQLQuestionGeneratorPrompt()
        )

        self.text2sql_correspondence_filter_step4 = Text2SQLCorrespondenceFilter(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            prompt_template=Text2SQLCorrespondenceFilterPrompt()
        )

        self.text2sql_prompt_generator_step5 = Text2SQLPromptGenerator(
            database_manager=database_manager,
            prompt_template=Text2SQLPromptGeneratorPrompt()
        )

        self.sql_cot_generator_step6 = Text2SQLCoTGenerator(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            prompt_template=Text2SQLCotGeneratorPrompt()
        )

        self.sql_cot_voting_generator_step7 = Text2SQLCoTVotingGenerator(
            database_manager=database_manager
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
        evidence_key = "evidence"

        self.sql_generator_step1.run(
            storage=self.storage.step(),
            output_sql_key=sql_key,
            output_db_id_key=db_id_key,
            output_sql_complexity_key="sql_complexity_type"
        )

        self.sql_executability_filter_step2.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key
        )

        self.text2sql_question_generator_step3.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            output_question_key=question_key,
            output_evidence_key=evidence_key
        )

        self.text2sql_correspondence_filter_step4.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            input_question_key=question_key,
            input_evidence_key=evidence_key
        )

        self.text2sql_prompt_generator_step5.run(
            storage=self.storage.step(),
            input_question_key=question_key,
            input_db_id_key=db_id_key,
            input_evidence_key=evidence_key,
            output_prompt_key="prompt"
        )

        self.sql_cot_generator_step6.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_question_key=question_key,
            input_db_id_key=db_id_key,
            input_evidence_key=evidence_key,
            output_cot_key="cot_reasoning"
        )

        self.sql_cot_voting_generator_step7.run(
            storage=self.storage.step(),
            input_cot_responses_key="cot_responses",
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
    # If you have your own database files, you can set the db_root_path to the path of your database files
    # If not, please set the db_root_path "", and we will download the example database files automatically
    db_root_path = ""

    model = Text2SQLGeneration_APIPipeline(db_root_path=db_root_path)
    model.forward()
```

* **Data Refinement Pipeline**:
```python
class Text2SQLRefine_APIPipeline():
    def __init__(self, db_root_path=""):
        self.logger = get_logger()
        self.db_root_path = db_root_path

        if not db_root_path:
            try:
                self.db_root_path = download_and_extract_database(self.logger)
                self.logger.info(f"Using automatically downloaded database at: {self.db_root_path}")
            except Exception as e:
                self.logger.error(f"Failed to auto-download database: {e}")
                raise
        else:
            self.logger.info(f"Using manually specified database path: {self.db_root_path}")

        if not os.path.exists(self.db_root_path):
            raise FileNotFoundError(f"Database path does not exist: {self.db_root_path}")

        self.storage = FileStorage(
            first_entry_file_name="../example_data/Text2SQLPipeline/pipeline_refine.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl"
        )

        self.llm_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/chat/completions",
            model_name="gpt-4o",
            max_workers=100
        )

        self.embedding_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/embeddings",
            model_name="text-embedding-ada-002",
            max_workers=100
        )

        # SQLite and MySQL are currently supported
        # db_type can be sqlite or mysql, which must match your database type
        # If sqlite is selected, root_path must be provided, this path must exist and contain database files
        # If mysql is selected, host, user, password must be provided, these credentials must be correct and have access permissions
        # MySQL example:
        # database_manager = DatabaseManager(
        #     db_type="mysql",
        #     config={
        #         "host": "localhost",
        #         "user": "root",
        #         "password": "your_password",
        #         "database": "your_database_name"
        #     }
        # )
        # SQLite example:
        database_manager = DatabaseManager(
            db_type="sqlite",
            config={
                "root_path": self.db_root_path
            }
        )

        self.sql_executability_filter_step1 = SQLExecutabilityFilter(
            database_manager=database_manager
        )

        self.sql_variation_generator_step2 = SQLVariationGenerator(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            num_variations=3, # Number of variations to generate for each SQL
            prompt_template=SQLVariationGeneratorPrompt()
        )

        self.sql_executability_filter_step3 = SQLExecutabilityFilter(
            database_manager=database_manager
        )

        self.text2sql_question_generator_step4 = Text2SQLQuestionGenerator(
            llm_serving=self.llm_serving,
            embedding_serving=self.embedding_serving,
            database_manager=database_manager,
            question_candidates_num=3,
            prompt_template=Text2SQLQuestionGeneratorPrompt()
        )

        self.text2sql_correspondence_filter_step5 = Text2SQLCorrespondenceFilter(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            prompt_template=Text2SQLCorrespondenceFilterPrompt()
        )

        self.text2sql_prompt_generator_step6 = Text2SQLPromptGenerator(
            database_manager=database_manager,
            prompt_template=Text2SQLPromptGeneratorPrompt()
        )

        self.sql_cot_generator_step7 = Text2SQLCoTGenerator(
            llm_serving=self.llm_serving,
            database_manager=database_manager,
            prompt_template=Text2SQLCotGeneratorPrompt()
        )

        self.sql_cot_voting_generator_step8 = Text2SQLCoTVotingGenerator(
            database_manager=database_manager
        )

        self.sql_component_classifier_step9 = SQLComponentClassifier(
            difficulty_thresholds=[2, 4, 6],
            difficulty_labels=['easy', 'medium', 'hard', 'extra']
        )

        self.sql_execution_classifier_step10 = SQLExecutionClassifier(
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
        evidence_key = "evidence"

        self.sql_executability_filter_step1.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key
        )

        self.sql_variation_generator_step2.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            output_sql_variation_type_key="sql_variation_type"
        )

        self.sql_executability_filter_step3.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key
        )

        self.text2sql_question_generator_step4.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            output_question_key=question_key,
            output_evidence_key=evidence_key
        )

        self.text2sql_correspondence_filter_step5.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            input_question_key=question_key,
            input_evidence_key=evidence_key
        )

        self.text2sql_prompt_generator_step6.run(
            storage=self.storage.step(),
            input_question_key=question_key,
            input_db_id_key=db_id_key,
            input_evidence_key=evidence_key,
            output_prompt_key="prompt"
        )

        self.sql_cot_generator_step7.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_question_key=question_key,
            input_db_id_key=db_id_key,
            input_evidence_key=evidence_key,
            output_cot_key="cot_reasoning"
        )

        self.sql_cot_voting_generator_step8.run(
            storage=self.storage.step(),
            input_cot_responses_key="cot_responses",
            input_db_id_key=db_id_key,
            output_cot_key="cot_reasoning"
        )

        self.sql_component_classifier_step9.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            output_difficulty_key="sql_component_difficulty"
        )

        self.sql_execution_classifier_step10.run(
            storage=self.storage.step(),
            input_sql_key=sql_key,
            input_db_id_key=db_id_key,
            input_prompt_key="prompt",
            output_difficulty_key="sql_execution_difficulty"
        )

if __name__ == "__main__":
    # If you have your own database files, you can set the db_root_path to the path of your database files
    # If not, please set the db_root_path "", and we will download the example database files automatically
    db_root_path = ""

    model = Text2SQLRefine_APIPipeline(db_root_path=db_root_path)
    model.forward()
```