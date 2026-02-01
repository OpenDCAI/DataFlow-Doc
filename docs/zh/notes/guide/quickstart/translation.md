---
title: 案例1. 机器翻译/答案合成/缩写
createTime: 2025/06/30 19:19:16
permalink: /zh/guide/translation/
icon: basil:lightning-alt-outline
---

# 快速开始机器翻译,答案合成与缩写

## 机器翻译
### 第一步:安装dataflow环境
```shell
pip install open-dataflow
```
### 第二步:创建新的dataflow工作文件夹
```shell
mkdir run_dataflow
cd run_dataflow
```
### 第三步:初始化Dataflow
```shell
dataflow init
```
这时你会看见
```shell
run_dataflow/playground/prompted_generator/generate_qa_api.py  # (api模型)
run_dataflow/playground/prompted_generator/generate_qa_local.py  # (本地模型)
```
### 第四步(如果选择API翻译):填入你的api key以及api_url
对于Linux和Mac OS
```shell
export DF_API_KEY="sk-xxxxx"
```

对于Windows
```powershell
$env:DF_API_KEY = "sk-xxxxx"
```
generate_qa_api.py中的api_url填写方式如下：
```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=100
)
```

### 第四步:(如果选择本地模型翻译)
generate_qa_local.py本地模型填写方式如下：
```python
self.llm_serving = LocalModelLLMServing_vllm(
    hf_model_name_or_path="Qwen2.5-7B-Instruct", # set to your own model path
    vllm_tensor_parallel_size=1,
    vllm_max_tokens=8192,
)
```

### 第五步:准备需要翻译的数据
```jsonl
{"raw_content": "This paper presents work whose goal is to advance the field of Machine Learning. There are many potential societal consequences of our work, none which we feel must be specifically highlighted here."}
```
例如上边这种格式的数据并将数据路径填入
```python
self.storage = FileStorage(
    first_entry_file_name="your path",
    cache_path="./cache",
    file_name_prefix="raw_content",
    cache_type="jsonl",
)
```

### 第六步:准备翻译的 Prompt

使用如下配置即可完成翻译任务：

```python
self.prompt_generator = PromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt="Please translate to Chinese.",  # 翻译任务的系统提示词
)
```

## 答案合成任务

该任务与机器翻译类似，只需将执行脚本替换为以下之一：

```shell
generate_qa_api.py
generate_qa_local.py
```

核心修改点是替换 `system_prompt` 为适用于答案合成的提示语：

```python
self.prompt_generator = PromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt="Please solve this math problem.",  # 解答数学问题的系统提示词
)
```

## 缩写任务

该任务同样结构与翻译一致，仅需替换为对应脚本：

```shell
abbreviation_qa_api.py
abbreviation_qa_local.py
```

同时更改 `system_prompt` 为适用于摘要/缩写的提示语：

```python
self.prompt_generator = PromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt="Please rewrite the following paragraph into a concise summary that preserves the core meaning and key information:",  # 缩写任务的提示词
)
```

## 拓展功能支持

针对其他任务类型，只需按需调整 `system_prompt` 即可复用整个流程。

