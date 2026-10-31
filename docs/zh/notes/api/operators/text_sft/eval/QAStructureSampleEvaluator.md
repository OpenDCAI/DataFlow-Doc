---
title: QAStructureSampleEvaluator
createTime: 2026/11/01 00:00:00
permalink: /zh/api/operators/text_sft/eval/qastructuresampleevaluator/
---

## 📘 概述
检查 QA 样本是否包含非空的问题和答案字段。算子不调用模型、不转换数据、不删除记录，而是为每条记录写入结构校验结果。

[源码](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/eval/qa_structure_sample_evaluator.py)

## `__init__` 函数
```python
def __init__(self):
```

该算子没有初始化参数。

## `run` 函数
```python
def run(self, storage, input_key="prompt", input_answer_key="answer", output_valid_key="source_valid", output_error_key="source_error"):
```

### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| storage | DataFlowStorage | 必需 | 数据流存储实例。 |
| input_key | str | "prompt" | 问题列名，必须存在。 |
| input_answer_key | str | "answer" | 答案列名，必须存在。 |
| output_valid_key | str | "source_valid" | 新增布尔校验列名。 |
| output_error_key | str | "source_error" | 新增错误详情列名。 |

### 行为说明
两个输入字段必须是非空字符串。本算子没有可选输入列，因此这里不存在用 `None` 禁用字段的写法。合法记录写入 `True` 和 `None`；非法记录写入 `False` 以及包含 `field`、`code`、`message`、`row` 的错误对象。原记录全部保留。

## 🧠 示例用法
```python
from dataflow.operators.text_sft.eval import QAStructureSampleEvaluator
from dataflow.utils.storage import FileStorage

storage = FileStorage(first_entry_file_name="qa.jsonl")
QAStructureSampleEvaluator().run(storage.step(), input_key="prompt", input_answer_key="answer", output_valid_key="source_valid", output_error_key="source_error")
```

## 🧾 输出格式
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| source_valid | bool | 记录是否通过 QA 结构校验。 |
| source_error | dict \| None | 失败时的错误详情；通过时为 `None`。 |

**示例输出：**
```json
{"prompt":"What is 2 + 2?","answer":"4","source_valid":true,"source_error":null}
```
