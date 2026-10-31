---
title: QAMessagesGenerator
createTime: 2026/11/01 00:00:00
permalink: /zh/api/operators/text_sft/generate/qamessagesgenerator/
---

## 📘 概述
将 QA 数据（问题和答案）转换为标准的两轮 `messages` 格式。算子不调用模型、不删除记录，只在输入数据上新增消息列。

[源码](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/generate/qa_messages_generator.py)

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
def run(self, storage, input_key="prompt", input_answer_key="answer", output_key="messages"):
```

### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | 必需 | 数据流存储实例。 |
| input_key | str | "prompt" | 问题列名，必须存在。 |
| input_answer_key | str | "answer" | 答案列名，必须存在。 |
| output_key | str | "messages" | 新增消息列名，不能覆盖已有列。 |

### 行为说明
每条记录的 `prompt` 和 `answer` 必须是非空字符串。输出为 `[{"role": "user", "content": prompt}, {"role": "assistant", "content": answer}]`，如果设置了系统提示词则在最前面插入 system 消息。保留原有字段、行顺序和行数；非法输入直接抛出异常。

## 🧠 示例用法
```python
from dataflow.operators.text_sft.generate import QAMessagesGenerator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="qa.jsonl")
operator = QAMessagesGenerator(system_prompt=None)
operator.run(storage.step(), input_key="prompt", input_answer_key="answer", output_key="messages")
```

## 🧾 输出格式
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| messages | list[dict] | 按 user/assistant（可选 system）顺序排列的消息列表。 |

**示例输出：**
```json
{"prompt":"What is 2 + 2?","answer":"4","messages":[{"role":"user","content":"What is 2 + 2?"},{"role":"assistant","content":"4"}]}
```
