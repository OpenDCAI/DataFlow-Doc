---
title: AgenticRAGWidthQAGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/agentic_rag/generate/agenticragwidthqagenerator/
---

## 📘 概述
`AgenticRAGWidthQAGenerator` 算子用于结合两个问答对（QA pairs），并基于它们生成一个更复杂、更具综合性的新问题。该算子通过多步验证（分解验证、可回答性验证）来确保生成问题的质量。

## `__init__`函数
```python
def __init__(self, llm_serving: LLMServingABC = None)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 可选 | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_question_key:str = "question", input_identifier_key:str = "identifier", input_answer_key:str = "answer", output_question_key:str = "generated_width_task")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_question_key** | str | "question" | 输入列名，对应原始问题字段。 |
| **input_identifier_key** | str | "identifier" | 输入列名，对应内容标识符字段。 |
| **input_answer_key** | str | "answer" | 输入列名，对应原始答案字段。 |
| **output_question_key** | str | "generated_width_task" | 输出列名，对应生成的新问题字段。 |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| original_question | list[str] | 用于生成新问题的原始问题列表。 |
| original_answer | list[str] | 对应原始问题的答案列表。 |
| content_identifier | any | 内容标识符。 |
| generated_width_task | str | 模型生成的组合性新问题。 |

示例输入（`storage` 中 DataFrame 的两行）：
```json
{
    "question": "法国的首都是哪里？",
    "identifier": "法国概况",
    "answer": "法国的首都是巴黎。"
}
{
    "question": "法国的官方货币是什么？",
    "identifier": "法国概况",
    "answer": "法国的官方货币是欧元。"
}
```
示例输出（写入 `storage` 的 DataFrame 中的一行）：
```json
{
    "original_question": ["法国的首都是哪里？", "法国的官方货币是什么？"],
    "original_answer": ["法国的首都是巴黎。", "法国的官方货币是欧元。"],
    "content_identifier": "法国概况",
    "generated_width_task": "法国的首都及其官方货币分别是什么？"
}
```
