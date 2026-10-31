---
title: ShareGPTStructureSampleEvaluator
createTime: 2026/11/01 00:00:00
permalink: /zh/api/operators/conversations/eval/sharegptstructuresampleevaluator/
---

## 📘 概述
检查 ShareGPT 对话中的文本 `from`/`value` 消息及可选顶层 system 字段。不调用模型、不转换数据、不删除记录。

[源码](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/eval/sharegpt_structure_sample_evaluator.py)

## `__init__` 函数
```python
def __init__(self):
```

该算子没有初始化参数。

## `run` 函数
```python
def run(self, storage, input_key="conversations", input_system_key=None, output_valid_key="source_valid", output_error_key="source_error"):
```

### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | 必需 | 数据流存储实例。 |
| input_key | str | "conversations" | ShareGPT 对话列名，必须存在。 |
| input_system_key | str \| None | None | 顶层 system 列名；`None` 表示不读取。 |
| output_valid_key | str | "source_valid" | 新增布尔校验列名。 |
| output_error_key | str | "source_error" | 新增错误详情列名。 |

### 行为说明
只接受文本 `from`/`value` 消息；启用的顶层 system 列必须存在，且不能与对话中已有的 system 消息重复。`input_system_key=None` 表示不读取顶层 system 列。合法记录写入 `True` 和 `None`，非法记录写入 `False` 和错误对象；原记录全部保留。

## 🧠 示例用法
```python
from dataflow.operators.conversations import ShareGPTStructureSampleEvaluator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="sharegpt.jsonl")
ShareGPTStructureSampleEvaluator().run(storage.step(), input_key="conversations", input_system_key=None)
```

## 🧾 输出格式
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| source_valid | bool | 记录是否通过 ShareGPT 结构校验。 |
| source_error | dict \| None | 失败时的错误详情；通过时为 `None`。 |

**示例输出：**
```json
{"conversations":[{"from":"human","value":"Hello"},{"from":"gpt","value":"Hi"}],"source_valid":true,"source_error":null}
```
