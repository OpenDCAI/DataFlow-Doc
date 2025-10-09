---
title: Phi4QAGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/generate/phi4qagenerator/
---

## 📘 概述

[Phi4QAGenerator]() 是一个基于给定文档内容生成多轮对话问答数据的算子。其主要功能是将原始的、非结构化的文档内容转换为适合大语言模型（LLM）预训练的对话格式数据，从而扩充高质量的训练语料。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC)
```

| 参数名 | 类型 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
|---|---|---|---|
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "generated_content")
```

| 名称 | 类型 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "raw_content" | 输入列名，对应原始文档内容字段。 |
| **output_key** | str | "generated_content" | 输出列名，对应生成的对话内容字段。 |

## 🧠 示例用法

```python
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| raw_content | str | 输入的原始文档内容。 |
| generated_content | str | 模型生成的多轮对话格式内容。 |
