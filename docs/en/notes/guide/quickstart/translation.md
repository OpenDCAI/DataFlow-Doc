---
title: Case 1. Translation/QA Generation/Abbreviation
createTime: 2025/06/30 19:19:16
permalink: /en/guide/translation/
icon: basil:lightning-alt-outline
---

# Easy Translation

### Step 1: Install the Dataflow Environment
```bash
pip install open-dataflow
```

### Step 2: Create a New Dataflow Working Directory
```bash
mkdir run_dataflow
cd run_dataflow
```

### Step 3: Initialize Dataflow
```bash
dataflow init
```
After this step, you should see:
```shell
run_dataflow/playground/generate_qa_api.py  # (api LLM)
run_dataflow/playground/generate_qa_local.py  # (local LLM)
```

### Step 4: (API Translation Option) Set Your API Key and API URL
For Linux/ Mac OS
```bash
export DF_API_KEY="sk-xxxxx"
```

For Windows
```powershell
$env:DF_API_KEY = "sk-xxxxx"
```

Configure the `api_url` as shown below:
```python
self.llm_serving = APILLMServing_request(
    api_url="https://api.openai.com/v1/chat/completions",
    model_name="gpt-4o",
    max_workers=100
)
```

### Step 4: (Local Model Translation Option).
For local models, use the following configuration:
```python
self.llm_serving = LocalModelLLMServing_vllm(
    hf_model_name_or_path="Qwen2.5-7B-Instruct",  # set to your own model path
    vllm_tensor_parallel_size=1,
    vllm_max_tokens=8192,
)
```

### Step 5: Prepare the Data to Be Translated
Create a `.jsonl` file with the following format:
```jsonl
{"raw_content": "This paper presents work whose goal is to advance the field of Machine Learning. There are many potential societal consequences of our work, none which we feel must be specifically highlighted here."}
```

Then specify the file path in your configuration:
```python
self.storage = FileStorage(
    first_entry_file_name="your path",
    cache_path="./cache",
    file_name_prefix="raw_content",
    cache_type="jsonl",
)
```

---

### Step 6: Preparing the Prompt for Translation

Use the following configuration for translation tasks:

```python
self.prompt_generator = PromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt="Please translate to Chinese.",  # System prompt for translation
)
```

## Answer Generation Task

This task is similar to machine translation. Simply replace the script with one of the following:

```shell
generate_qa_api.py
generate_qa_local.py
```

The key change is to replace the `system_prompt` with one suitable for answer generation:

```python
self.prompt_generator = PromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt="Please solve this math problem.",  # Prompt for solving math problems
)
```

## Abbreviation Task

The abbreviation task follows the same structure. Just switch to the corresponding script:

```shell
abbreviation_qa_api.py
abbreviation_qa_local.py
```

And update the `system_prompt` to one designed for summarization:

```python
self.prompt_generator = PromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt="Please rewrite the following paragraph into a concise summary that preserves the core meaning and key information:",  # Prompt for abbreviation
)
```

## Supporting Other Tasks

To support additional task types, simply adjust the `system_prompt` accordingly while keeping the rest of the workflow unchanged.
