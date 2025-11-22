---
title: Text2SQL Operators
createTime: 2025/06/24 11:43:42
permalink: /en/guide/Text2SQL_operators/
---

# Text2SQL Operators

## Overview

Text-to-SQL operators are a specialized set of components designed for data processing and quality enhancement in Text-to-SQL tasks, aiming to:
- Clean and augment existing Text-to-SQL datasets
- Generate high-quality question-answer pairs for each sample, including training prompts and chain-of-thought (CoT) reasoning processes
- Provide multi-dimensional data quality assessment and difficulty grading

Open-source operator varieties are severely limited. To achieve superior data processing quality and fill the gap in publicly available data synthesis and processing methods, we have meticulously designed and **developed in-house** a new suite of operators. Their labels carry the following meanings:

- 🚀 **Innovative Development**: Core algorithms are originally developed, either filling existing algorithmic gaps or further enhancing performance beyond current bottlenecks.
- ✨ **Open-Source First**: This operator is integrated into mainstream community frameworks for the first time, enabling broader developer adoption and open sharing.

## Data Generation Operators

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Official Repository or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">SQLGenerator</td>
      <td class="tg-0pky">Data Generation</td>
      <td class="tg-0pky">Generates diverse SQL statements based on database schemas</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2503.02240">OmniSQL</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">SQLVariationGenerator🚀</td>
      <td class="tg-0pky">Data Augmentation</td>
      <td class="tg-0pky">Generates SQL variants based on SQL statements and database schemas</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLQuestionGenerator</td>
      <td class="tg-0pky">Question Generation</td>
      <td class="tg-0pky">Generates corresponding natural language questions from SQL statements</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2503.02240">OmniSQL</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLPromptGenerator✨</td>
      <td class="tg-0pky">Prompt Generation</td>
      <td class="tg-0pky">Constructs training prompts containing schema and question information</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLCoTGenerator</td>
      <td class="tg-0pky">Chain-of-Thought Generation</td>
      <td class="tg-0pky">Generates step-by-step reasoning chains for SQL derivation</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2503.02240">OmniSQL</a></td>
    </tr>
  </tbody>
</table>

## Data Evaluation Operators

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Official Repository or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">SQLComponentClassifier</td>
      <td class="tg-0pky">Difficulty Assessment</td>
      <td class="tg-0pky">Grades difficulty based on SQL syntax complexity</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/1809.08887">Spider</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">SQLExecutionClassifier🚀</td>
      <td class="tg-0pky">Execution Difficulty Assessment</td>
      <td class="tg-0pky">Grades difficulty based on model execution success rate</td>
      <td class="tg-0pky">-</td>
    </tr>
  </tbody>
</table>

## Data Filtering Operators

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Official Repository or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">SQLExecutionFilter✨</td>
      <td class="tg-0pky">Data Cleaning</td>
      <td class="tg-0pky">Filters out SQL statements that cannot be executed successfully</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">SQLConsistencyFilter✨</td>
      <td class="tg-0pky">Data Cleaning</td>
      <td class="tg-0pky">Verifies semantic consistency between SQL queries and their corresponding natural language questions</td>
      <td class="tg-0pky">-</td>
    </tr>
  </tbody>
</table>

## Operator Interface Usage Guide

Specifically, for operators requiring designated storage paths or model invocations, we provide encapsulated **Model Interfaces**, **Storage Object Interfaces**, and **Database Management Interfaces**. These interfaces allow pre-definition of required configurations.

### Model Interface Configuration

You can pre-define API parameters for operators using the following methods, supporting both generative and embedding models:

```python
from dataflow.serving import APILLMServing_request

api_llm_serving = APILLMServing_request(
    api_url="your_api_url",        # API service endpoint
    model_name="model_name",       # Model name
    max_workers=5                  # Maximum concurrent workers
)

embedding_serving = APILLMServing_request(
    api_url="http://api.openai.com/v1/embeddings",
    model_name="text-embedding-ada-002",
    max_workers=100
)
```

### Storage Interface Configuration

You can pre-define storage parameters for operators as follows:

```python
from dataflow.utils.storage import FileStorage

storage = FileStorage(
    first_entry_file_name="your_file_path",           # Initial file path
    cache_path="./cache",                             # Cache directory
    file_name_prefix="dataflow_cache_step",           # File name prefix
    cache_type="jsonl",                               # Cache file type
)
```

### Database Management Interface Configuration

Since database schema information is required, you can pre-define database management as follows. Within operators, interactions with the database manager enable reading and managing database information:

```python
from dataflow.utils.text2sql.database_manager import DatabaseManager

database_manager = DatabaseManager(
    db_type="your_db_type", # Currently supports SQLite and MySQL
    config={
        "your_db_config_key": "your_db_config_value"
    }    
)
```

Note that SQLite and MySQL databases require specific configuration formats:

```python
# SQLite Full Example
database_manager = DatabaseManager(
    db_type="sqlite",
    config={
        "root_path": "/path/to/your/database/folder"  # Directory containing SQLite files
    }
)

# MySQL Full Example
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

Operators support predefined prompt templates, which can be imported and used as follows:

```python
from dataflow.prompts.text2sql import (
    Text2SQLCotGeneratorPrompt,
    SelectSQLGeneratorPrompt,
    Text2SQLQuestionGeneratorPrompt,
    Text2SQLPromptGeneratorPrompt,
    SQLConsistencyFilterPrompt,
    SQLVariationGeneratorPrompt
)
```

The `llm_serving`, `storage`, `database_manager`, and prompt templates referenced later are the interface objects defined above. Complete usage examples can be found in actual pipeline code.

For parameter passing: The operator constructor primarily accepts configuration-related parameters, allowing one-time setup for multiple uses; while the `X.run()` function accepts I/O-related `key` parameters. See detailed operator descriptions below for specifics.

## Detailed Operator Descriptions

### Data Generation Operators

#### 1. SQLGenerator

**Function Description:** Generates diverse SQL statements based on database schemas.
- Generates queries covering various SQL syntaxes and difficulty levels
- Supports complex queries such as JOINs, subqueries, and aggregate functions

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for SQL generation
  - `database_manager`: Database manager for accessing schema information
  - `generate_num`: Number of SQL statements to generate per database
  - `prompt_template`: Prompt template for SQL generation

- `run()`
  - `output_sql_key`: Output field name for SQL statements, default "SQL"
  - `output_db_id_key`: Output field name for database ID, default "db_id"

**Key Features:**
- Intelligent schema analysis and SQL template generation
- Supports multiple database types (SQLite, MySQL)
- Automatically handles table relationships and foreign key constraints
- Generates SQL across varying difficulty levels

**Usage Example:**

```python
from dataflow.prompts.text2sql import SelectSQLGeneratorPrompt

sql_generator = SQLGenerator(
    llm_serving=llm_serving,
    database_manager=database_manager,
    generate_num=50,
    prompt_template=SelectSQLGeneratorPrompt()
)
sql_generator.run(
    storage=storage.step(),
    output_sql_key="SQL",
    output_db_id_key="db_id"
)
```

#### 2. SQLVariationGenerator🚀

**Function Description:** Generates SQL variants based on SQL statements and database schemas.
- Increases syntactic diversity
- Supports alias substitution, subquery transformation, JOIN rewriting, etc.
- Effectively expands training data diversity

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for variant generation
  - `database_manager`: Database manager for validating variant correctness
  - `num_variations`: Number of variants to generate per SQL, default 5
  - `prompt_template`: Prompt template for variant generation

- `run()`
  - `input_sql_key`: Input field name for SQL statements, default "SQL"
  - `input_db_id_key`: Input field name for database ID, default "db_id"

**Key Features:**
- Intelligent SQL variant generation
- Covers multiple variation directions to ensure diversity
- Supports multiple expression styles for complex queries

**Usage Example:**

```python
from dataflow.prompts.text2sql import SQLVariationGeneratorPrompt

sql_variation_generator = SQLVariationGenerator(
    llm_serving=llm_serving,
    database_manager=database_manager,
    num_variations=5,
    prompt_template=SQLVariationGeneratorPrompt()
)
sql_variation_generator.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id"
)
```

#### 3. Text2SQLQuestionGenerator

**Function Description:** Generates natural language questions corresponding to SQL statements.
- Analyzes SQL semantics to generate reasonable questions
- Uses embedding techniques to select optimal question candidates
- Ensures consistency between questions and SQL intent
- Supports multiple question expression styles

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for question generation
  - `embedding_serving`: Embedding model interface for candidate selection
  - `database_manager`: Database manager for schema information
  - `question_candidates_num`: Number of candidate questions, default 5
  - `prompt_template`: Prompt template for question generation

- `run()`
  - `input_sql_key`: Input field name for SQL statements, default "SQL"
  - `input_db_id_key`: Input field name for database ID, default "db_id"
  - `output_question_key`: Output field name for generated questions, default "question"

**Key Features:**
- Semantics-aware intelligent question generation
- Multi-candidate generation with optimal selection
- Contextual understanding leveraging database schema
- Ensures naturalness and accuracy of questions

**Usage Example:**

```python
from dataflow.prompts.text2sql import Text2SQLQuestionGeneratorPrompt

text2sql_question_generator = Text2SQLQuestionGenerator(
    llm_serving=llm_serving,
    embedding_serving=embedding_serving,
    database_manager=database_manager,
    question_candidates_num=5,
    prompt_template=Text2SQLQuestionGeneratorPrompt()
)
text2sql_question_generator.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id",
    output_question_key="question"
)
```

#### 4. Text2SQLPromptGenerator✨

**Function Description:** Constructs training prompts containing schema and question information.
- Formats database schema information
- Generates standardized prompts combining schema and question
- Supports multiple schema formats (DDL, formatted schema, etc.)
- Configurable option to include example data

**Input Parameters:**

- `__init__()`
  - `database_manager`: Database manager for schema information
  - `prompt_template`: Prompt template must include placeholders {schema} and {question}

- `run()`
  - `input_question_key`: Input field name for questions, default "question"
  - `input_db_id_key`: Input field name for database ID, default "db_id"
  - `output_prompt_key`: Output field name for generated prompts, default "prompt"

**Key Features:**
- Flexible prompt template system
- Support for multiple schema formats
- Automatic schema formatting and optimization
- Supports schema with embedded example data

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
    output_prompt_key="prompt"
)
```

#### 5. Text2SQLCoTGenerator

**Function Description:** Generates step-by-step reasoning chains for SQL derivation.
- Produces detailed reasoning steps based on questions and SQL
- Explains the logical process behind SQL construction
- Supports retry mechanisms and quality assurance
- Enhances model reasoning capability and interpretability

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for CoT generation
  - `database_manager`: Database manager for schema information
  - `max_retries`: Maximum retry attempts, default 3
  - `enable_retry`: Whether to enable retry mechanism, default True
  - `prompt_template`: Prompt template for CoT generation

- `run()`
  - `input_sql_key`: Input field name for SQL statements, default "SQL"
  - `input_question_key`: Input field name for questions, default "question"
  - `input_db_id_key`: Input field name for database ID, default "db_id"
  - `output_cot_key`: Output field name for CoT reasoning, default "cot_reasoning"

**Key Features:**
- High-quality reasoning chain generation
- Automated error detection and retry mechanism
- Schema-aware contextual reasoning
- Supports stepwise decomposition of complex queries

**Usage Example:**

```python
from dataflow.prompts.text2sql import Text2SQLCotGeneratorPrompt

text2sql_cot_generator = Text2SQLCoTGenerator(
    llm_serving=cot_generation_llm_serving,
    database_manager=database_manager,
    max_retries=3,
    enable_retry=True,
    prompt_template=Text2SQLCotGeneratorPrompt()
)
text2sql_cot_generator.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_question_key="question",
    input_db_id_key="db_id",
    output_cot_key="cot_reasoning"
)
```

### Data Evaluation Operators

#### 1. SQLComponentClassifier

**Function Description:** Grades difficulty based on SQL syntax complexity.
- Analyzes syntactic components of SQL statements
- Scores based on JOIN count, subquery depth, aggregate functions, etc.
- Supports custom difficulty thresholds and labels
- Provides a standardized difficulty classification system

**Input Parameters:**

- `__init__()`
  - `difficulty_thresholds`: List of difficulty thresholds, default [2, 4, 6]
  - `difficulty_labels`: List of difficulty labels, default ['easy', 'medium', 'hard', 'extra']

- `run()`
  - `input_sql_key`: Input field name for SQL statements, default "SQL"
  - `output_difficulty_key`: Output field name for difficulty label, default "sql_component_difficulty"

**Key Features:**
- Complexity analysis based on SQL syntax structure
- Configurable thresholds and labels
- Fast batch processing capability
- Standardized evaluation framework

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

**Function Description:** Grades difficulty based on model execution success rate.
- Uses LLM to repeatedly attempt SQL generation for difficulty assessment
- Dynamically adjusts difficulty level based on model success rate
- Provides difficulty evaluation more aligned with real-world applications
- Supports customizable difficulty configurations and generation counts

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for test generation
  - `database_manager`: Database manager for SQL execution validation
  - `num_generations`: Number of generation attempts, default 10
  - `difficulty_thresholds`: Difficulty thresholds list, default [2, 5, 9]
  - `difficulty_labels`: Difficulty labels list, default ['extra', 'hard', 'medium', 'easy']

- `run()`
  - `input_sql_key`: Input field name for SQL statements, default "SQL"
  - `input_db_id_key`: Input field name for database ID, default "db_id"
  - `input_prompt_key`: Input field name for prompts, default "prompt"
  - `output_difficulty_key`: Output field name for difficulty label, default "sql_execution_difficulty"

**Key Features:**
- Difficulty evaluation based on actual model performance
- Dynamic adjustment mechanism
- Statistical analysis from multiple generations
- Difficulty grading more representative of real-world scenarios

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

**Function Description:** Validates SQL executability and syntactic correctness.
- Executes SQL statements in a real database environment
- Detects syntax errors, runtime errors, and logical inconsistencies
- Filters out non-executable SQL statements
- Ensures SQL validity and usability within the dataset

**Input Parameters:**

- `__init__()`
  - `database_manager`: Database manager for SQL execution and validation

- `run()`
  - `input_sql_key`: Input field name for SQL statements, default "SQL"
  - `input_db_id_key`: Input field name for database ID, default "db_id"

**Key Features:**
- Real-time SQL execution validation
- Automatic filtering of failed executions
- Efficient batch processing

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

#### 2. SQLConsistencyFilter✨

**Function Description:** Verifies semantic consistency between SQL and natural language questions.
- Uses LLM to determine whether SQL results answer the posed question
- Checks alignment between question semantics and SQL logic
- Filters semantically inconsistent question-SQL pairs
- Enhances dataset quality and reliability

**Input Parameters:**

- `__init__()`
  - `llm_serving`: LLM service interface for consistency judgment
  - `database_manager`: Database manager for SQL execution
  - `prompt_template`: Prompt template for consistency checking

- `run()`
  - `input_sql_key`: Input field name for SQL statements, default "SQL"
  - `input_db_id_key`: Input field name for database ID, default "db_id"
  - `input_question_key`: Input field name for questions, default "question"

**Key Features:**
- Intelligent semantic consistency checking
- Combines SQL execution results with question semantics
- Automatically filters mismatched pairs
- Supports consistency verification for complex queries

**Usage Example:**

```python
from dataflow.prompts.text2sql import SQLConsistencyFilterPrompt

sql_consistency_filter = SQLConsistencyFilter(
    llm_serving=llm_serving,
    database_manager=database_manager,
    prompt_template=SQLConsistencyFilterPrompt()
)
sql_consistency_filter.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id",
    input_question_key="question"
)
```