---
title: DataFlow-Agent
icon: material-symbols:robot-2-outline
createTime: 2025/06/25 15:56:00
permalink: /en/guide/agent/agent_for_dataflow_new/
---

## DataFlow-Agent Overview

DataFlow-Agent is a multi-agent collaborative automated task processing system. The workflow includes task decomposition, tool registration, task scheduling, execution verification, and report generation. It is suitable for multi-step scenarios such as data governance and automated analysis.

🛠️ **Automated Data Governance Pipeline Orchestration**: One-click generation and debugging of data governance workflows to achieve pipeline automation;

⚡ **Automated Operator Generation**: Fully automatic generation, registration, and invocation of data processing operators—no manual coding required;

🔗 **Custom Task Chains, Flexible Process Definition**: Users can freely combine task nodes as needed to build customized data governance workflows;

## Core Features of DataFlow-Agent

### NL2Pipeline

**Function Description:**

- Through multi-turn dialogue, the Agent can gradually understand the user's true intentions and determine whether a data governance pipeline recommendation is needed.
- After the recommendation is completed, the user can choose whether to automatically execute the pipeline. The framework supports automatic debugging of the pipeline and can automatically repair it in case of errors.

**Main Features:**

- One-click execution supported;
- Self-driven debugging and self-healing until the retry limit is reached;

**Usage Example:**

```shell
export DF_API_KEY=sk-
export DF_API_URL=https://api.

dataflow init
cd dataflow_agent
python run_dataflow_agent_with_console.py recommend
```

Users can customize parameters:

```python
    pipeline_recommand_params = {
        "json_file": f"{DATAFLOW_DIR}/dataflow/example/ReasoningPipeline/pipeline_math_short.json",
        "py_path": f"{DATAFLOW_DIR}/test/recommend_pipeline.py",
        "api_key": api_key,
        "chat_api_url": chat_api_url,
        "execute_the_pipeline": False,
        "use_local_model": True,
        "local_model_name_or_path": "/mnt/public/model/huggingface/Qwen2.5-7B-Instruct",
        "timeout": 3600,
        "max_debug_round": 5
    }
    
    if len(sys.argv) == 2 and sys.argv[1] == "recommend":
        test_req = ChatAgentRequest(
            language="en",
            target="Please recommend a pipeline for my data! No deduplication operator needed!",
            model="deepseek-v3",
            sessionKEY="dataflow_demo",
            **pipeline_recommand_params
        )
```

**Parameter Explanation:**

| Parameter Name             | Type | Meaning                                                        |
| :-------------------------- | :---- | :-------------------------------------------------------------- |
| json_file                  | str  | Path to the JSON/JSONL file of the **data** to be processed.   |
| py_path                    | str  | Path to save the **generated pipeline code file**.             |
| api_key                    | str  | API Key for communicating with backend LLM services or third-party services. |
| chat_api_url               | str  | API address for communicating with the LLM service.            |
| execute_the_pipeline       | bool | Whether to actually execute the recommended pipeline. **False means only recommend, not execute.** |
| use_local_model            | bool | Whether to use local model inference (**True** means use local Huggingface model, not remote LLM). |
| local_model_name_or_path   | str  | Name or path of the local model (here is the local path of Qwen2.5-7B-Instruct). |
| timeout                    | int  | Execution timeout duration (seconds), e.g., 3600 seconds = 1 hour. |
| max_debug_round            | int  | Max number of debug rounds, **the maximum number of debugging attempts allowed when executing and debugging the pipeline.** |
| language                   | str  | Language used in the session or request (e.g., `"en"` for English, `"zh"` for Chinese). |
| target                     | str  | Specific task description the user wants the Agent to complete, i.e., the user's requirement or instruction. |
| model                      | str  | Name of the model used to process the request (e.g., `"deepseek-v3"`), determines which LLM is used for inference. |
| sessionKEY                 | str  | Unique identifier for the current session, used to track and distinguish the context of different users or tasks (e.g., `"dataflow_demo"`). |

### NL2Operator

**Function Description:**

- Through multi-turn dialogue, the Agent can gradually understand the user's true intentions and determine whether to write an operator that conforms to the DataFlow style.
- After the operator is written, the user can choose whether to test the operator’s functionality individually. The framework supports automatic debugging of pipelines and operators, and can automatically repair in case of errors.

**Main Features:**

- Supports independent operator testing;
- Self-driven debugging and self-healing until the retry limit is reached;

**Usage Example:**

```shell
export DF_API_KEY=sk-
export DF_API_URL=https://api.

dataflow init
cd dataflow_agent
python run_dataflow_agent_with_console.py write
```

Users can customize parameters:

```python
    operator_write_params = {
        "json_file": f"{DATAFLOW_DIR}/dataflow/example/ReasoningPipeline/pipeline_math_short.json",
        "py_path": f"{DATAFLOW_DIR}/test/operator_transEN.py",
        "api_key": api_key,
        "chat_api_url": chat_api_url,
        "execute_the_operator": False,
        "use_local_model": True,
        "local_model_name_or_path": "/mnt/public/model/huggingface/Qwen2.5-7B-Instruct",
        "timeout": 3600,
        "max_debug_round": 5
    }
    
    if len(sys.argv) == 2 and sys.argv[1] == "write":
        test_req = ChatAgentRequest(
            language="en",
            target="I need an operator using llm_serving, implementing language translation, translating English to Chinese!",
            model="deepseek-v3",
            sessionKEY="dataflow_demo",
            ** operator_write_params
        )
```

**Parameter Explanation:**

| Parameter Name             | Type | Meaning                                                        |
| :-------------------------- | :---- | :-------------------------------------------------------------- |
| json_file                  | str  | Path to the JSON/JSONL file of the **data** to be processed.   |
| py_path                    | str  | Path to save the **generated operator code file**.             |
| api_key                    | str  | API Key for communicating with backend LLM services or third-party services. |
| chat_api_url               | str  | API address for communicating with the LLM service.            |
| execute_the_operator       | bool | Whether to actually execute the generated operator. **False means only generate code, not execute.** |
| use_local_model            | bool | Whether to use local model inference (**True** means use local Huggingface model, not remote LLM). |
| local_model_name_or_path   | str  | Name or path of the local model (e.g., local path of Qwen2.5-7B-Instruct). |
| timeout                    | int  | Execution timeout duration (seconds), e.g., 3600 seconds = 1 hour. |
| max_debug_round            | int  | Max number of debug rounds, maximum number of debugging attempts allowed when executing and debugging the operator. |
| language                   | str  | Language used in the session or request (e.g., `"en"` for English, `"zh"` for Chinese). |
| target                     | str  | Specific task description the user wants the Agent to complete, i.e., the user's requirement or instruction. |
| model                      | str  | Name of the model used to process the request (e.g., `"deepseek-v3"`), determines which LLM is used for inference. |
| sessionKEY                 | str  | Unique identifier for the current session, used to track and distinguish the context of different users or tasks (e.g., `"dataflow_demo"`). |

## Task Chain Settings

Under the DataFlow-Agent framework, in order to enable users to use operator orchestration and operator writing functions more stably and efficiently, we have pre-set 7 core tasks.

| Task Name          | Main Function Description                                   | Main Tools                                                    |
| :------------------ | :---------------------------------------------------------- | :------------------------------------------------------------ |
| router:railway_car:| Dialogue routing: analyzes and determines the user's current intent and assigns the request to the appropriate processing workflow. | `local_tool_for_get_chat_history`: Get chat history           |
|                    |                                                            | `local_tool_for_get_chat_target`: Get user's target           |
| classify:cake:     | Data content classification: identifies and classifies the type of data the user inputs. | `local_tool_for_sample`: Sample data                          |
|                    |                                                            | `local_tool_for_get_categories`: Classify data                |
| rec:radio:         | Recommend reasoning pipeline: recommends suitable data processing pipelines based on classification results and user needs. | `local_tool_for_sample`: Sample data                          |
|                    |                                                            | `local_tool_for_get_operator_content_map_from_all_operators`: Operator mapping, find available operators |
|                    |                                                            | `local_tool_for_get_purpose`: Get user intention              |
| exe:earth_africa:  | Execute recommended pipeline: executes the recommended data processing pipeline and returns results. | `local_tool_for_execute_the_recommended_pipeline`: Execute and debug the recommended pipeline |
| op_match:ocean:    | Match operator: matches existing operators (functional components) according to user needs. | `local_tool_for_get_operator_content`: Get operator information |
| op_write:octopus:  | Write operator: refers to matched operators and automatically generates new operator code that meets the requirements. | `local_tool_for_get_match_operator_code`: Get operator source code |
|                    |                                                            | `local_tool_for_get_purpose`: Get user intention              |
| op_debug:on:       | Debug operator: automatically executes and debugs operators, discovers and fixes potential problems. | `local_tool_for_debug_and_exe_operator`: Execute and debug operator |

## How to Customize Tasks

The DataFlow-Agent framework supports custom tasks. If you feel that the preset tasks cannot meet your needs, you can customize task chains. Here we use **`op_match`** as an example:

### 1. Register Task

In `/agentrole/taskcenter/task_definitions.py`, **initialize the task**:

```python
@TaskRegistry.register('match_operator')
def _make_match_operator(prompts_template,request):
    return Task(
        request           = request,
        config_path       = f"{yaml_dir}/TaskInfo.yaml",  
        prompts_template  = prompts_template,
        system_template   = "system_prompt_for_match_operator",
        task_template     = "task_prompt_for_match_operator",
        param_funcs       = {
            "get_operator_content": local_tool_for_get_operator_content
        },
        is_result_process = False,   
        use_pre_task_result = False, 
        task_name         = "match_operator"
    )
```

| Parameter Name         | Type   | Meaning                                                        |
| :---------------------- | :------ | :-------------------------------------------------------------- |
| request               | object | Current request object, contains user input, context, etc.      |
| config_path           | str    | Path to the configuration file, **specifies the location of the YAML config file required by the task.** |
| prompts_template      | object | Prompt template object, used to generate system and task-related prompts. |
| system_template       | str    | System prompt template name, used to specify the template for system-level prompts. |
| task_template         | str    | Task prompt template name, used to specify the template for current task prompts. |
| param_funcs           | dict   | Dictionary of tool functions, provides parameter processing functions needed for task execution. Here is `{ "get_operator_content": local_tool_for_get_operator_content }`, **used to get available operator content.** |
| is_result_process     | bool   | Whether to post-process the task result. `False` means no post-processing. |
| use_pre_task_result   | bool   | Whether to use the result of the previous task as input. `False` means not to use it. |
| task_name             | str    | Task name, here is `"match_operator"`.                          |

After defining, you can get the **task instance** as follows:

```python
op_match = TaskRegistry.get("match_operator",prompts_template=tmpl, request = req)
```

### 2. Tool Implementation

In the above **`param_funcs`**, we define the tools required for the task. These tools are all self-implemented, and are uniformly named with the prefix **local_tool_**. Each task tool function can accept three default parameters and additional custom parameters.

**Default parameters include:**

| Parameter Name                | Type   | Description                                                  |
| :----------------------------- | :------ | :------------------------------------------------------------ |
| request:rainbow:              | object | The current task's request object, **including user input and context parameters.** |
| pre_task_result:panda_face:   | any    | Result of the preceding task, **facilitates data flow between tasks.** |
| memory:melon:                 | any    | Temporary storage or shared memory during task execution, **stores all chat history and task result information.** |

**Additional custom parameters:** In the configuration file `DataFlow/dataflow/agent/taskcenter/resources/TaskInfo.yaml`, you can define extra details the task needs, especially additional parameters required by tools:

```yaml
match_operator:
  tools:
  	local_tool_for_get_operator_content:
      data_key: 
        ContentSubType: MIXTURE
      keep_keys: [name, type, description]
```

### 3. Prompt Writing

According to the defined task prompts, write them in **`/promptstemplates/resources/template.json`**, such as in the **example task**:

```json
{
    "system_prompt_for_match_operator": "You must strictly follow the user's requirements. Based on the operator content and intended use provided, select the Four most similar operator names from the operator library and output the results only in the specified JSON format. Do not output any extra content, comments, or additional keys. Regardless of whether there is an exact match, you must output two operator names.",
    "task_prompt_for_match_operator": "[ROLE] You are an expert in data operator retrieval. [TASK] Based on the provided operator content {get_operator_content} and user requirement {purpose}, find the Four most similar operator names from the operator library and provide your reasoning. [INPUT FORMAT] The input includes: - Operator content (get_operator_content) - User requirement (purpose). [OUTPUT RULES] 1. Strictly return the content in the JSON structure shown below. Do not include any extra content, comments, or new keys. 2. You must output two operator names under all circumstances. JSON output example: { \"match_operators\": [ \"OperatorName1\", \"OperatorName2\", \"OperatorName3\", \"OperatorName4\" ], \"reason\": xxx }"
}
```
:bangbang: **It is especially important to note that we must clearly specify the interaction format between tasks, that is, the naming and meaning of each field (key) in the JSON data returned by each task. This not only helps upstream and downstream tasks accurately parse and use results but also ensures the stability and scalability of the entire task chain.**
