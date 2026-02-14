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

This function is orchestrated by `dataflow_agent/workflow/wf_pipeline_recommend_extract_json.py`, forming a directed graph containing multiple levels of intelligent agents. The detailed responsibilities of the nodes are as follows:

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
   1. **Responsibility**: Converts the recommendation plan (JSON) into an actual Python code file and launches a subprocess to execute that code.
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

This feature provides two modes of usage: **Graphical Interface (Gradio UI)** and **Command Line Script**.

#### 3.1 Graphical Interface

Code located in `gradio_app/pages/pipeline_rec.py`.It is ideal for interactive exploration and rapid validation. To launch the web interface:
```python
python gradio_app/app.py
```
Visit `http://127.0.0.1:7860` and start using  

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

For automated tasks or batch generation, it is recommended to directly modify and run `script/run_dfa_pipeline_recommend.py`.

##### 1. Modify the Configuration

Open `script/run_dfa_pipeline_recommend.py` and make modifications in the configuration section at the top of the file.

**API Configuration**

  * **`CHAT_API_URL`**: URL of the LLM service
  * **`api_key`**: Access key (using the environment variable DF_API_KEY)
  * **`MODEL`**: Model name, default is gpt-4o

**Task Configuration**

   * **`TARGET`**: Describe your data processing requirements in detail in natural language
      * Example: `"Please help me orchestrate a pipeline specifically for large-scale pre-training data cleaning, covering the entire process from deduplication and rewriting to quality filtering"`
   * **`TEST_JSON_REL_PATH`**: Relative path of the data file used to test the Pipeline
      * Format: One JSON object per line
      * Default: `{Project Root Directory}/tests/test.jsonl`

**Debug Configuration**

   * **`NEED_DEBUG`**: Whether to enable automatic debugging and repair
      * **`True`**: The Agent will attempt to run the generated code immediately. If an error is reported (e.g., `ImportError`, `KeyError`), it will start the Debugger Agent to analyze the error stack, automatically modify the code and retry
      * **`False`**: End immediately after generating and running the code, without automatic debugging and repair
   * **`MAX_DEBUG_ROUNDS`**: Maximum number of automatic repair attempts, default is 5 rounds

**File Configuration**

   * **`CACHE_DIR`**: Result output directory. The generated pipeline code, execution logs, intermediate results, etc., will all be saved here

##### 2. Run the Script

```bash
python run_dfa_pipeline_recommend.py
```

##### 3. Result Output

After the script is executed, the console will print the execution logs and the final execution status. After the script runs, `my_pipeline.py`, `final_state.json` and `graph.png` will be generated under `CACHE_DIR`.

##### 4. Practical Case: Pre-training Data Cleaning Pipeline

You can refer to the following tutorials for learning, and also use the sample of [Google Colab](https://colab.research.google.com/drive/1MMJxRpfYi7Zd-jc_pyhvM1Y2WoQXOFcu?usp=sharing) we provide to run the program:

Suppose we have pre-training data `tests/test.jsonl` containing dirty data, and we want to clean it to obtain high-quality data. Open the script and modify the configuration as follows:

**Scenario Configuration:**

```python
# ===== Example config (edit here) =====

# 1. Define the task flow
TARGET = """
- 1. Please help me orchestrate a dedicated pipeline for large-scale pre-training data cleaning, covering the entire process from deduplication and rewriting to quality filtering.  - 1. Please help me orchestrate a dedicated pipeline for large-scale pre-training data cleaning, covering the entire process from deduplication and rewriting to quality filtering.
- 2. In the pre-training phase, raw web data (such as Common Crawl) is often filled with a large amount of noise, advertisements, garbled characters, and duplicate content, resulting in uneven data quality. I need to first perform appropriate rewriting on the raw data, such as removing a large number of excessive spaces, HTML tags, etc. Then, rule-based heuristic filtering needs to be applied to eliminate obviously garbage text, incomplete text, and overly short invalid data. Meanwhile, considering the complexity of online content, I need to filter data in a specified language for training large models. Web data has a high duplication rate, so it is best to use a fuzzy deduplication algorithm to clean up similar documents, leaving only one copy. Finally, to ensure that the model learns high-quality knowledge, I hope to have a quality classification model to score the cleaned data and retain only the content with high educational value, thereby building a high-quality pre-training corpus.
- 3. I need an end-to-end pipeline specifically for processing massive pre-training corpora. First, you can perform basic normalization processing on the raw text, removing excessive spaces, HTML tags, and emojis. Then, use heuristic rules for initial filtering to screen out obviously low-quality text. These heuristic rules should cover a wide range, including filtering out text segments with an excessively high symbol/word ratio, text segments containing sensitive words, text segments with an abnormal number of words, incomplete text segments ending with colons/ellipses, text segments with an abnormal number of sentences, empty text, text segments with an abnormal average word length, text segments containing HTML tags, text segments without punctuation marks, text segments with special symbols or watermarks, text segments with an excessively high proportion of parentheses, text segments with an excessively high proportion of uppercase letters, text segments containing lorem ipsum (random dummy text), text segments with an excessively low proportion of independent words, text segments with a small number of characters, text segments starting with bullet points, and text segments containing an excessive amount of Javascript. On this basis, use MinHash or similar algorithms for document-level fuzzy deduplication to significantly reduce data redundancy. Subsequently, use a trained quality assessment model to score and filter the remaining data. Finally, a language identification step can be added to ensure that only high-quality and clean text in the target language is retained in the end.
"""

# 2. Specify the test data path
TEST_JSON_REL_PATH = "tests/test.jsonl" 

# 3. Enable Debug 
NEED_DEBUG = True
MAX_DEBUG_ROUNDS = 5
```

**Run:**
After running the script, the workflow will execute in the following steps:

1. **Analyze user data and intent**: Analyze the characteristics of the user's data.
2. **Decompose user tasks and recommend operators**: Decompose the user's intent into multiple tasks, retrieve and match operators related to the user's intent.
3. **Generate code**: Analyze the order of requirements, connect these operators in series, and write the pipeline code.
4. **Automatic testing**: Start a child process for trial operation. If an error occurs and debug mode is enabled, the Debugger Node will attempt to fix it.
5. **Final delivery**: End the workflow when execution is successful or the maximum number of debug rounds is reached.

Users can find the generated Pipeline code files and execution log files in the `CACHE_DIR` directory.



## Part 2: Pipeline Refinement

### 1. Overview

Pipeline Refinement allows users to fine-tune generated DataFlow Pipelines using natural language. Users do not need to manually modify complex JSON configurations or Python code; simply inputting instructions like "delete the intermediate filter node" allows the system to intelligently parse the intent and automatically adjust the Pipeline's topology.

### 2. System Architecture

This function is orchestrated by `dataflow_agent/workflow/wf_pipeline_refine.py`, adopting a three-stage architecture of **Analyzer -> Planner -> Refiner**:

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

This feature provides two modes of usage: **Graphical Interface (Gradio UI)** and **Command Line Script**.

#### 3.1 Graphical Interface

Integrated in `gradio_app/pages/pipeline_rec.py`.It is ideal for interactive exploration and rapid validation. To launch the web interface:
```python
python gradio_app/app.py
```
Visit `http://127.0.0.1:7860` and start using  

1. **Prerequisite**: Must first click "Generate Pipeline" at the top of the page to generate initial pipeline code, at which point `pipeline_json_state` will be initialized.
2. **Input Optimization Instruction**: Enter instructions in the "Optimization Requirement" text box.
3. **Execute Optimization**: Click **"Refine Pipeline"**. The system will display the updated Python code, JSON structure, and Agent execution logs.
4. **History Backtracking**: Use "Previous Round" and "Next Round" buttons to switch between different optimization versions and view the code evolution process.
5. **Warning Prompts**: If RAG match quality is low, an `Optimization Warning` comment will be automatically added to the top of the code, alerting the user that the currently generated operator may not fully match the requirement.

#### 3.2 Script Invocation 

Use `script/run_dfa_pipeline_refine.py` to fine-tune the structure of an existing Pipeline.

##### 1. Modify the Configuration

**API Configuration**

  * **`CHAT_API_URL`**: URL of the LLM service
  * **`api_key`**: Access key (using the environment variable DF_API_KEY)
  * **`MODEL`**: Model name, default is gpt-4o

**Task Configuration**

  * **`INPUT_JSON`**: Path of the Pipeline structure file to be optimized
  * **`OUTPUT_JSON`**: Save path for the optimized Pipeline JSON structure file
  * **`TARGET`**: Describe how you want to modify the Pipeline in natural language
      * Example: `"Please adjust the Pipeline to contain only 3 nodes and simplify the data flow"`

##### 2. Run the Script

```bash
python script/run_dfa_pipeline_refine.py
```

##### 3. Practical Case: Simplify the Pipeline

You can refer to the following tutorials for learning, and also use the sample of [Google Colab](https://colab.research.google.com/drive/1MMJxRpfYi7Zd-jc_pyhvM1Y2WoQXOFcu?usp=sharing) we provide to run the program:

Suppose the Pipeline generated in the previous step is too complex and contains redundant "cleaning" operators, and we want to remove them to simplify the Pipeline.

**Scenario Configuration:**

```python
# ===== Example config (edit here) =====

# 1. Specify the Pipeline structure file generated in the previous step
INPUT_JSON = "dataflow_agent/tmps/pipeline.json"

# 2. Issue modification instructions
TARGET = "Please simplify the intermediate cleaning operators and streamline the data flow."

# 3. Specify the result save location
OUTPUT_JSON = "cache_local/pipeline_refine_result.json.json"
```

**Run:**
The Agent will analyze the JSON topology structure of the current Pipeline, find the corresponding deduplication node, and remove it.

