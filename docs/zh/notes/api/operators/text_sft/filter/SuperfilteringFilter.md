---
title: SuperfilteringFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/filter/superfilteringfilter/
---

好的，这是根据您提供的代码和模板生成的 `SuperfilteringFilter` 算子的教程 Markdown。

***

## 📘 概述

`SuperfilteringFilter` 是一个数据过滤算子，它使用基于 GPT-2 模型的 Superfiltering 评分器来评估指令数据的质量，并过滤掉低分样本。该评分器通过计算困惑度比值来评估指令跟随的难度，比值越低表示指令越容易被模型理解和执行。该算子适用于筛选适合特定模型能力的指令数据，从而提高模型训练的效率和效果。

## `__init__`函数

```python
def __init__(self, min_score=0.0, max_score=1.0, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)
```

| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :--- | :----------------- | :----------------- |
| **min_score** | float | 0.0 | 保留样本的最小分数阈值。 |
| **max_score** | float | 1.0 | 保留样本的最大分数阈值。 |
| **device** | str | 'cuda' | 模型运行设备。 |
| **model_cache_dir** | str | './dataflow_cache' | 模型缓存目录。 |
| **max_length** | int | 512 | 文本最大长度。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_input_key: str = 'input', input_output_key: str = 'output', output_key: str = "SuperfilteringScore")
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :---------------------- | :---------------- | :-------------------- | :----------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | "instruction" | 输入的指令字段名。 |
| **input_input_key** | str | "input" | 输入的上下文或输入内容字段名。 |
| **input_output_key** | str | "output" | 输入的期望输出字段名。 |
| **output_key** | str | "SuperfilteringScore" | 输出分数结果的字段名。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

算子执行后，会在原始数据基础上增加一个分数**output_key**（默认为 `SuperfilteringScore`）字段，并仅保留分数在 `[min_score, max_score]` 区间内的数据行。

| 字段 | 类型 | 说明 |
| :-------------------- | :---- | :----------------------------- |
| instruction | str | 输入的指令文本。 |
| input | str | 输入的上下文或问题补充信息。 |
| output | str | 输入的期望答案。 |
| SuperfilteringScore | float | 模型生成的指令跟随难度分数。 |

示例输入：
```json
{
"instruction":"将以下句子从英语翻译成法语。",
"input":"Hello, how are you?",
"output":"Bonjour, comment ça va?"
}
```
示例输出 (假设该样本通过过滤)：
```json
{
"instruction":"将以下句子从英语翻译成法语。",
"input":"Hello, how are you?",
"output":"Bonjour, comment ça va?",
"SuperfilteringScore": 0.85
}
```
