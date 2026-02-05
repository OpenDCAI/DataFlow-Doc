---
title: Pipeline Recommendation & Refinement
createTime: 2026/02/05 22:11:00
permalink: /en/guide/agent/pipeline_rec&refine/
---

This module contains two closely collaborative core subsystems:

1. **Pipeline Recommendation**: Responsible for the "0 to 1" process, transforming natural language requirements into complete executable Pipelines.
2. **Pipeline Refinement**: Responsible for the "1 to N" process, fine-tuning existing Pipeline structures based on user feedback.


## Part 1: Pipeline Recommendation

### 1. Overview

**Pipeline Recommendation** is the core orchestration engine of the DataFlow-Agent. It understands complex business requirements, automatically decomposes task steps, retrieves optimal components from the operator library, plans data flow, and generates executable Python code.

The system possesses self-healing capabilities: when generated code fails to execute, the Agent proactively consults operator source code documentation, analyzes the cause of the error, and corrects the code until execution succeeds.

### 2. System Architecture

This function is orchestrated by `wf_pipeline_recommend_extract_json.py`, forming a directed graph containing multiple levels of intelligent agents. The detailed responsibilities of the nodes are as follows:

#### 2.1 Analysis and Planning Phase

1. **Classifier Node**
   1. **Responsibility**: Reads a small number of data samples to identify data types and business domains. This determines the tendency of subsequent operator recommendations.
   2. **Input**: `state.request.json_file` (data file path).
   3. **Output**: `state.category`.
2. **Target Parser Node**
   1. **Core Task (What it does)**: Acts as a business analyst. It does not directly generate code but translates vague user requirements into logically rigorous steps.
   2. **Input**: The user's natural language requirement (e.g., "Filter out texts shorter than 10 in the pdf, then deduplicate, and finally extract keywords").
   3. **LLM Thinking**: Decomposes the requirement into a standard list of steps conforming to data processing logic (e.g., `["Read and parse pdf into plain text", "Filter out text data shorter than 10 characters", "Deduplicate text data to remove repetitive content", "Extract keywords from text data"]`).
   4. **Subsequent Action**: Uses the descriptions of the decomposed steps to retrieve the most similar physical operators from the operator vector database, forming a **candidate operator pool** for use in the next stage.
3. **Recommender Node**
   1. **Core Task**: Responsible for turning scattered candidate operators into an organized execution plan.
   2. **Input**:
      * `target`: The user's original requirement.
      * `sample`: Data samples (to understand data characteristics, such as field names and formats).
      * `split_ops`: The list of candidate operators and their functional descriptions retrieved via RAG by the `target_parser` in the previous step.
   3. **LLM Thinking**:
      * **Logical Sequencing**: Each stage is not limited to a single operator but follows the "requirement".
      * **Data Compatibility**: If an operator requires field "X" but it does not exist in the sample data, it must ensure an operator creating that field precedes it.
      * **Gap Filling**: Can existing operators meet the requirement? If not, a versatile `PromptedGenerator` needs to be inserted.
   4. **Output**: An ordered list of operator names and recommendation reasons, such as:
   ```json
   {
      "ops": [
         "Text2SQLQuestionGenerator",
         "SQLExecutionFilter",
         "SQLConsistencyFilter",
         "SQLVariationGenerator",
         "Text2SQLQuestionGenerator",
         "Text2SQLPromptGenerator",
         "Text2SQLCoTGenerator",
         "ReasoningQuestionSolvableSampleEvaluator",
         "SQLComponentClassifier",
         "PromptedGenerator"
      ],
      "reason": "This pipeline design aims to meet all user requirements.
      1. First, use Text2SQLQuestionGenerator to parse the SQL data file and extract SQL statements and corresponding natural language questions.
      2. Next, use SQLExecutionFilter to execute SQL statements in the database to verify their validity.
      3. Then, use SQLConsistencyFilter for consistency filtering to ensure SQL statements match their corresponding natural language questions.
      4. Next, use SQLVariationGenerator to augment valid SQL statements, including value replacement, increasing syntax difficulty, and changing writing styles.
      5. Subsequently, use Text2SQLQuestionGenerator to generate corresponding natural language questions based on the augmented SQL statements.
      6. Next, use Text2SQLPromptGenerator to generate prompt content, and generate the Chain of Thought reasoning process via Text2SQLCoTGenerator.
      7. Then, use ReasoningQuestionSolvableSampleEvaluator to classify the generated data, assessing the difficulty for large models to solve the problem, and use SQLComponentClassifier to assess the difficulty of SQL components.
      8. Finally, use PromptedGenerator to output synthetic SQL data and its corresponding natural language questions and reasoning processes to ensure all requirements are met."
   }

   ```


#### 2.2 Construction and Execution Phase

1. **Builder Node**
   1. **Responsibility**: Converts the recommendation plan (JSON) into an actual Python code file (`pipeline.py`) and launches a subprocess to execute that code.
   2. **Mechanism**: Supports creating subprocesses to execute code, capturing standard output (stdout) and standard error (stderr).
   3. **Output**: `state.execution_result` (Success/Fail status and logs).



#### 2.3 Automatic Repair Loop

When the `builder` execution fails and `need_debug=True`, it enters this loop:

1. **Debugger Node**
   * **Responsibility**: Analyzes the error stack (`error_trace`) and current code to determine the error type (parameter error, logic error, etc.).


2. **Info Requester Node**
   * **Responsibility**: This is an active learning node. If the Debugger deems information insufficient, it calls tools to read the **source code** or **documentation** of relevant operators to obtain context.


3. **Rewriter Node**
   1. **Responsibility**: Synthesizes error logs and source code knowledge found by the InfoRequester to generate the complete repaired code.
   2. **Flow**: The repaired code is sent back to the `builder` for testing until success or the maximum number of retries (`max_debug_rounds`) is reached.



#### 2.4 Output Phase

* **Exporter Node**
   * **Responsibility**: After successful execution, organizes the final Pipeline information, code paths, and data samples, formatting the output for the user.



### 3. User Guide

#### 3.1 Graphical Interface

Code located in `pipeline_rec.py`.

1. **Configure Inputs**:
   1. Enter your requirements in the "Target Description" box.
   2. Input the jsonl file to be processed.
   3. Configure API information (URL, Key, Model).
   4. (Optional) Configure embedding model and debug options.
   5. Select whether to automatically update the vector index (needs to be checked if operators are not in the registry).
   6. Select whether to use debug mode (debug mode will automatically run the generated Pipeline code until the maximum iteration rounds).


2. **Generate Pipeline**:

   Click **"Generate Pipeline"**.


3. **View Results**:
   1. **Pipeline Code**: View the final generated pipeline code.
   2. **Execution Log**: View execution log information.
   3. **Agent Results**: Detailed execution results of each Agent node, including the recommended operator list, construction process, etc..
   4. **Pipeline JSON**: Generated Pipeline topology JSON, containing operator node lists and inter-node connection relationships.



#### 3.2 Script Invocation

Use the `run_dfa_pipeline_recommend.py` script.

**Configuration Parameters:**

```python
LANGUAGE = "en"
CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
MODEL = os.getenv("DF_MODEL", "gpt-4o")
TARGET = "Just give me simple filtering or deduplication operators, only 2 operators needed"
NEED_DEBUG = True           # Enable auto-repair
MAX_DEBUG_ROUNDS = 5        # Maximum repair attempts
CACHE_DIR = "dataflow_cache"
TEST_JSON_REL_PATH = "tests/test.jsonl" # Test data path

```

**Run Command:**

```bash
python run_dfa_pipeline_recommend.py

```

**Output:** After running, the script generates `pipeline.py`, `final_state.json`, and `graph.png` under `dataflow_cache/session_{id}/`.


## Part 2: Pipeline Refinement

### 1. Overview

Pipeline Refinement allows users to fine-tune generated DataFlow Pipelines using natural language. Users do not need to manually modify complex JSON configurations or Python code; simply inputting instructions like "delete the intermediate filter node" allows the system to intelligently parse the intent and automatically adjust the Pipeline's topology.

### 2. System Architecture

This function is orchestrated by `wf_pipeline_refine.py`, adopting a three-stage architecture of **Analyzer -> Planner -> Refiner**:

#### 2.1 Refine Target Analyzer

* **Core Responsibilities**:
   * **Intent Recognition**: Compares the current Pipeline structure (`state.pipeline_structure_code`) and the user's natural language requirement (`target`) to analyze the type of modification the user wishes to make (add, delete, modify).
   * **Pre-emptive RAG**: This is a key feature. The Analyzer parses descriptions of sub-operations implied in user requirements and directly calls RAG search `_get_operators_by_rag_with_scores`. It calculates similarity scores, evaluates match quality, and packages the best-matching operator code `code_snippet` and warning messages into `op_contexts`.
* **Input**: `state.pipeline_structure_code` (current pipeline code), `state.request.target` (user modification instruction).
* **Output**: Intent analysis results containing `needed_operators_desc`, and `op_contexts` containing rich context (operator code, match scores).

#### 2.2 Refine Planner

* **Responsibility**: Based on the intent provided by the Analyzer and the pre-retrieved operator context, formulates a specific **modification plan**. It does not directly modify code but generates structured operational steps.
* **Input**: Analyzer's analysis results (`intent`), operator context (`op_context`), current node summary.
* **Output**: A list of structured operational steps, for example:
   * `REMOVE_NODE: node_filter_1`
   * `ADD_NODE: node_deduplicate (after node_loader)`
   * `UPDATE_EDGE: node_loader -> node_deduplicate`.



#### 2.3 JSON Pipeline Refiner

* **Responsibility**: Executes the Planner's plan, directly manipulating the Nodes and Edges of the Pipeline's JSON data structure.
* **Tool Enhancement**: This Agent has `search_operator_by_description` and `get_operator_code_by_name` mounted as Post-Tools. Although the Analyzer has already provided `op_context`, if the Refiner finds information insufficient during execution, it can still proactively initiate a search to supplement operator information.
* **Output**: Updated `state.pipeline_structure_code`.

### 3. User Guide

#### 3.1 Graphical Interface

Integrated at the bottom of the `pipeline_rec.py` page.

1. **Prerequisite**: Must first click "Generate Pipeline" at the top of the page to generate initial pipeline code, at which point `pipeline_json_state` will be initialized.
2. **Input Optimization Instruction**: Enter instructions in the "Optimization Requirement" text box.
3. **Execute Optimization**: Click **"Refine Pipeline"**. The system will display the updated Python code, JSON structure, and Agent execution logs.
4. **History Backtracking**: Use "Previous Round" and "Next Round" buttons to switch between different optimization versions and view the code evolution process.
5. **Warning Prompts**: If RAG match quality is low, an `Optimization Warning` comment will be automatically added to the top of the code, alerting the user that the currently generated operator may not fully match the requirement.

#### 3.2 Script Invocation

Use the `run_dfa_pipeline_refine.py` script.

**Configuration Parameters:**

```python
# Input file: pipeline structure file generated in the previous step (.json)
INPUT_JSON = "dataflow_cache/session_xxx/final_state.json" 
OUTPUT_JSON = "cache_local/pipeline_refine_result.json" # Output file; if empty string, only prints result
# Modification Target
TARGET = "Please adjust the Pipeline to contain only 3 nodes, simplifying data flow"

LANGUAGE = "en"
CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
MODEL = os.getenv("DF_MODEL", "gpt-4o")

```

**Run Command:**

```bash
python run_dfa_pipeline_refine.py

```