---
title: AgenticRAGAtomicTaskGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/agentic_rag/generate/agenticragatomictaskgenerator/
---

## 📘 概述

[AgenticRAGAtomicTaskGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个原子任务生成算子，用于为提供的文本内容生成高质量且可验证的问题与答案。该算子通过多步推理和验证，将复杂的文档分解为独立的、可回答的原子任务（即问答对），适用于构建高质量的 RAG 数据集。

## \_\_init\_\_函数

```python
def __init__(self,
             llm_serving: LLMServingABC = None,
             data_num : int = 100,
             max_per_task: int = 10,
             max_question: int = 10,
             ):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行推理与生成。 |
| **data_num** | int | 100 | 预期处理的数据总量。 |
| **max_per_task** | int | 10 | 每个输入文档生成的候选任务（结论）的最大数量。 |
| **max_question** | int | 10 | 每个输入文档最终生成的问答对的最大数量。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(
    self,
    storage: DataFlowStorage,
    input_key: str = "prompts",
    output_question_key: str = "question",
    output_answer_key:str = "answer",
    output_refined_answer_key:str = "refined_answer",
    output_optional_answer_key: str = "optional_answer",
    output_llm_answer_key: str = "llm_answer",
    output_golden_doc_answer_key: str = "golden_doc_answer",
):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "prompts" | 输入列名，对应原始文档或文本内容字段。 |
| **output_question_key** | str | "question" | 输出列名，对应生成的问题字段。 |
| **output_answer_key** | str | "answer" | 输出列名，对应生成的初始答案字段。 |
| **output_refined_answer_key**| str | "refined_answer" | 输出列名，对应经过精炼和修正后的答案字段。 |
| **output_optional_answer_key**| str | "optional_answer" | 输出列名，对应生成的可选/替代答案字段。 |
| **output_llm_answer_key** | str | "llm_answer" | 输出列名，对应LLM自行推理生成的答案（用于验证）。 |
| **output_golden_doc_answer_key**| str | "golden_doc_answer" | 输出列名，对应从原始文档中提取的黄金标准答案。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| prompts | str | 输入的原始文本内容。 |
| question | str | 模型生成的原子化问题。 |
| answer | str | 模型生成的初始答案。 |
| refined_answer | str | 经过清洗和优化的最终答案。 |
| optional_answer | list | 一组可接受的备选答案。 |
| llm_answer | str | LLM在没有上下文的情况下对问题生成的答案，用于评估。 |
| golden_doc_answer | str | 基于原始文档生成的问题答案，用于评估。 |
