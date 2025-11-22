---
title: AgenticRAGDepthQAGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/agentic_rag/generate/agenticragdepthqagenerator/
---

## 📘 概述
`AgenticRAGDepthQAGenerator` 是一个用于生成深度问题的算子。它基于已有的问答对，通过多轮次的“向后思考”和“向前生成”来创造出更具深度和广度的新问题，旨在增强问答数据集的复杂性和覆盖范围。

## `__init__`函数
```python
def __init__(self, llm_serving: LLMServingABC = None, n_rounds:int = 2)
```

| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | `LLMServingABC` | `None` | 大语言模型服务实例，用于执行推理与生成。 |
| **n_rounds** | `int` | `2` | 生成深度问题的迭代轮次。 |

### Prompt模板说明
该算子不使用提示模板；它通过多轮推理步骤直接生成和处理更深层的问题-答案对。

## run函数
```python
def run(self, storage: DataFlowStorage, input_key:str = "question", output_key:str = "depth_question")
```
执行算子主逻辑，从存储中读取输入 DataFrame，经过多轮次推理生成深度问题，并将包含新生成列的结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | `DataFlowStorage` | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | `str` | `"question"` | 输入列名，对应原始问题字段。 |
| **output_key** | `str` | `"depth_question"` | 输出列名的基准字段，用于生成新的深度问题列（如 `depth_question_1`）。 |

## 🧠 示例用法

```python
from dataflow.operators.agentic_rag.generate.agenticrag_depth_qa_generator import AgenticRAGDepthQAGenerator
from dataflow.utils.storage import DataFlowStorage

# 初始化算子
generator = AgenticRAGDepthQAGenerator(
    llm_serving=your_llm_serving_instance,
    n_rounds=2
)

# 运行算子
storage = DataFlowStorage()
generator.run(
    storage=storage,
    input_key="question",
    output_key="depth_question"
)
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| **identifier** | str | 从原始问题中提取的内容标识符 |
| **new_identifier_{i}** | str | 第i轮生成的新标识符 |
| **relation_{i}** | str | 第i轮中标识符之间的关系 |
| **depth_question_{i}** | str | 第i轮生成的更深层问题 |

**示例输入:**

```json
{
  "question": "什么是机器学习？"
}
```

**示例输出:**

```json
{
  "question": "什么是机器学习？",
  "identifier": "机器学习概念",
  "new_identifier_1": "人工智能算法",
  "relation_1": "是...的子集",
  "depth_question_1": "人工智能算法在机器学习系统中是如何工作的？",
  "new_identifier_2": "统计学习理论",
  "relation_2": "为...提供基础",
  "depth_question_2": "统计学习理论在机器学习算法发展中扮演什么角色？"
}
```
