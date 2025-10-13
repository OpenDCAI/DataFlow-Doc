---
title: KBCTextCleanerBatch
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/kbctextcleanerbatch/
---

## 📘 概述

[KBCTextCleanerBatch](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个知识清洗算子，用于对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化，以提升RAG知识库的质量。

## \_\_init\_\_函数

```python
def __init__(self, llm_serving: LLMServingABC, lang="en", prompt_template = None)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **lang** | str | "en" | 指定提示词语言，支持 "zh" (中文) 和 "en" (英文)。 |
| **prompt_template** | PromptABC | None | 提示词模板对象，用于构建清洗指令。若不指定，则使用内置的 `KnowledgeCleanerPrompt`。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(storage, input_key="chunk_path", output_key="cleaned_chunk_path")
```

执行算子主逻辑，从存储中读取输入 DataFrame，对指定路径的文件内容进行清洗，并将结果写回原文件。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "chunk_path" | 输入列名，对应待清洗知识文件路径的字段。 |
| **output_key** | str | "cleaned_chunk_path" | 输出列名，对应已清洗知识文件路径的字段。 |

## 🧠 示例用法
