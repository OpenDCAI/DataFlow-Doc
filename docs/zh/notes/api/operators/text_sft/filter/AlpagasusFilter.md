---
title: AlpagasusFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/filter/alpagasusfilter/
---

## 📘 概述

[AlpagasusFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个基于 AlpagasusScorer 打分器的数据过滤算子。它通过调用大语言模型（LLM）来评估输入数据的质量，并根据预设的分数范围筛选出符合条件的数据。

## __init__函数

```python
def __init__(self, min_score=3, max_score=5, llm_serving: LLMServingABC = None, dimension='quality')
```

| 参数名 | 类型 | 默认值 | 说明 |
| :-------------- | :-------------- | :------------ | :----------------------- |
| **min_score** | int | 3 | 最低分数阈值。 |
| **max_score** | int | 5 | 最高分数阈值。 |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例。 |
| **dimension** | str | 'quality' | 评估维度，默认为'quality'（质量）。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :---------------- | :------- | :------- | :------- |
|                   |          |          |          |

## run函数

```python
def run(self, storage: DataFlowStorage, input_instruction_key: str, input_input_key: str, input_output_key: str, output_key: str='AlpagasusScore')
```

| 名称 | 类型 | 默认值 | 说明 |
| :---------------------- | :---------------- | :----------------- | :----------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | 必需 | 包含指令的输入列名。 |
| **input_input_key** | str | 必需 | 包含输入内容的输入列名。 |
| **input_output_key** | str | 必需 | 包含输出内容的输入列名。 |
| **output_key** | str | 'AlpagasusScore' | 存储分数的输出列名。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :---------------- | :---- | :------------------------------------------- |
| ... | ... | 输入数据中的原始字段。 |
| AlpagasusScore | int | 模型生成的质量分数（输出列名可通过 `output_key` 参数修改）。 |

示例输入：
```json
{
  "instruction": "请写一首关于春天的诗。",
  "input": "",
  "output": "春风拂面绿意浓，花开遍地鸟儿鸣。溪水潺潺流不尽，一派生机在其中。"
}
```

示例输出（假设该条目的评分为4，且在 `[min_score, max_score]` 范围内）:
```json
{
  "instruction": "请写一首关于春天的诗。",
  "input": "",
  "output": "春风拂面绿意浓，花开遍地鸟儿鸣。溪水潺潺流不尽，一派生机在其中。",
  "AlpagasusScore": 4
}
```
