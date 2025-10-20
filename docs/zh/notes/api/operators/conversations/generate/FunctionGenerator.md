---
title: FunctionGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/functiongenerator/
---

## 📘 概述

[FunctionGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个函数生成算子，基于组合任务及其相关子任务，使用LLM服务生成对应的函数列表。

## \_\_init\_\_函数

```python
def __init__(self, llm_serving: LLMServingABC)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_composition_task_key: str, input_sub_tasks_keys: list[str], output_key: str = "functions")
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input\_composition\_task\_key** | str | 必需 | 输入列名，对应组合任务字段。 |
| **input\_sub\_tasks\_keys** | list[str] | 必需 | 输入列名列表，对应子任务字段。 |
| **output\_key** | str | "functions" | 输出列名，对应生成的函数列表字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| (input\_composition\_task\_key) | str | 输入的组合任务文本。 |
| (input\_sub\_tasks\_keys) | list[str] | 输入的子任务文本列表。 |
| functions | str | 模型生成的函数列表。 |

示例输入：

```json
{
  "composition_task": "首先，计算两个数的和，然后将结果乘以第三个数。",
  "sub_tasks": ["计算两个数的和", "将结果乘以一个数"]
}
```

示例输出：

```json
{
  "composition_task": "首先，计算两个数的和，然后将结果乘以第三个数。",
  "sub_tasks": ["计算两个数的和", "将结果乘以一个数"],
  "functions": "[def add(a, b):\n    return a + b, \ndef multiply(a, b):\n    return a * b]"
}
```
