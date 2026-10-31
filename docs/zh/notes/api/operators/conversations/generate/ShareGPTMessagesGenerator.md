---
title: ShareGPTMessagesGenerator
createTime: 2026/11/01 00:00:00
permalink: /zh/api/operators/conversations/generate/sharegptmessagesgenerator/
---

## 📘 概述
将 ShareGPT 的 `from`/`value` 对话字段转换为标准 `messages`。支持可选顶层 system 列，不调用模型、不删除记录。

[源码](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/generate/sharegpt_messages_generator.py)

## `__init__` 函数
```python
def __init__(self, system_prompt=None):
```

### init 参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| system_prompt | str \| None | None | 可选系统提示词。`None` 表示不添加 system 消息；非空字符串会作为第一条 system 消息。 |

## `run` 函数
```python
def run(self, storage, input_key="conversations", output_key="messages", input_system_key=None):
```

### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | 必需 | 数据流存储实例。 |
| input_key | str | "conversations" | ShareGPT 对话列名，必须存在。 |
| output_key | str | "messages" | 新增消息列名，不能覆盖已有列。 |
| input_system_key | str \| None | None | 顶层 system 列名；`None` 表示不读取该列。 |

### 行为说明
只支持文本 `from`/`value` 消息，不支持权重字段或多模态字段。启用的顶层 system 列必须存在；构造参数 `system_prompt` 或顶层 system 会生成第一条 system 消息；两者不能同时设置，且输入对话已有 system 消息时不能再次添加。保留原有字段、行顺序和行数。

## 🧠 示例用法
```python
from dataflow.operators.conversations import ShareGPTMessagesGenerator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="sharegpt.jsonl")
operator = ShareGPTMessagesGenerator(system_prompt=None)
operator.run(storage.step(), input_key="conversations", output_key="messages", input_system_key=None)
```

## 🧾 输出格式
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| messages | list[dict] | 标准 role/content 消息列表。 |

**示例输出：**
```json
{"conversations":[{"from":"human","value":"Hello"},{"from":"gpt","value":"Hi"}],"messages":[{"role":"user","content":"Hello"},{"role":"assistant","content":"Hi"}]}
```
