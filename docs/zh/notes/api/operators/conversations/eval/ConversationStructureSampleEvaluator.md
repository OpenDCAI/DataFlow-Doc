---
title: ConversationStructureSampleEvaluator
createTime: 2026/11/01 00:00:00
permalink: /zh/api/operators/conversations/eval/conversationstructuresampleevaluator/
---

## 📘 概述
检查标准 `messages` 对话结构，包括角色顺序、工具调用、工具响应以及最终 assistant 回复。不调用模型、不删除记录。

[源码](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/eval/conversation_structure_sample_evaluator.py)

## `__init__` 函数
```python
def __init__(self, profile="conversation"):
```

### init 参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| profile | str | "conversation" | 校验配置。`"conversation"` 检查完整对话（包括工具调用）；`"single_turn"` 只接受 system/user/assistant 的单轮结构。 |

## `run` 函数
```python
def run(self, storage, input_key="messages", output_valid_key="conversation_valid", output_error_key="conversation_error"):
```

### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | 必需 | 数据流存储实例。 |
| input_key | str | "messages" | 消息列名，必须存在。 |
| output_valid_key | str | "conversation_valid" | 新增布尔校验列名。 |
| output_error_key | str | "conversation_error" | 新增错误详情列名。 |

### 行为说明
`profile="conversation"` 检查工具调用、工具响应、角色顺序和最终 assistant 回复；`profile="single_turn"` 只接受单轮 system/user/assistant 结构。本算子没有可选输入列，因此 `None` 不能禁用字段。合法记录写入 `True` 和 `None`；非法记录写入 `False` 和错误对象；原记录全部保留。

## 🧠 示例用法
```python
from dataflow.operators.conversations import ConversationStructureSampleEvaluator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="messages.jsonl")
ConversationStructureSampleEvaluator(profile="conversation").run(storage.step(), input_key="messages")
```

## 🧾 输出格式
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| conversation_valid | bool | 记录是否通过对话结构校验。 |
| conversation_error | dict \| None | 失败时的错误详情；通过时为 `None`。 |

**示例输出：**
```json
{"messages":[{"role":"user","content":"Hello"},{"role":"assistant","content":"Hi"}],"conversation_valid":true,"conversation_error":null}
```
