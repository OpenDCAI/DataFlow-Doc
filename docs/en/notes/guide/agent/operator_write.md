---
title: Operator Write
createTime: 2026/02/05 22:11:00
permalink: /en/guide/agent/operator_write/
---

## 1. Overview

**Operator Write** is the core productivity module of the DataFlow-Agent. It is not merely a tool for generating Python code based on user requirements but rather builds a closed-loop system for **generation, execution, and debugging**.

This workflow enables:

1. **Semantic Matching**: Understanding user intent (e.g., "filter missing values") and finding the best-matching base class within the existing operator library.
2. **Code Generation**: Writing executable operator code based on the base class and user data samples.
3. **Automatic Injection**: Automatically injecting LLM service capabilities into the operator if needed.
4. **Subprocess Execution**: Instantiating and running the generated operator in a controlled environment.
5. **Self-Healing**: Launching a Debugger to analyze stack traces if execution fails, automatically modifying the code, and retrying until success or the maximum retry limit is reached.

## 2. Core Features

### 2.1 Intelligent Code Generation

* **Sample-Based Programming**: The Agent reads actual data samples (calling the pre-tool `local_tool_for_sample`) and the data Schema to ensure the generated code correctly handles real field names and data types.
* **Operator Reuse**: The system prioritizes retrieving existing operator libraries (calling the pre-tool `match_operator`) to generate code inherited from existing base classes rather than starting from scratch, ensuring code standardization and maintainability.

### 2.2 Automatic Debugging Loop

This is a system equipped with self-reflection capabilities.

* **Execution Monitoring**: At the `llm_instantiate` node, the system attempts to execute the generated code (`exec(code_str)`) and captures standard output and standard errors.
* **Error Diagnosis**: If an exception occurs, the `code_debugger` Agent analyzes the error stack (`error_trace`) and the current code to generate repair suggestions (`debug_reason`).
* **Auto-Rewrite**: The `rewriter` Agent regenerates the code based on the repair suggestions, automatically updates the file, and enters the next round of testing.

### 2.3 LLM Service Injection

For complex operators requiring Large Model calls (e.g., "generate summary based on content"), the `llm_append_serving` node automatically injects standard LLM call interfaces (`self.llm_serving`) into the operator code, empowering it with AI capabilities.

## 3. Workflow Architecture

This feature is orchestrated by `wf_pipeline_write.py`, forming a directed graph containing conditional loops.

1. **Match Node**: Retrieves reference operators.
2. **Write Node**: Writes the initial code.
3. **Append Serving Node**: Injects LLM capabilities.
4. **Instantiate Node**: Attempts to run the code.
5. **Debugger Node** (Conditional Trigger): Analyzes errors.
6. **Rewriter Node**: Fixes the code.

## 4. User Guide

This feature provides two modes of usage: **Graphical Interface (Gradio UI)** and **Command Line Script**.

### 4.1 UI Operation

The frontend page code is located in `operator_write.py`, offering a visualized interactive experience.

#### 1. Configure Inputs

Configure the following in the left panel of the page:

* **Target Description**: Describe in detail the function and purpose of the operator you want to create.
  * Example: "Create an operator that performs sentiment analysis on text."
* **Operator Category**: The category the operator belongs to, used for matching similar operators as references. Defaults to `"Default"`. Options include `"filter"`, `"mapper"`, `"aggregator"`, etc..
* **Test Data File**: Specify the `.jsonl` file path used for testing the generated operator. Defaults to the project's built-in `tests/test.jsonl`.
* **Debug Settings**:
  * `Enable Debug Mode`: If checked, the system automatically attempts to fix the code if an error occurs.
  * `Max Debug Rounds`: Set the maximum number of automatic repair attempts (default is 3).
* **Output Path**: Specify the save path for the generated code (optional).

#### 2. View Results

After clicking the **"Generate Operator"** button, the right panel displays detailed results:

* **Generated Code**: Final usable Python code, supporting syntax highlighting.
* **Matched Operators**: Displays the list of reference operators found by the system in the library (e.g., `"LangkitSampleEvaluator"`, `"LexicalDiversitySampleEvaluator"`, `"PresidioSampleEvaluator"`, `"PerspectiveSampleEvaluator"`, etc.).
* **Execution Result**: Shows `success: true/false` and specific log information `stdout`/`stderr`.
* **Debug Info**: If debugging was triggered, this displays the runtime captured `stdout`/`stderr` and the selected input field key (`input_key`).
* **Agent Results**: Detailed execution results for each Agent node.
* **Execution Log**: Complete execution log information, facilitating the troubleshooting of the Agent's thought process.

### 4.2 Script Invocation and Explicit Configuration

For developers or automated tasks, `run_dfa_operator_write.py` can be executed directly.

#### 1. Modify Configuration

Open `run_dfa_operator_write.py` and modify the parameters in the configuration area at the top of the file:

```python
CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
MODEL = os.getenv("DF_MODEL", "gpt-4o")
LANGUAGE = "en"

TARGET = "Create an operator that filters out missing values and keeps rows with non-empty fields."
CATEGORY = "Default"          # Fallback category (if classifier misses)
OUTPUT_PATH = ""              # e.g., "cache_local/my_operator.py"; empty string means no file saving
JSON_FILE = ""                # Empty string uses project built-in tests/test.jsonl

NEED_DEBUG = False
MAX_DEBUG_ROUNDS = 3

```

#### 2. Run Script

```bash
python run_dfa_operator_write.py

```

#### 3. Output Results

The script will print key information to the console:

* `Matched ops`: The matched reference operators.
* `Code preview`: A preview fragment of the generated code.
* `Execution Result`:
  * `Success: True` indicates code generation and execution passed.
  * `Success: False` will print `stderr preview` for troubleshooting.
* `Debug Runtime Preview`: Displays the automatically selected `input_key` and runtime logs.
