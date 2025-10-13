---
title: PromptedVQAGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_vision/generate/promptedvqagenerator/
---

## 📘 概述

`PromptedVQAGenerator` 是一个视觉问答（VQA）生成算子，用于根据输入的图像和问题，调用大语言模型（LLM）生成相应的回答。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "You are a helpful assistant."):
```

### init参数说明

| 参数名          | 类型            | 默认值                             | 说明                                   |
| :-------------- | :-------------- | :--------------------------------- | :------------------------------------- |
| **llm_serving** | LLMServingABC   | 必需                               | 大语言模型服务实例，用于执行推理与生成。 |
| **system_prompt** | str             | "You are a helpful assistant."     | 系统提示词，用于指导和定义模型的行为。   |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --------------- | -------- | -------- | -------- |
|                 |          |          |          |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "generated_content")
```

#### 参数

| 名称         | 类型            | 默认值                | 说明                               |
| :----------- | :-------------- | :-------------------- | :--------------------------------- |
| **storage**  | DataFlowStorage | 必需                  | 数据流存储实例，负责读取与写入数据。 |
| **input_key**  | str             | "raw_content"         | 输入列名，对应包含图像和问题的字段。 |
| **output_key** | str             | "generated_content"   | 输出列名，对应生成答案的字段。       |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段                | 类型 | 说明                                             |
| :------------------ | :--- | :----------------------------------------------- |
| `raw_content`       | str  | 输入的原始内容，通常包含图像和问题信息。         |
| `generated_content` | str  | 模型生成的回答文本。                             |

示例输入：

```json
{
  "raw_content": "[{'type': 'image', 'value': 'path/to/your/image.jpg'}, {'type': 'text', 'value': '图中有什么？'}]"
}
```

示例输出：

```json
{
  "raw_content": "[{'type': 'image', 'value': 'path/to/your/image.jpg'}, {'type': 'text', 'value': '图中有什么？'}]",
  "generated_content": "图中有一只猫正坐在一张沙发上。"
}
```
