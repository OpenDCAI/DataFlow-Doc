---
title: PreferenceStructureFilter
createTime: 2026/11/01 00:00:00
permalink: /zh/api/operators/text_sft/filter/preferencestructurefilter/
---

## 📘 概述
根据 `preference_valid` 布尔验证列过滤 preference 数据。保留通过记录，删除不通过记录；不调用模型，也不新增列。

[源码](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/filter/preference_structure_filter.py)

## `__init__` 函数
```python
def __init__(self):
```

该算子没有初始化参数。

## `run` 函数
```python
def run(self, storage, input_key="preference_valid"):
```

### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | 必需 | 数据流存储实例。 |
| input_key | str | "preference_valid" | 必需的布尔验证列名，必须存在。 |

### 行为说明
验证列每个值必须严格是 `True` 或 `False`。`input_key` 是必需字段，`None` 不能用来关闭过滤。保留通过记录及全部原有字段，删除不通过记录，返回空输出列列表。

## 🧠 示例用法
```python
from dataflow.operators.text_sft.filter import PreferenceStructureFilter
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="preference_validated.jsonl")
PreferenceStructureFilter().run(storage.step(), input_key="preference_valid")
```

## 🧾 输出格式
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| 原有字段 | 保持不变 | 只保留 `preference_valid=True` 的记录；不新增字段。 |

**示例输出：**
```json
{"prompt":"Which answer is better?","preference_valid":true}
```
