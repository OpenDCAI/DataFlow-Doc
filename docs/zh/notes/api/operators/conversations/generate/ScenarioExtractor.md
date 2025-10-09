---
title: ScenarioExtractor
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/scenarioextractor/
---

好的，这是根据您提供的代码和模板生成的 `ScenarioExtractor` 算子的教程 Markdown 代码。

***

## 📘 概述

`ScenarioExtractor` 是一个场景提取算子，用于从对话内容中提取场景信息。它利用大语言模型（LLM）服务对对话进行分析，并生成相应的场景描述。

## __init__函数

```python
def __init__(self, llm_serving: LLMServingABC):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行分析与生成。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_chat_key: str, output_key: str = "scenario"):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_chat_key** | str | 必需 | 输入列名，对应对话内容字段。 |
| **output_key** | str | "scenario" | 输出列名，对应生成的场景字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| {input_chat_key} | str | 输入的对话内容文本。 |
| {output_key} | str | 模型提取的场景描述。 |
