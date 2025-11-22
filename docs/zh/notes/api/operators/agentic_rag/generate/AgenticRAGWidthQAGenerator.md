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

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 可选 | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明
该算子不使用提示模板；它通过多步推理直接生成、合并和验证复杂的问答对，而不依赖中间提示模板。

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
from dataflow.operators.agentic_rag.generate.agenticrag_width_qa_generator import AgenticRAGWidthQAGenerator
from dataflow.utils.storage import DataFlowStorage

# 初始化算子
generator = AgenticRAGWidthQAGenerator(
    llm_serving=your_llm_serving_instance
)

# 运行算子
storage = DataFlowStorage()
generator.run(
    storage=storage,
    input_question_key="question",
    input_identifier_key="identifier",
    input_answer_key="answer",
    output_question_key="generated_width_task"
)
```

#### 🧾 输出格式
该算子通过添加多个新列来修改输入DataFrame。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| **generated_width_task** | str | 生成的结合多个问答对的复杂问题 |
| **content_identifier** | str | 合并问题的组合内容标识符 |
| **qa_index** | list | 被合并的原始问答对的索引 |
| **index** | int | 生成问题的索引 |
| **original_answer** | list | 来自合并问答对的原始答案列表 |
| **original_question** | list | 来自合并问答对的原始问题列表 |
| **state** | int | 验证状态（1表示有效，0表示无效） |

**示例输入:**
```json
[
  {
    "question": "什么是机器学习？",
    "identifier": "ml_concepts",
    "answer": "机器学习是人工智能的一个子集，使计算机能够在没有明确编程的情况下学习。"
  },
  {
    "question": "深度学习是如何工作的？",
    "identifier": "dl_concepts", 
    "answer": "深度学习使用多层神经网络来处理数据并进行预测。"
  }
]
```

**示例输出:**
```json
{
  "generated_width_task": "机器学习和深度学习在现代AI系统中如何协同工作？",
  "content_identifier": "ml_dl_integration",
  "qa_index": [0, 1],
  "index": 0,
  "original_answer": [
    "机器学习是人工智能的一个子集，使计算机能够在没有明确编程的情况下学习。",
    "深度学习使用多层神经网络来处理数据并进行预测。"
  ],
  "original_question": [
    "什么是机器学习？",
    "深度学习是如何工作的？"
  ],
  "state": 1
}
```
