---
title: MultiTurnConversationGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/multiturnconversationgenerator/
---

## 📘 概述
[MultiTurnConversationGenerator]() 是一个多轮对话生成算子，它根据组合任务及其子任务函数，使用大语言模型（LLM）服务模拟一个由 User、Assistant 和 Tool 三个 Agent 协同工作的多轮对话过程，最终生成完整的对话数据。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明

## run函数
```python
def run(self, storage: DataFlowStorage, input_task_key: str, input_sub_tasks_keys: list[str], input_functions_key: list[str], output_conversations_key: str = "conversations"):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_task_key** | str | 必需 | 输入列名，对应组合任务字段。 |
| **input_sub_tasks_keys** | list[str] | 必需 | 输入列名列表，对应子任务字段。 |
| **input_functions_key** | list[str] | 必需 | 输入列名，对应子任务函数字段。 |
| **output_conversations_key** | str | "conversations" | 输出列名，对应生成的多轮对话字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| ... | ... | 输入的原始字段。 |
| conversations | list | 模型生成的多轮对话记录。 |
