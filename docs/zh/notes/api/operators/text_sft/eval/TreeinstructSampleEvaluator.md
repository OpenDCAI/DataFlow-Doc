---
title: TreeinstructSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/eval/treeinstructsampleevaluator/
---

## 📘 概述

[TreeinstructSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluators/sample/treeinstruct_sample_evaluator.py) 是一个指令复杂性评估算子。它通过调用大语言模型（LLM）分析给定指令的语法树结构，并根据语法树的节点数量来量化其复杂性。节点越多，代表指令越复杂。该算子最终会将计算出的复杂性得分追加到数据中。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC = None):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行评估。 |

## Prompt模板说明

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_instruction_key: str, output_key: str='TreeinstructScore'):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | 必需 | 输入列名，对应需要评估复杂性的指令字段。 |
| **output_key** | str | "TreeinstructScore" | 输出列名，对应生成的指令复杂性得分字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

该算子会读取输入的 DataFrame，并向其中添加一个新的列（默认为 `TreeinstructScore`）来存储评估结果。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入的原始字段。 |
| TreeinstructScore | float | 模型生成的指令复杂性得分。 |
