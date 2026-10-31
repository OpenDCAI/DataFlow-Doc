---
title: AlpacaStructureSampleEvaluator
createTime: 2026/11/01 00:00:00
permalink: /zh/api/operators/text_sft/eval/alpacastructuresampleevaluator/
---

## 📘 概述
检查 Alpaca 样本的 instruction/output，以及可选 context、history、system 字段是否符合结构要求。不调用模型、不删除记录。

[源码](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/eval/alpaca_structure_sample_evaluator.py)

## `__init__` 函数
```python
def __init__(self):
```

该算子没有初始化参数。

## `run` 函数
```python
def run(self, storage, input_key="instruction", input_answer_key="output", input_context_key=None, input_history_key=None, input_system_key=None, output_valid_key="source_valid", output_error_key="source_error"):
```

### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | 必需 | 数据流存储实例。 |
| input_key | str | "instruction" | 指令列名，必须存在。 |
| input_answer_key | str | "output" | 答案列名，必须存在。 |
| input_context_key | str \| None | None | context 列名；`None` 表示不读取。 |
| input_history_key | str \| None | None | history 列名；`None` 表示不读取。 |
| input_system_key | str \| None | None | system 列名；`None` 表示不读取。 |
| output_valid_key | str | "source_valid" | 新增布尔校验列名。 |
| output_error_key | str | "source_error" | 新增错误详情列名。 |

### 行为说明
instruction 和 output 必须是非空字符串；启用的可选列必须存在并满足对应格式。可选输入列为 `None` 时表示禁用，不读取对应列。合法记录写入 `True` 和 `None`，非法记录写入 `False` 和错误对象；原记录全部保留。

## 🧠 示例用法
```python
from dataflow.operators.text_sft.eval import AlpacaStructureSampleEvaluator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="alpaca.jsonl")
AlpacaStructureSampleEvaluator().run(storage.step(), input_key="instruction", input_answer_key="output", input_context_key=None, input_history_key=None, input_system_key=None)
```

## 🧾 输出格式
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| source_valid | bool | 记录是否通过 Alpaca 结构校验。 |
| source_error | dict \| None | 失败时的错误详情；通过时为 `None`。 |

**示例输出：**
```json
{"instruction":"Explain gravity.","output":"Gravity attracts objects with mass.","source_valid":true,"source_error":null}
```
