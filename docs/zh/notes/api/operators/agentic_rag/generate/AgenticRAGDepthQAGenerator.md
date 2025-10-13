---
title: AgenticRAGDepthQAGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/agentic_rag/generate/agenticragdepthqagenerator/
---

## 📘 概述
`AgenticRAGDepthQAGenerator` 是一个用于生成深度问题的算子。它基于已有的问答对，通过多轮次的“向后思考”和“向前生成”来创造出更具深度和广度的新问题，旨在增强问答数据集的复杂性和覆盖范围。

## \_\_init\_\_函数
```python
def __init__(self, llm_serving: LLMServingABC = None, n_rounds:int = 2)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | `LLMServingABC` | `None` | 大语言模型服务实例，用于执行推理与生成。 |
| **n_rounds** | `int` | `2` | 生成深度问题的迭代轮次。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

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

#### 🧾 默认输出格式（Output Format）
算子执行后，会在输入的 DataFrame 中增加多列，列名格式如下。其中 `{i}` 代表迭代轮次，从 1 到 `n_rounds`。

| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| `{output_key}_{i}` | `str` | 第 `i` 轮生成的新深度问题。 |
| `new_identifier_{i}` | `str` | 第 `i` 轮生成的新概念实体。 |
| `relation_{i}` | `str` | 第 `i` 轮中新旧概念实体之间的关系。 |
