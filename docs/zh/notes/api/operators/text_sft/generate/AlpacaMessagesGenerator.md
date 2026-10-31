---
title: AlpacaMessagesGenerator
createTime: 2026/11/01 00:00:00
permalink: /zh/api/operators/text_sft/generate/alpacamessagesgenerator/
---

## 📘 概述
将 Alpaca 风格字段转换为标准 `messages`。支持可选的 context、history 和 system 列；不调用模型、不删除记录。

[源码](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/generate/alpaca_messages_generator.py)

## `__init__` 函数
```python
def __init__(self, system_prompt=None):
```

### init 参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| system_prompt | str \| None | None | 可选的系统提示词。`None` 表示不添加 system 消息；非空字符串会作为第一条 system 消息。 |

## `run` 函数
```python
def run(self, storage, input_key="instruction", input_answer_key="output", output_key="messages", input_context_key=None, input_history_key=None, input_system_key=None):
```

### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | 必需 | 数据流存储实例。 |
| input_key | str | "instruction" | 指令列名，必须存在。 |
| input_answer_key | str | "output" | 答案列名，必须存在。 |
| output_key | str | "messages" | 新增消息列名，不能覆盖已有列。 |
| input_context_key | str \| None | None | 可选 context 列名；`None` 表示不读取该列。 |
| input_history_key | str \| None | None | 可选 history 列名；`None` 表示不读取该列。 |
| input_system_key | str \| None | None | 可选顶层 system 列名；`None` 表示不读取该列。 |

### 行为说明
`instruction` 和 `output` 必须是非空字符串；启用的可选列必须存在且满足对应格式。context 会作为用户消息中的上下文，history 会转换为历史消息，system 列或构造参数会提供 system 消息。保留原有字段、行顺序和行数；非法输入直接抛出异常。

## 🧠 示例用法
```python
from dataflow.operators.text_sft.generate import AlpacaMessagesGenerator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="alpaca.jsonl")
operator = AlpacaMessagesGenerator(system_prompt=None)
operator.run(storage.step(), input_key="instruction", input_answer_key="output", output_key="messages", input_context_key=None, input_history_key=None, input_system_key=None)
```

## 🧾 输出格式
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| messages | list[dict] | 由 Alpaca 字段转换得到的消息列表。 |

**示例输出：**
```json
{"instruction":"Explain gravity.","output":"Gravity attracts objects with mass.","messages":[{"role":"user","content":"Explain gravity."},{"role":"assistant","content":"Gravity attracts objects with mass."}]}
```
