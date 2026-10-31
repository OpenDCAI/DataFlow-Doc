---
title: ValidationFlagFilter
createTime: 2026/11/01 00:00:00
permalink: /zh/api/operators/conversations/filter/validationflagfilter/
---

## 📘 概述
根据已有的布尔验证列过滤记录。保留值为 `True` 的记录，删除值为 `False` 的记录；不调用模型，也不新增列。

[源码](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/filter/validation_flag_filter.py)

## `__init__` 函数
```python
def __init__(self):
```

该算子没有初始化参数。

## `run` 函数
```python
def run(self, storage, input_key="source_valid"):
```

### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | 必需 | 数据流存储实例。 |
| input_key | str | "source_valid" | 必需的布尔验证列名，必须存在。 |

### 行为说明
验证列的每个值必须严格是 `True` 或 `False`。`input_key` 是必需字段，`None` 不能用来关闭过滤。保留通过记录及全部原有字段；删除不通过记录；返回空输出列列表。

## 🧠 示例用法
```python
from dataflow.operators.conversations import ValidationFlagFilter
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="validated.jsonl")
ValidationFlagFilter().run(storage.step(), input_key="source_valid")
```

## 🧾 输出格式
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| 原有字段 | 保持不变 | 只保留验证值为 `True` 的记录；不新增字段。 |

**示例输出：**
```json
{"prompt":"Hello","source_valid":true}
```
