---
title: Text2QASampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/eval/text2qasampleevaluator/
---

## 📘 概述
`Text2QASampleEvaluator` 是一个用于评估生成的问答（QA）对质量的算子。它会根据多个维度（如问题质量、答案对齐度、答案可验证性和下游价值）对输入的QA对进行打分，并提供具体的反馈。该算子通过调用大语言模型（LLM）来自动执行评估任务。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行评估。 |

### Prompt模板说明

## run函数
```python
def run(
    self,
    storage: DataFlowStorage,
    input_question_key: str = "generated_question",
    input_answer_key: str = "generated_answer",
    output_question_quality_key: str = "question_quality_grades",
    output_question_quality_feedback_key: str = "question_quality_feedbacks",
    output_answer_alignment_key: str = "answer_alignment_grades",
    output_answer_alignment_feedback_key: str = "answer_alignment_feedbacks",
    output_answer_verifiability_key: str = "answer_verifiability_grades",
    output_answer_verifiability_feedback_key: str = "answer_verifiability_feedbacks",
    output_downstream_value_key: str = "downstream_value_grades",
    output_downstream_value_feedback_key: str = "downstream_value_feedbacks"
)
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_question_key** | str | "generated_question" | 输入列名，包含生成的问题。 |
| **input_answer_key** | str | "generated_answer" | 输入列名，包含生成的答案。 |
| **output_question_quality_key** | str | "question_quality_grades" | 输出列名，用于存储问题质量评分。 |
| **output_question_quality_feedback_key** | str | "question_quality_feedbacks" | 输出列名，用于存储问题质量反馈。 |
| **output_answer_alignment_key** | str | "answer_alignment_grades" | 输出列名，用于存储答案对齐度评分。 |
| **output_answer_alignment_feedback_key** | str | "answer_alignment_feedbacks" | 输出列名，用于存储答案对齐度反馈。 |
| **output_answer_verifiability_key** | str | "answer_verifiability_grades" | 输出列名，用于存储答案可验证性评分。 |
| **output_answer_verifiability_feedback_key**| str | "answer_verifiability_feedbacks"| 输出列名，用于存储答案可验证性反馈。 |
| **output_downstream_value_key** | str | "downstream_value_grades" | 输出列名，用于存储下游价值评分。 |
| **output_downstream_value_feedback_key**| str | "downstream_value_feedbacks"| 输出列名，用于存储下游价值反馈。 |

## 🧠 示例用法


#### 🧾 默认输出格式（Output Format）
该算子会保留输入数据的所有原始字段，并添加以下评分和反馈字段。
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `generated_question` | str | 输入的问题文本（使用默认 `input_question_key`）。 |
| `generated_answer` | str | 输入的答案文本（使用默认 `input_answer_key`）。 |
| `question_quality_grades` | float | 问题质量的评分。 |
| `question_quality_feedbacks` | str | 关于问题质量的具体反馈。 |
| `answer_alignment_grades` | float | 答案与问题对齐度的评分。 |
| `answer_alignment_feedbacks` | str | 关于答案与问题对齐度的具体反馈。 |
| `answer_verifiability_grades` | float | 答案可验证性的评分。 |
| `answer_verifiability_feedbacks` | str | 关于答案可验证性的具体反馈。 |
| `downstream_value_grades` | float | QA对的下游应用价值评分。 |
| `downstream_value_feedbacks` | str | 关于QA对下游应用价值的具体反馈。 |
