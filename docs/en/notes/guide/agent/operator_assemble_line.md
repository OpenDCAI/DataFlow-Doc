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

This functional module primarily consists of frontend interaction logic (`gradio_app/pages/op_assemble_line.py`) and a backend execution workflow (`dataflow_agent/workflow/wf_df_op_usage.py`).

### 2.1 Dynamic Operator Loading and Introspection

The system automatically scans the `OPERATOR_REGISTRY` upon startup, loading all registered operators and categorizing them based on their module paths.

* **Automatic Parameter Parsing**: Using Python's `inspect` module, the system automatically extracts method signatures from the `init` and `run` methods of operator classes to generate corresponding configuration boxes in the UI.
* **Prompt Template Support**: For operators that support Prompts, the UI automatically reads `ALLOWED_PROMPTS` and provides a dropdown selection box.

### 2.2 Intelligent Parameter Linking

During the UI orchestration process, the system features "automatic wiring" capabilities. It analyzes the input-output relationships between adjacent operators, automatically matches keys with similar names, and displays the data flow through visualized connections.

## 3. User Guide

This feature provides two modes of use: the **Graphical Interface (Gradio UI)** and **Command-line Scripts**.

### 3.1 UI Operation

It is ideal for interactive exploration and rapid validation. To launch the web interface:
```python
python gradio_app/app.py
```
Visit `http://127.0.0.1:7860` and start using  

1. **Environment Configuration**: Enter API-related information and the input JSONL file path at the top of the page.
2. **Orchestrate Pipeline**:
    1. **Select Operator**: Choose an operator category and a specific operator from the left dropdown menu.
    2. **Configure Parameters**: Enter parameters into the JSON edit box.
    3. **Add Operator**: Click the "Add Operator to Pipeline" button and drag items in the list below to adjust the execution order.
3. **Run and Results**: Click "Run Pipeline" to view the generated code and a preview of the processed results in the execution result section.

### 3.2 Script Invocation and Explicit Configuration

For automated tasks or batch processing, you can use the `script/run_dfa_op_assemble.py` script. This method skips the UI and directly defines the operator sequence through code.

#### 1. Modify the Configuration 

Open `script/run_dfa_op_assemble.py` and make modifications in the configuration section at the top of the file.

##### API and File Configuration
- CHAT_API_URL: URL of the LLM service
- API_KEY: Authentication key for model invocation. If your Pipeline contains operators that need to call large models (such as reasoning generation, content rewriting, etc.), this item is **required**; otherwise, the operators will not run.
- MODEL: Model name, default is gpt-4o
- INPUT_FILE: Path of the input JSONL file (test data file)
##### Other Configurations
- CACHE_DIR: Storage directory for results and pipeline code files. The pipeline code files generated during script execution, intermediate execution data, and final data results will all be saved here.
- SESSION_ID: Unique identifier for the task.

#### 2. Define Pipeline Steps
This is the most critical part of the script. You need to define the execution order and parameters of operators in the `PIPELINE_STEPS` list. Each step consists of an **operator name (op_name)** and a **parameter set (params)**.

```Python
# [Pipeline 定义]
PIPELINE_STEPS = [
    {
        "op_name": "ReasoningAnswerGenerator",
        "params": {
            # __init__ 参数 (注意：在 wf_df_op_usage 中统一合并为 params)
            "prompt_template": "dataflow.prompts.reasoning.general.GeneralAnswerGeneratorPrompt",
            # run 参数
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
> **Note: Explicit Configuration Requirements** Unlike the "automatic linking" in the UI, you must **explicitly configure** all parameters in script mode. You need to ensure that the `output_key` of the previous operator strictly matches the `input_key` of the next operator; the script will not automatically correct parameter names for you.

#### 3. Run the Script

```Bash
python script/run_dfa_op_assemble.py
```

#### 4. Result Output

After the script is executed, the console will print:

- **[Generation]**: Path of the generated Pipeline code.
- **[Code Preview]**: Preview of the first 20 lines of the generated code.
- **[Execution]**: Execution status.

#### 5. Practical Case: General Text Reasoning and Pseudo-Answer Generation
We have a `tests/test.jsonl` file, where each line contains a `"raw_content"` field. Our goal is: based on the general English text content of this field, first invoke the large language model to generate reasoning-based answers for the text content, then generate pseudo-answers by generating candidate answers in multiple rounds and selecting the optimal one through statistics, and finally output key fields such as the list of candidate answers, optimal pseudo-answer, corresponding reasoning processes, and typical correct reasoning examples. Therefore, we select the `ReasoningAnswerGenerator` and `ReasoningPseudoAnswerGenerator` operators to orchestrate the Pipeline.

The following is a complete configuration example:

```Python
# [Pipeline 定义]
PIPELINE_STEPS = [
    {
        "op_name": "ReasoningAnswerGenerator",
        "params": {
            # __init__ 参数 (注意：在 wf_df_op_usage 中统一合并为 params)
            "prompt_template": "dataflow.prompts.reasoning.general.GeneralAnswerGeneratorPrompt",
            # run 参数
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
After completing the configuration, execute the following command in the terminal:

```Bash
python script/run_dfa_op_assemble.py
```
The script will automatically perform the following actions:

1. Build the graph: Parse your PIPELINE_STEPS.
2. Generate code: Convert the configuration into standard Python code and store it under `dataflow_cache/generated_pipelines/`.
3. Execute the task: Start a child process to run the generated Pipeline.
4. Output the report: The terminal will display [Execution] Status: success as well as a partial preview of the code.

You can directly go to the `CACHE_DIR` directory to view the generated JSONL result file and verify whether the data meets expectations.
