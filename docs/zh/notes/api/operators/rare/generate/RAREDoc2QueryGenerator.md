---
title: RAREDoc2QueryGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/rare/generate/raredoc2querygenerator/
---

好的，这是根据您提供的代码和模板生成的 `RAREDoc2QueryGenerator` 算子的教程 Markdown。

---

## 📘 概述

[RAREDoc2QueryGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个文档到问题（Doc2Query）的生成算子，它利用大语言模型（LLM）为给定的文档片段生成具有推理深度的问题。该算子能够自动为输入文本构建相应的情景（scenario）和问题（question），丰富数据集的推理维度。

## __init__函数

```python
def __init__(self, llm_serving: LLMServingABC):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str = "text", output_question_key: str = "question", output_scenario_key: str = "scenario", max_attempts: int = 3):
```

执行算子主逻辑，从存储中读取包含文档的数据，为每篇文档生成一个推理密集型问题和一个相关情景，并将结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "text" | 输入列名，对应文档内容字段。 |
| **output_question_key** | str | "question" | 输出列名，对应生成的问题字段。 |
| **output_scenario_key** | str | "scenario" | 输出列名，对应生成的情景字段。 |
| **max_attempts** | int | 3 | 当解析LLM返回结果失败时的最大重试次数。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| text | str | 输入的文档文本。 |
| question | str | 模型生成的推理密集型问题。 |
| scenario | str | 模型生成的与问题相关的情景。 |

**示例输入：**

```json
{
"text":"The sun is a star, the central body of the solar system. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process. It is by far the most important source of energy for life on Earth."
}
```

**示例输出：**

```json
{
"text":"The sun is a star, the central body of the solar system. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process. It is by far the most important source of energy for life on Earth.",
"question": "If the sun's dynamo process were to suddenly cease, what would be the immediate and long-term consequences for its magnetic field and the subsequent impact on Earth's environment, assuming all other solar functions remain constant?",
"scenario": "A group of astrophysicists is running a simulation to understand the critical functions of a star. They decide to model a scenario where the internal convective motion of a sun-like star is artificially halted."
}
```
