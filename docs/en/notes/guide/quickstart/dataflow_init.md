---
title: Quick Start – dataflow init
createTime: 2025/06/30 19:19:16
permalink: /en/guide/dataflow_init/
icon: solar:flag-2-broken
---

# Quick Start

## Code-Generation-Based Workflow

DataFlow follows a **code generation + customization + script execution** workflow, similar to  
[`create-react-app`](https://github.com/facebook/create-react-app) / [`vue-cli`](https://cli.vuejs.org/).

By invoking a CLI command, DataFlow automatically generates default runtime scripts and entry Python files. After user customization (e.g., changing datasets, switching LLM APIs, or reordering operators), you simply run the Python script to execute the desired functionality.

You only need **three steps** to run the SoTA Pipelines we provide.

---

## 1. Initialize a Project

In an **empty directory**, run:

```bash
dataflow init
````

This will generate the following directories in your working path:

```bash
$ tree -L 1
.
|-- api_pipelines
|-- core_text
|-- cpu_pipelines
|-- example_data
|-- gpu_pipelines
|-- playground
`-- simple_text_pipelines
```

**Directory overview:**

* `cpu_pipelines`: Pipelines that run using CPU only
* `core_text`: Examples of the most fundamental DataFlow operators
* `api_pipelines`: Pipelines that use online LLM APIs (**recommended for beginners**)
* `gpu_pipelines`: Pipelines that use locally deployed GPU models
* `example_data`: Default input datasets for all example pipelines
* `playground`: Lightweight examples that do not form full pipelines
* `simple_text_pipelines`: Simple text-processing pipeline examples

---

## 2. Pipeline Categories (Choose One)

Pipelines with the same name across different directories follow an **inclusive relationship**:

| Directory         | Required Resources    |
| ----------------- | --------------------- |
| `cpu_pipelines` | CPU only              |
| `api_pipelines` | CPU + LLM API         |
| `gpu_pipelines` | CPU + API + Local GPU |

> **Recommendation for beginners:** start directly with `api_pipelines`.

If you later have access to a GPU, you can simply replace the `LLMServing` with a local model.

---

## 3. Run Your First Pipeline

Enter any pipeline directory, for example:

```bash
cd api_pipelines
```

Open one of the Python files. In most cases, you only need to care about two configurations:

### (1) Input Dataset Path

```python
self.storage = FileStorage(
    first_entry_file_name="<path_to_dataset>"
)
```

By default, this points to the example dataset we provide and can be run directly.
You may change it to your own dataset path to process your own data.

---

### (2) LLM Serving

If you are using an API-based LLM, you need to set an environment variable first:

**Linux / macOS**

```bash
export DF_API_KEY=sk-xxxxx
```

**Windows CMD**

```cmd
set DF_API_KEY=sk-xxxxx
```

**PowerShell**

```powershell
$env:DF_API_KEY="sk-xxxxx"
```

Then simply run the script:

```bash
python xxx_pipeline.py
```

---

## 4. Multiple API Servings (Optional)

If you need to use multiple LLM APIs at the same time, you can assign a different environment variable name to each serving instance:

```python
llm_serving_openai = APILLMServing_request(
    api_url="https://api.openai.com/v1/chat/completions",
    key_name_of_api_key="OPENAI_API_KEY",
    model_name="gpt-4o"
)

llm_serving_deepseek = APILLMServing_request(
    api_url="https://api.deepseek.com/v1/chat/completions",
    key_name_of_api_key="DEEPSEEK_API_KEY",
    model_name="deepseek-chat"
)
```

Then define the corresponding environment variables (e.g., `OPENAI_API_KEY=sk-xxxxx`) to enable multiple API serv­ings to coexist.

```

```
