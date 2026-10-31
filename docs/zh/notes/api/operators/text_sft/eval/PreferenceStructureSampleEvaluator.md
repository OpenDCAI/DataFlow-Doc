---
title: PreferenceStructureSampleEvaluator
createTime: 2026/11/01 00:00:00
permalink: /zh/api/operators/text_sft/eval/preferencestructuresampleevaluator/
---

## 📘 概述
检查 preference 样本的 prompt、chosen 和 rejected 三个字段是否为非空字符串。不调用模型、不删除记录。

[源码](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/eval/preference_structure_sample_evaluator.py)

## `__init__` 函数
```python
def __init__(self):
```

该算子没有初始化参数。

## `run` 函数
```python
def run(self, storage, input_prompt_key="prompt", input_chosen_key="chosen", input_rejected_key="rejected", output_valid_key="preference_valid", output_error_key="preference_error"):
```

### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | 必需 | 数据流存储实例。 |
| input_prompt_key | str | "prompt" | prompt 列名，必须存在。 |
| input_chosen_key | str | "chosen" | 偏好答案列名，必须存在。 |
| input_rejected_key | str | "rejected" | 非偏好答案列名，必须存在。 |
| output_valid_key | str | "preference_valid" | 新增布尔校验列名。 |
| output_error_key | str | "preference_error" | 新增错误详情列名。 |

### 行为说明
三个输入列名必须是非空且互不相同的字符串；每条记录的三个字段也必须是非空字符串。本算子没有可选输入列，因此 `None` 不能禁用字段。合法记录写入 `True` 和 `None`；非法记录写入 `False` 和错误对象；原记录全部保留。

## 🧠 示例用法
```python
from dataflow.operators.text_sft.eval import PreferenceStructureSampleEvaluator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="preference.jsonl")
PreferenceStructureSampleEvaluator().run(storage.step(), input_prompt_key="prompt", input_chosen_key="chosen", input_rejected_key="rejected")
```

## 🧾 输出格式
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| preference_valid | bool | 记录是否通过 preference 结构校验。 |
| preference_error | dict \| None | 失败时的错误详情；通过时为 `None`。 |

**示例输出：**
```json
{"prompt":"Which answer is better?","chosen":"The concise answer.","rejected":"An empty answer.","preference_valid":true,"preference_error":null}
```
