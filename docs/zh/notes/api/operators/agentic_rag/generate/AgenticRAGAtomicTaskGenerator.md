---
title: AgenticRAGAtomicTaskGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/agentic_rag/generate/agenticragatomictaskgenerator/
---

## 📘 概述

[AgenticRAGAtomicTaskGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个原子任务生成算子，用于为提供的文本内容生成高质量且可验证的问题与答案。该算子通过多步推理和验证，将复杂的文档分解为独立的、可回答的原子任务（即问答对），适用于构建高质量的 RAG 数据集。

## `__init__`函数

```python
def __init__(self,
             llm_serving: LLMServingABC = None,
             data_num : int = 100,
             max_per_task: int = 10,
             max_question: int = 10,
             ):
```



| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行推理与生成。 |
| **data_num** | int | 100 | 预期处理的数据总量。 |
| **max_per_task** | int | 10 | 每个输入文档生成的候选任务（结论）的最大数量。 |
| **max_question** | int | 10 | 每个输入文档最终生成的问答对的最大数量。 |

### Prompt模板说明
该算子不使用提示模板，因为它直接基于输入内容生成和处理问答对，无需中间提示模板。

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
```python
from dataflow.operators.agentic_rag.generate.agenticrag_atomic_task_generator import AgenticRAGAtomicTaskGenerator
from dataflow.utils.storage import DataFlowStorage

# 初始化算子
generator = AgenticRAGAtomicTaskGenerator(
    llm_serving=your_llm_serving_instance,
    data_num=50,
    max_per_task=5,
    max_question=5
)

# 运行算子
storage = DataFlowStorage()
generator.run(
    storage=storage,
    input_key="prompts",
    output_question_key="question",
    output_answer_key="answer",
    output_refined_answer_key="refined_answer",
    output_optional_answer_key="optional_answer",
    output_llm_answer_key="llm_answer",
    output_golden_doc_answer_key="golden_doc_answer"
)
```

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
| identifier | str | 从输入文本中提取的内容标识符。 |
| candidate_tasks_str | str | 包含候选任务和结论的JSON字符串。 |
| llm_score | int | LLM生成答案的质量分数。 |
| golden_doc_score | int | 黄金文档答案的质量分数。 |

**示例输入：**

```json
{
  "prompts": "说明量子力学的核心概念。"
}
```

**示例输出：**

```json
{
  "prompts": "说明量子力学的核心概念。",
  "question": "什么是量子力学中的不确定性原理？",
  "answer": "不确定性原理指出，一些物理属性（如位置和动量）不能同时被任意精确地测量。",
  "refined_answer": "海森堡不确定性原理认为：在量子力学中，不可能同时以任意高的精度确定粒子的位置和动量。",
  "optional_answer": [
    "位置越精确，动量就越不精确，反之亦然。",
    "量子力学中用于表达某些物理量测量极限的基本法则。"
  ],
  "llm_answer": "不确定性原理表示：我们越准确地了解粒子的位置，对其动量的了解就越不确定。",
  "golden_doc_answer": "不确定性原理由海森堡提出，是量子力学中的基本理论，描述了对某些物理变量的测量存在极限。",
  "identifier": "量子力学核心概念",
  "candidate_tasks_str": "[{\"question\": \"什么是量子力学中的不确定性原理？\", \"conclusion\": \"共轭变量测量的极限。\"}, {\"question\": \"什么是量子叠加态？\", \"conclusion\": \"粒子在被观测前可处于多个状态的叠加。\"}]",
  "llm_score": 5,
  "golden_doc_score": 5
}
```
