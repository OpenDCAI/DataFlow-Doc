---
title: PromptedEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/eval/promptedevaluator/
---

## 📘 概述

[PromptedEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个评估算子，它使用大语言模型（LLM）根据给定的系统提示词（system prompt）对数据质量进行评分，并将评分结果作为新的一列写回数据中。该算子期望模型只输出一个1到5之间的整数分数。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "Please evaluate the quality of this data on a scale from 1 to 5."):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行评分。 |
| **system_prompt** | str | "Please evaluate the quality of this data on a scale from 1 to 5." | 用于指导LLM进行评分的系统提示词。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "eval"):
```
执行算子主逻辑，从存储中读取输入 DataFrame，生成 LLM 基于prompt的评分结果，并将结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "raw_content" | 输入列名，对应待评估的文本字段。 |
| **output_key** | str | "eval" | 输出列名，对应生成的评分字段。 |

## 🧠 示例用法

```python
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| raw_content | str | 输入的待评估文本。 |
| eval | int | 模型生成的评分（1-5，若解析失败则为0）。 |

示例输入：

```json
{
"raw_content":"This is a test sentence for evaluation."
}
```

示例输出：

```json
{
"raw_content":"This is a test sentence for evaluation.",
"eval": 4
}
```
