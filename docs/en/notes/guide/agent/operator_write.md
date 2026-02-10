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

This feature is orchestrated by `dataflow_agent/workflow/wf_pipeline_write.py`, forming a directed graph containing conditional loops.

1. **Match Node**: Retrieves reference operators.
2. **Write Node**: Writes the initial code.
3. **Append Serving Node**: Injects LLM capabilities.
4. **Instantiate Node**: Attempts to run the code.
5. **Debugger Node** (Conditional Trigger): Analyzes errors.
6. **Rewriter Node**: Fixes the code.

## 4. User Guide

This feature provides two modes of usage: **Graphical Interface (Gradio UI)** and **Command Line Script**.

### 4.1 UI Operation

The frontend page code is located in `gradio_app/pages/operator_write.py`, which provides a visual interactive experience. It is ideal for interactive exploration and rapid validation. To launch the web interface:
```python
python gradio_app/app.py
```
Visit `http://127.0.0.1:7860` and start using  

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

For developers, it is recommended to directly modify and run `script/run_dfa_operator_write.py`. This method can be more flexibly integrated into automated workflows and save the generated operator files.

#### 1. Modify the Configuration

Open `script/run_dfa_operator_write.py` and modify the parameters in the configuration section at the top of the file.

**Task Configuration**

  * **`TARGET`**: Describe the function of the operator in natural language. The more specific the description, the more accurate the generated code. It is recommended to include descriptions of input fields and expected outputs.

    * Example: `"Create an operator for performing sentiment analysis on text"`

    * Example: `"Implement a data deduplication operator that supports deduplication based on a combination of multiple fields"`

  * **`CATEGORY`**: The category to which the operator belongs, used to match similar operators as references

    * Default: `"Default"`

    * Optional: `"reasoning"`, `"agentic_rag"`, `"knowledge_cleaning"`, etc.

  * **`JSON_FILE`**: Data file (`.jsonl` format) used to test the operator.

    * Default: If left blank, the project's built-in test data `tests/test.jsonl` will be used.

  * **`OUTPUT_PATH`**: Save path for the generated Python code. If left blank, the code will only be printed to the console and no file will be saved.

**API and Debug Configuration**

  * **`CHAT_API_URL`**: URL of the LLM service

  * **`api_key`**: Access key (using the environment variable DF_API_KEY)

  * **`MODEL`**: Model name, default is gpt-4o

  * **`NEED_DEBUG`**: Whether to enable the automatic debugging loop (`True` / `False`)

    * `True`: If the generated code reports an error when running on `JSON_FILE`, the Agent will automatically analyze the error stack and attempt to rewrite the code

    * `False`: Generate and execute the code, then end immediately regardless of whether it runs successfully

  * **`MAX_DEBUG_ROUNDS`**: Maximum number of automatic repair attempts, default is 3 rounds

#### 2. Run the Script

After completing the configuration, execute the following command in the terminal:

```bash
python script/run_dfa_operator_write.py
```

#### 3. Result Output

During script execution, the following key information will be output:

* **[Match Operator Result]**: Displays the "reference operators" found by the Agent in the existing operator library

* **[Writer Result]**: Length of the generated code and its save location

* **[Execution Result]**: Code execution result

  * `Success: True`: Indicates the code was generated successfully and ran without errors on the test data.

  * `Success: False`: Indicates the run failed.

* **[Debug Runtime Preview]**: `stdout`/`stderr` captured during runtime, as well as the selected input field key name (`input_key`)

#### 4. Practical Case: Writing a Sentiment Analysis Operator

We have a log file `tests/test.jsonl` containing the field `"raw_content"`. We want to create an operator to perform sentiment analysis on the text content of this field.

**Configuration Example:**

```python
# ===== Example config (edit here) =====
# API KEY is passed in via the environment variable DF_API_KEY
CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
MODEL = os.getenv("DF_MODEL", "gpt-4o")
LANGUAGE = "en"

# 1. Define specific requirements
TARGET = "Create an operator for performing sentiment analysis on text"
CATEGORY = "Default"          
# 2. Specify the result save path
OUTPUT_PATH = "cache_local/my_operator.py"
# 3. Specify the test data path 
JSON_FILE = "tests/test.jsonl"
# 4. Enable debugging
NEED_DEBUG = True
MAX_DEBUG_ROUNDS = 10
```

**Run:**

After running the script, the terminal will output the following:

``` bash
==== Match Operator Result ====
Matched ops: ['LangkitSampleEvaluator', 'LexicalDiversitySampleEvaluator', 'PresidioSampleEvaluator', 'PerspectiveSampleEvaluator']

==== Writer Result ====
Code length: 3619
Saved to: cache_local/my_operator.py

==== Execution Result (instantiate) ====
Success: True

==== Debug Runtime Preview ==== 
input_key: raw_content
available_keys: ['raw_content']
[debug stdout]
 [selected_input_key] raw_content

[debug stderr]
Generating......: 100%|######### | 18/20 [00:08<00:00,  3.34it/s]
```

The generated code is saved to `script/cache_local/my_operator.py`. Open it to view the generated code:

``` python
from dataflow.core import OperatorABC
from dataflow.utils.registry import OPERATOR_REGISTRY
from dataflow.utils.storage import DataFlowStorage, FileStorage
from dataflow import get_logger
from dataflow.serving import APILLMServing_request
import pandas as pd

@OPERATOR_REGISTRY.register()
class SentimentAnalysisOperator(OperatorABC):
    def __init__(self, llm_serving=None):
        self.logger = get_logger()
        self.logger.info(f'Initializing {self.__class__.__name__}...')
        self.llm_serving = llm_serving
        self.score_name = 'SentimentScore'
        self.logger.info(f'{self.__class__.__name__} initialized.')

    @staticmethod
    def get_desc(lang: str = "zh"):
        if lang == "zh":
            return (
                "使用LLM进行文本情感分析，返回情感得分，得分越高表示情感越积极。\n"
                "输入参数：\n"
                "- llm_serving：LLM服务对象\n"
                "- input_key：输入文本字段名\n"
                "- output_key：输出得分字段名，默认'SentimentScore'\n"
                "输出参数：\n"
                "- 包含情感分析得分的DataFrame"
            )
        else:
            return (
                "Perform sentiment analysis on text using LLM, returning sentiment scores where higher scores indicate more positive sentiment.\n"
                "Input Parameters:\n"
                "- llm_serving: LLM serving object\n"
                "- input_key: Field name for input text\n"
                "- output_key: Field name for output score, default 'SentimentScore'\n"
                "Output Parameters:\n"
                "- DataFrame containing sentiment analysis scores"
            )

    def get_score(self, samples: list[dict], input_key: str) -> list[float]:
        texts = [sample.get(input_key, '') or '' for sample in samples]
        return self.llm_serving.generate_from_input(texts)

    def eval(self, dataframe: pd.DataFrame, input_key: str) -> list[float]:
        self.logger.info(f"Evaluating {self.score_name}...")
        samples = dataframe.to_dict(orient='records')
        scores = self.get_score(samples, input_key)
        self.logger.info("Evaluation complete!")
        return scores

    def run(self,
            storage: DataFlowStorage,
            input_key: str | None = None,
            output_key: str = 'SentimentScore'):
        dataframe = storage.read("dataframe")
        if input_key is None:
            input_key = self._auto_select_input_key(dataframe)
        dataframe[output_key] = self.eval(dataframe, input_key)
        storage.write(dataframe)

    def _auto_select_input_key(self, dataframe: pd.DataFrame) -> str:
        preferred_keys = ['raw_content', 'text', 'content', 'sentence', 'instruction', 'input', 'query', 'problem', 'prompt']
        for key in preferred_keys:
            if key in dataframe.columns and dataframe[key].notnull().any():
                return key
        return dataframe.columns[0]

# Runnable entry code

test_data_path = '/root/autodl-tmp/DataFlow-Agent/tests/test.jsonl'

# Initialize FileStorage
storage = FileStorage(first_entry_file_name=test_data_path, cache_path="./cache_local", file_name_prefix="dataflow_cache_step", cache_type="jsonl")
storage = storage.step()

# Initialize llm_serving
llm_serving = APILLMServing_request(api_url="http://123.129.219.111:3000/v1/chat/completions", key_name_of_api_key="DF_API_KEY", model_name="gpt-4o")

# Select input key
available_keys = ['raw_content']
preselected_input_key = 'raw_content'
input_key = preselected_input_key if preselected_input_key in available_keys else available_keys[0]
print(f"[selected_input_key] {input_key}")

# Instantiate and run the operator
operator = SentimentAnalysisOperator(llm_serving=llm_serving)
operator.run(storage=storage, input_key=input_key)
```

