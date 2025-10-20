---
title: Text2QAGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/generate/text2qagenerator/
---

## 📘 概述

[Text2QAGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个基于大语言模型（LLM）的问答对生成算子。它接收包含文档片段的输入，并自动生成具体的问题（Question）和答案（Answer）对。该算子首先会根据输入文本生成用于指导提问的提示词，然后再利用这些提示词和原文生成最终的QA对。

## `__init__`函数

```python
def __init__(self,
             llm_serving: LLMServingABC
             ):
```

### init参数说明

| 参数名          | 类型          | 默认值 | 说明                           |
| :-------------- | :------------ | :----- | :----------------------------- |
| **llm_serving** | LLMServingABC | 必需   | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --------------- | -------- | -------- | -------- |
|                 |          |          |          |
|                 |          |          |          |

## `run`函数

```python
def run(
    self,
    storage: DataFlowStorage,
    input_key:str = "text",
    input_question_num:int = 1,
    output_prompt_key:str = "generated_prompt",
    output_quesion_key:str = "generated_question",
    output_answer_key:str = "generated_answer"
    ):
```

#### 参数

| 名称                   | 类型              | 默认值               | 说明                                     |
| :--------------------- | :---------------- | :------------------- | :--------------------------------------- |
| **storage**            | DataFlowStorage   | 必需                 | 数据流存储实例，负责读取与写入数据。       |
| **input_key**          | str               | "text"               | 输入列名，对应包含文档片段的字段。       |
| **input_question_num** | int               | 1                    | 每个文档片段需要生成的问题数量。         |
| **output_prompt_key**  | str               | "generated_prompt"   | 输出列名，对应中间生成的提问提示词字段。 |
| **output_quesion_key** | str               | "generated_question" | 输出列名，对应生成的问题字段。           |
| **output_answer_key**  | str               | "generated_answer"   | 输出列名，对应生成的答案字段。           |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

| 字段                 | 类型 | 说明                   |
| :------------------- | :--- | :--------------------- |
| (input_key)          | str  | 输入的文档文本（保留）。 |
| generated_prompt   | str  | 中间生成的提问提示词。 |
| generated_question | str  | 模型生成的问题。       |
| generated_answer   | str  | 模型生成的答案。       |
