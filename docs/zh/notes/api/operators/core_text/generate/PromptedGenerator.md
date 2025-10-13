---
title: PromptedGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/generate/promptedgenerator/
---

## 📘 概述

`PromptedGenerator` 是一个通用的提示词生成算子，它结合用户提供的系统提示词（system prompt）和具体输入内容，调用大语言模型（LLM）生成相应的文本输出。该算子灵活性高，可用于各种需要定制化提示词的文本生成任务。

## `__init__`函数

```python
def __init__(self, 
            llm_serving: LLMServingABC, 
            system_prompt: str = "You are a helpful agent.",
            json_schema: dict = None,
            )
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **system_prompt** | str | "You are a helpful agent." | 系统提示词，用于定义大语言模型的行为或角色。 |
| **json_schema** | dict | None | （可选）一个JSON schema字典，用于指定LLM输出的格式。 |

### Prompt模板说明

该算子不使用固定的 Prompt 模板，而是通过 `system_prompt` 参数和 `run` 函数中 `input_key` 对应的内容直接组合成最终的提示词。

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "generated_content")
```

执行算子主逻辑，从存储中读取输入 DataFrame，将 `system_prompt` 与输入内容结合后调用 LLM 生成结果，并将结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "raw_content" | 输入列名，该列的内容将作为用户输入提供给 LLM。 |
| **output_key** | str | "generated_content" | 输出列名，用于存储 LLM 生成的内容。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| raw_content | str | 输入的原始文本内容。 |
| generated_content | str | 模型生成的文本。 |

示例输入：
```json
{
"raw_content":"写一句关于秋天的诗"
}
```
示例输出：
```json
{
"raw_content":"写一句关于秋天的诗",
"generated_content":"落叶知秋，微风徐来，所有美好不期而至。"
}
```
