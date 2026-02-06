---
title: Visualized Operator Assemble Line
createTime: 2026/02/05 22:11:00
permalink: /en/guide/agent/operator_assemble_line/
---

## 1. Overview

**Visualized Operator Assemble Line** is a "low-code/no-code" development tool provided by the DataFlow-Agent platform. It allows users to bypass complex Python coding or AI planning processes by directly browsing available operators in the system via a Graphical User Interface (GUI), manually configuring parameters, and assembling them into ordered data processing pipelines.

The core value of this feature lies in:

* **What You See Is What You Get**: Real-time viewing of operator parameter definitions and pipeline structures.
* **Automatic Linking**: The system automatically attempts to match the output of a previous operator with the input of the next, simplifying data flow configuration.
* **Code Generation and Execution**: Assembled logic is automatically converted into standard Python code and executed in the background.

## 2. Features

This functional module primarily consists of frontend interaction logic (`op_assemble_line.py`) and a backend execution workflow (`wf_df_op_usage.py`).

### 2.1 Dynamic Operator Loading and Introspection

The system automatically scans the `OPERATOR_REGISTRY` upon startup, loading all registered operators and categorizing them based on their module paths.

* **Automatic Parameter Parsing**: Using Python's `inspect` module, the system automatically extracts method signatures from the `init` and `run` methods of operator classes to generate corresponding configuration boxes in the UI.
* **Prompt Template Support**: For operators that support Prompts, the UI automatically reads `ALLOWED_PROMPTS` and provides a dropdown selection box.

### 2.2 Intelligent Parameter Linking

During the UI orchestration process, the system features "automatic wiring" capabilities. It analyzes the input-output relationships between adjacent operators, automatically matches keys with similar names, and displays the data flow through visualized connections.

## 3. User Guide

This feature provides two modes of use: the **Graphical Interface (Gradio UI)** and **Command-line Scripts**.

### 3.1 UI Operation

Ideal for interactive exploration and rapid verification.

1. **Environment Configuration**: Enter API-related information and the input JSONL file path at the top of the page.
2. **Orchestrate Pipeline**:
    1. **Select Operator**: Choose an operator category and a specific operator from the left dropdown menu.
    2. **Configure Parameters**: Enter parameters into the JSON edit box.
    3. **Add Operator**: Click the "Add Operator to Pipeline" button and drag items in the list below to adjust the execution order.
3. **Run and Results**: Click "Run Pipeline" to view the generated code and a preview of the processed results in the execution result section.

### 3.2 Script Invocation and Explicit Configuration

For automated tasks or batch processing, the `run_dfa_op_assemble.py` script can be used. This method bypasses the UI and defines the operator sequence directly through code.

> **Note: Explicit Configuration Requirement**: Unlike the "Automatic Linking" in the UI, the script mode requires you to **explicitly configure** all parameters. You must ensure that the `output_key` of the previous operator strictly matches the `input_key` of the next; the script will not automatically correct parameter names for you.

#### 1. Modify Configuration

Open `run_dfa_op_assemble.py` and modify the configuration area at the top of the file.

**Key Configuration Item**: **`PIPELINE_STEPS`**—a list defining the pipeline execution steps. Each element contains an `op_name` and `params`.

```python
# [Pipeline Definition]
PIPELINE_STEPS = [
    {
        "op_name": "ReasoningAnswerGenerator",
        "params": {
            # __init__ parameters (Note: unified into 'params' in wf_df_op_usage)
            "prompt_template": "dataflow.prompts.reasoning.math.MathAnswerGeneratorPrompt",
            # run parameters
            "input_key": "raw_content",
            "output_key": "generated_cot"
        }
    },
    {
        "op_name": "ReasoningPseudoAnswerGenerator",  
        "params": {
            "max_times": 3,
            "input_key": "generated_cot",
            "output_key_answer": "pseudo_answers",
            "output_key_answer_value": "pseudo_answer_value",
            "output_key_solutions": "pseudo_solutions",
            "output_key_correct_solution_example": "pseudo_correct_solution_example"
        }
    }
]

```

**Other Required Configurations**:

* `CACHE_DIR`: **Must use an absolute path** to avoid path errors when the generated Python script executes in a subprocess.
* `INPUT_FILE`: The absolute path to the initial data file.

#### 2. Run Script

```bash
python run_dfa_op_assemble.py

```

#### 3. Output Results

After execution, the console will print:

* **[Generation]**: The path of the generated Python script (e.g., `pipeline_script_pipeline_001.py`).
* **[Code Preview]**: A preview of the first 20 lines of the generated code.
* **[Execution]**:
    * `Status: success` indicates successful execution.
    * `STDOUT`: Prints the standard output logs from the pipeline runtime.

