---
title: Text2SQL Operators
createTime: 2025/06/24 11:43:42
permalink: /en/guide/Text2SQL_operators/
---

# Text2SQL Operators

## Overview

Text-to-SQL operators are a specialized collection of operators designed for data processing and quality enhancement in Text-to-SQL tasks, aiming to:
- Clean and augment existing Text-to-SQL datasets.
- Generate high-quality question-answer pairs containing training prompts and chain-of-thought reasoning for each sample.
- Provide multi-dimensional data quality assessment and difficulty grading.

The variety of open-source operators is quite limited. To achieve better data processing quality and fill the gaps in open-source data synthesis and processing methods, we have meticulously designed and **independently developed** a new set of operators. Their marker meanings are as follows:

- 🚀 **Independent Innovation**: Core algorithms are originally developed, filling gaps in existing algorithms or further improving performance, breaking through current bottlenecks.
- ✨ **Open-Source Debut**: This operator is integrated into the mainstream community framework for the first time, facilitating use by more developers and enabling open-source sharing.

## Data Generation Operators

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Applicable Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Official Repository or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">SQLGenerator</td>
      <td class="tg-0pky">Data Generation</td>
      <td class="tg-0pky">Generates diverse SQL statements based on database schema.</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2503.02240">OmniSQL</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">SQLVariationGenerator🚀</td>
      <td class="tg-0pky">Data Augmentation</td>
      <td class="tg-0pky">Generates SQL variants based on SQL statements and database schema.</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLQuestionGenerator</td>
      <td class="tg-0pky">Question Generation</td>
      <td class="tg-0pky">Generates corresponding natural language questions based on SQL statements.</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2503.02240">OmniSQL</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLPromptGenerator✨</td>
      <td class="tg-0pky">Prompt Generation</td>
      <td class="tg-0pky">Constructs training prompts containing schema and questions.</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLCoTGenerator</td>
      <td class="tg-0pky">Reasoning Chain Generation</td>
      <td class="tg-0pky">Generates step-by-step chain-of-thought reasoning for SQL.</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2503.02240">OmniSQL</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLCoTVotingGenerator✨</td>
      <td class="tg-0pky">Reasoning Chain Selection</td>
      <td class="tg-0pky">Performs execution consistency voting on candidate reasoning processes to select the final CoT.</td>
      <td class="tg-0pky">-</td>
    </tr>
  </tbody>
</table>

## Data Evaluation Operators

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Applicable Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Official Repository or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">SQLComponentClassifier</td>
      <td class="tg-0pky">Difficulty Assessment</td>
      <td class="tg-0pky">Performs difficulty grading based on SQL syntax complexity.</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/1809.08887">Spider</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">SQLExecutionClassifier🚀</td>
      <td class="tg-0pky">Execution Difficulty Assessment</td>
      <td class="tg-0pky">Performs difficulty grading based on model execution success rate.</td>
      <td class="tg-0pky">-</td>
    </tr>
  </tbody>
</table>

## Data Filtering Operators

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Applicable Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Official Repository or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">SQLExecutionFilter✨</td>
      <td class="tg-0pky">Data Cleaning</td>
      <td class="tg-0pky">Filters SQL statements that cannot be executed normally.</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">SQLExecutabilityFilter✨</td>
      <td class="tg-0pky">Data Cleaning</td>
      <td class="tg-0pky">Uses query plans to filter inexecutable SQL statements.</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLCorrespondenceFilter✨</td>
      <td class="tg-0pky">Data Cleaning</td>
      <td class="tg-0pky">Verifies semantic consistency between SQL and problem description.</td>
      <td class="tg-0pky">-</td>
    </tr>
  </tbody>
</table>

## Operator Interface Usage Instructions

Specifically, for operators requiring specified storage paths or model calls, we provide encapsulated **Model Interfaces**, **Storage Object Interfaces**, and **Database Management Interfaces**. These interfaces allow for pre-defining the required configurations.

### Model Interface Configuration

You can pre-define model API parameters for operators in the following way, including generative models and embedding models:

```python
from dataflow.serving import APILLMServing_request

api_llm_serving = APILLMServing_request(
    api_url="your_api_url",        # API service URL
    model_name="model_name",       # Model name
    max_workers=5                  # Maximum concurrency
)

embedding_serving = APILLMServing_request(
    api_url="http://api.openai.com/v1/embeddings",
    model_name="text-embedding-ada-002",
    max_workers=100
)
```

### Storage Interface Configuration

You can pre-define storage parameters for operators in the following way:

```python
from dataflow.utils.storage import FileStorage

storage = FileStorage(
    first_entry_file_name="your_file_path",           # Initial file path
    cache_path="./cache",                             # Cache directory
    file_name_prefix="dataflow_cache_step",           # Filename prefix
    cache_type="jsonl",                               # Cache file type
)
```

### Database Management Interface Configuration

Since database schema information is required, you can pre-define the database management as follows. In the operators, database information is read and managed by interacting with the database manager:

```python
from dataflow.utils.text2sql.database_manager import DatabaseManager

database_manager = DatabaseManager(
    db_type="your_db_type", # Currently supports SQLite and MySQL
    config={
        "your_db_config_key": "your_db_config_value"
    }
)
```

Note: For SQLite and MySQL databases, configuration should be done as follows:

```python
# Complete SQLite example
database_manager = DatabaseManager(
    db_type="sqlite",
    config={
        "root_path": "/path/to/your/database/folder"  # Directory path containing SQLite files
    }
)

# Complete MySQL example
database_manager = DatabaseManager(
    db_type="mysql",
    config={
        "host": "localhost",           # Database host address
        "user": "root",               # Username
        "password": "your_password",   # Password
        "database": "your_database_name",  # Database name
        "port": 3306                  # Port number (optional, default 3306)
    }
)
```

### Prompt Template Configuration

Operators support using predefined prompt templates. You can import and use them as follows:

```python
from dataflow.prompts.text2sql import (
    Text2SQLCotGeneratorPrompt,
    SelectSQLGeneratorPrompt,
    Text2SQLQuestionGeneratorPrompt,
    Text2SQLPromptGeneratorPrompt,
    Text2SQLCorrespondenceFilterPrompt,
    SQLVariationGeneratorPrompt
)
```

The `llm_serving`, `storage`, `database_manager`, and prompt template objects used later refer to the interface objects defined here. For complete usage examples, please refer to the actual pipeline code.

Regarding parameters: The constructor of the operator object mainly passes information related to operator configuration, which can be set once and used multiple times. The `X.run()` function passes `key` information related to I/O. Details can be found in the operator description examples below.

## Detailed Operator Descriptions

### Data Generation Operators

#### 1. SQLGenerator

**Function Description:** Generates diverse SQL statements based on database schema.
- Generates query statements covering various SQL syntax and difficulty levels.
- Supports complex queries such as JOINs, subqueries, aggregate functions, etc.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for SQL generation.
  - `database_manager`: Database manager for accessing database schema.
  - `generate_num`: Number of SQL statements to generate per database.
  - `prompt_template`: Prompt template for SQL generation.

- `run()`
  - `output_sql_key`: Output SQL statement field name, default "SQL".
  - `output_db_id_key`: Output database ID field name, default "db_id".
  - `output_sql_complexity_key`: Output SQL complexity field name, default "sql_complexity_type".

**Key Features:**

- Intelligent schema analysis and SQL template generation.
- Supports multiple database types (SQLite, MySQL).
- Automatically handles table relationships and foreign key constraints.
- Generates SQL covering different difficulty levels.

**Usage Example:**

```python
from dataflow.prompts.text2sql import SelectSQLGeneratorPrompt

sql_generator = SQLGenerator(
    database_manager=database_manager,
    generate_num=50,
    prompt_template=SelectSQLGeneratorPrompt()
)
sql_generator.run(
    storage=storage.step(),
    output_sql_key="SQL",
    output_db_id_key="db_id",
    output_sql_complexity_key="sql_complexity_type"
)
```

#### 2. SQLVariationGenerator🚀

**Function Description:** Generates SQL statement variants based on SQL statements and database schema.
- Increases syntactic diversity.
- Supports alias replacement, subquery transformation, JOIN rewriting, etc.
- Effectively expands the diversity of training data.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for SQL variant generation.
  - `database_manager`: Database manager for validating variant correctness.
  - `num_variations`: Number of variants to generate per SQL, default 5.
  - `prompt_template`: Prompt template for SQL variant generation.

- `run()`
  - `input_sql_key`: SQL statement field name, default "SQL".
  - `input_db_id_key`: Database ID field name, default "db_id".
  - `output_sql_variation_type_key`: Output SQL variant type field name, default "sql_variation_type".

**Key Features:**

- Intelligent SQL variant generation.
- Covers multiple variant directions to ensure SQL statement diversity.
- Supports various expressions for complex queries.

**Usage Example:**

```python
from dataflow.prompts.text2sql import SQLVariationGeneratorPrompt

sql_variation_generator = SQLVariationGenerator(
    database_manager=database_manager,
    num_variations=5,
    prompt_template=SQLVariationGeneratorPrompt()
)
sql_variation_generator.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id",
    output_sql_variation_type_key="sql_variation_type"
)
```

#### 3. Text2SQLQuestionGenerator

**Function Description:** Generates corresponding natural language questions based on SQL statements.
- Analyzes SQL semantics to generate reasonable natural language questions.
- Uses embedding technology to select the optimal question candidate.
- Ensures consistency between the question and the SQL query intent.
- Supports multiple question expression styles.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for question generation.
  - `embedding_serving`: Embedding model interface for question selection.
  - `database_manager`: Database manager for obtaining schema information.
  - `question_candidates_num`: Number of question candidates, default 5.
  - `prompt_template`: Prompt template for question generation.

- `run()`
  - `input_sql_key`: SQL statement field name, default "SQL".
  - `input_db_id_key`: Database ID field name, default "db_id".
  - `output_question_key`: Output question field name, default "question".
  - `output_evidence_key`: Output evidence field name, default "evidence".

**Key Features:**

- Intelligent question generation based on SQL semantics.
- Multi-candidate question generation and optimal selection.
- Contextual understanding combining database schema.
- Ensures naturalness and accuracy of questions.
- Automatically supplements the `question_type` field.

**Usage Example:**

```python
from dataflow.prompts.text2sql import Text2SQLQuestionGeneratorPrompt

text2sql_question_generator = Text2SQLQuestionGenerator(
    embedding_serving=embedding_serving,
    database_manager=database_manager,
    question_candidates_num=5,
    prompt_template=Text2SQLQuestionGeneratorPrompt()
)
text2sql_question_generator.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id",
    output_question_key="question",
    output_evidence_key="evidence"
)
```

#### 4. Text2SQLPromptGenerator✨

**Function Description:** Constructs training prompts containing schema and questions.
- Formats database schema information.
- Generates standardized training prompts combining questions.
- Supports multiple schema formats (DDL, formatted schema, etc.).
- Configurable to include example data.

**Input Parameters:**

- `__init__()`
  - `database_manager`: Database manager for obtaining schema information.
  - `prompt_template`: Prompt template, must contain `{schema}` and `{question}` placeholders.

- `run()`
  - `input_question_key`: Question field name, default "question".
  - `input_db_id_key`: Database ID field name, default "db_id".
  - `input_evidence_key`: Evidence field name, default "evidence".
  - `output_prompt_key`: Output prompt field name, default "prompt".

**Key Features:**

- Flexible prompt template system.
- Support for multiple schema formats.
- Automatic schema formatting and optimization.
- Supports schemas containing example data.

**Usage Example:**

```python
from dataflow.prompts.text2sql import Text2SQLPromptGeneratorPrompt

text2sql_prompt_generator = Text2SQLPromptGenerator(
    database_manager=database_manager,
    prompt_template=Text2SQLPromptGeneratorPrompt()
)
text2sql_prompt_generator.run(
    storage=storage.step(),
    input_question_key="question",
    input_db_id_key="db_id",
    input_evidence_key="evidence",
    output_prompt_key="prompt"
)
```

#### 5. Text2SQLCoTGenerator

**Function Description:** Generates step-by-step chain-of-thought reasoning for SQL.
- Generates detailed reasoning steps based on questions and SQL.
- Explains the logical process of SQL construction.
- Generates multiple candidate reasoning processes (no validation).
- Improves model reasoning ability and explainability.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for CoT generation.
  - `database_manager`: Database manager for obtaining schema information.
  - `sampling_num`: Number of candidate reasoning processes to generate, default 3.
  - `prompt_template`: Prompt template for CoT generation.

- `run()`
  - `input_sql_key`: SQL statement field name, default "SQL".
  - `input_question_key`: Question field name, default "question".
  - `input_db_id_key`: Database ID field name, default "db_id".
  - `input_evidence_key`: Evidence field name, default "evidence".
  - `output_cot_key`: Output CoT reasoning field name, default "cot_reasoning" (actual output column is `cot_responses`).

**Key Features:**

- High-quality reasoning chain generation.
- Multi-candidate reasoning process output (`cot_responses`).
- Contextual reasoning combining schema.
- Supports step-by-step decomposition of complex queries.

**Usage Example:**

```python
from dataflow.prompts.text2sql import Text2SQLCotGeneratorPrompt

text2sql_cot_generator = Text2SQLCoTGenerator(
    llm_serving=cot_generation_llm_serving,
    database_manager=database_manager,
    sampling_num=3,
    prompt_template=Text2SQLCotGeneratorPrompt()
)
text2sql_cot_generator.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_question_key="question",
    input_db_id_key="db_id",
    input_evidence_key="evidence",
    output_cot_key="cot_reasoning"
)
```

#### 6. Text2SQLCoTVotingGenerator✨

**Function Description:** Performs execution consistency voting on candidate CoTs to select the final reasoning process.
- Extracts SQL from `cot_responses` and executes them.
- Votes based on execution result consistency.
- Outputs the final `cot_reasoning`.

**Input Parameters:**

- `__init__()`
  - `database_manager`: Database manager for executing SQL and comparing results.

- `run()`
  - `input_cot_responses_key`: Candidate CoT field name, default "cot_responses".
  - `input_db_id_key`: Database ID field name, default "db_id".
  - `output_cot_key`: Output final CoT field name, default "cot_reasoning".

**Key Features:**

- Reliable voting based on execution consistency.
- Automatically handles invalid candidates and ties.
- Generates the final usable reasoning process.

**Usage Example:**

```python
text2sql_cot_voter = Text2SQLCoTVotingGenerator(
    database_manager=database_manager
)
text2sql_cot_voter.run(
    storage=storage.step(),
    input_cot_responses_key="cot_responses",
    input_db_id_key="db_id",
    output_cot_key="cot_reasoning"
)
```

### Data Evaluation Operators

#### 1. SQLComponentClassifier

**Function Description:** Performs difficulty grading based on SQL syntax complexity.
- Analyzes the complexity of SQL statement syntax components.
- Scores based on number of JOINs, subquery depth, aggregate functions, etc.
- Supports custom difficulty thresholds and labels.
- Provides a standardized difficulty classification system.

**Input Parameters:**

- `__init__()`
  - `difficulty_thresholds`: List of difficulty thresholds, default [2, 4, 6].
  - `difficulty_labels`: List of difficulty labels, default ['easy', 'medium', 'hard', 'extra'].

- `run()`
  - `input_sql_key`: SQL statement field name, default "SQL".
  - `output_difficulty_key`: Output difficulty label field name, default "sql_component_difficulty".

**Key Features:**

- Complexity analysis based on SQL syntactic structure.
- Configurable difficulty thresholds and labels.
- Fast batch processing capability.
- Standardized difficulty assessment system.

**Usage Example:**

```python
sql_component_classifier = SQLComponentClassifier(
    difficulty_thresholds=[2, 4, 6],
    difficulty_labels=['easy', 'medium', 'hard', 'extra']
)
sql_component_classifier.run(
    storage=storage.step(),
    input_sql_key="SQL",
    output_difficulty_key="sql_component_difficulty"
)
```

#### 2. SQLExecutionClassifier🚀

**Function Description:** Performs difficulty grading based on model execution success rate.
- Uses LLM to attempt SQL generation multiple times to assess difficulty.
- Dynamically adjusts difficulty levels based on model success rate.
- Provides difficulty assessment closer to real-world applications.
- Supports custom difficulty configurations and generation counts.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for SQL generation testing.
  - `database_manager`: Database manager for SQL execution verification.
  - `num_generations`: Number of test generations, default 10.
  - `difficulty_thresholds`: List of difficulty thresholds, default [2, 5, 9].
  - `difficulty_labels`: List of difficulty labels, default ['extra', 'hard', 'medium', 'easy'].

- `run()`
  - `input_sql_key`: SQL statement field name, default "SQL".
  - `input_db_id_key`: Database ID field name, default "db_id".
  - `input_prompt_key`: Prompt field name, default "prompt".
  - `output_difficulty_key`: Output difficulty label field name, default "sql_execution_difficulty".

**Key Features:**

- Difficulty assessment based on actual model performance.
- Dynamic difficulty adjustment mechanism.
- Statistical analysis of multiple generations.
- Difficulty grading more aligned with real-world scenarios.

**Usage Example:**

```python
sql_execution_classifier = SQLExecutionClassifier(
    llm_serving=llm_serving,
    database_manager=database_manager,
    num_generations=10,
    difficulty_thresholds=[2, 5, 9],
    difficulty_labels=['extra', 'hard', 'medium', 'easy']
)
sql_execution_classifier.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id",
    input_prompt_key="prompt",
    output_difficulty_key="sql_execution_difficulty"
)
```

### Data Filtering Operators

#### 1. SQLExecutionFilter✨

**Function Description:** Verifies the executability and syntactic correctness of SQL statements.
- Executes SQL statements in a real database environment.
- Detects syntax errors, runtime errors, and logical errors.
- Filters SQL statements that cannot be executed normally.
- Ensures the validity and usability of SQL in the dataset.

**Input Parameters:**

- `__init__()`
  - `database_manager`: Database manager for SQL execution and verification.

- `run()`
  - `input_sql_key`: SQL statement field name, default "SQL".
  - `input_db_id_key`: Database ID field name, default "db_id".

**Key Features:**

- Real-time SQL execution verification.
- Automatic filtering of failed SQL statements.
- Efficient batch processing capability.

**Usage Example:**

```python
sql_execution_filter = SQLExecutionFilter(
    database_manager=database_manager
)
sql_execution_filter.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id"
)
```

#### 2. SQLExecutabilityFilter✨

**Function Description:** Filters inexecutable SQL using query plans.
- Generates query plans via database EXPLAIN.
- Judges executability without executing the SQL.
- Filters SQL statements that are inexecutable or invalid.

**Input Parameters:**

- `__init__()`
  - `database_manager`: Database manager for generating query plans.

- `run()`
  - `input_sql_key`: SQL statement field name, default "SQL".
  - `input_db_id_key`: Database ID field name, default "db_id".

**Key Features:**

- Fast filtering without SQL execution.
- Lower resource consumption and higher throughput.
- Can be combined with execution filters.

**Usage Example:**

```python
sql_executability_filter = SQLExecutabilityFilter(
    database_manager=database_manager
)
sql_executability_filter.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id"
)
```

#### 3. Text2SQLCorrespondenceFilter✨

**Function Description:** Verifies the semantic consistency between SQL and problem description.
- Uses LLM to judge whether the SQL answers the question.
- Checks the match between the question and SQL logic.
- Filters semantically inconsistent data pairs.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for consistency judgment.
  - `database_manager`: Database manager for schema reading.
  - `prompt_template`: Prompt template for consistency checking.

- `run()`
  - `input_sql_key`: SQL statement field name, default "SQL".
  - `input_db_id_key`: Database ID field name, default "db_id".
  - `input_question_key`: Question field name, default "question".
  - `input_evidence_key`: Evidence field name, default "evidence".

**Key Features:**

- Intelligent semantic consistency checking.
- Consistency judgment incorporating schema.
- Automatic filtering of mismatched data pairs.

**Usage Example:**

```python
from dataflow.prompts.text2sql import Text2SQLCorrespondenceFilterPrompt

text2sql_correspondence_filter = Text2SQLCorrespondenceFilter(
    llm_serving=llm_serving,
    database_manager=database_manager,
    prompt_template=Text2SQLCorrespondenceFilterPrompt()
)
text2sql_correspondence_filter.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id",
    input_question_key="question",
    input_evidence_key="evidence"
)
```