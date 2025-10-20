---
title: AlpagasusSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/eval/alpagasussampleevaluator/
---

好的，这是根据您提供的代码和模板生成的 `AlpagasusSampleEvaluator` 算子的教程 Markdown 代码。

***

## 📘 概述

[AlpagasusSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluator/alpagasus_sample_evaluator.py) 是一个基于大语言模型（LLM）的样本评估算子。它通过调用 GPT 等模型来评估指令驱动型任务的质量，并为每个样本生成一个量化得分。该算子主要用于自动化评估生成数据的质量，得分越高表明指令-输入-输出三元组的质量越高。

## __init__函数

```python
def __init__(self, llm_serving: LLMServingABC = None, dimension: str = 'quality')
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :-------------- | :------------ | :--------- | :--------------------------------- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行评估。 |
| **dimension** | str | 'quality' | 评估维度，用于构建评估提示词。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| ------------------- |-------------| ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_instruction_key: str, input_input_key: str, input_output_key: str, output_key: str='AlpagasusScore')
```

执行算子主逻辑，从存储中读取输入 DataFrame，调用 LLM 对每条数据进行评估打分，并将包含得分的结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :---------------------- | :-------------- | :----------------- | :----------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | 必需 | 输入列名，对应指令字段。 |
| **input_input_key** | str | 必需 | 输入列名，对应输入文本字段。 |
| **input_output_key** | str | 必需 | 输入列名，对应输出文本字段。 |
| **output_key** | str | 'AlpagasusScore' | 输出列名，对应生成的评估得分字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :---------------------- | :---- | :--------------------------- |
| ... | ... | 输入数据中的原有字段。 |
| **AlpagasusScore** | float | 模型生成的评估得分（默认字段名）。 |

示例输入：
```json
{
  "instruction": "写一个关于友谊的短篇故事。",
  "input": "",
  "output": "从前，在一片绿色的森林里，住着一只名叫Leo的小狮子和一只名叫Mia的小老鼠。尽管体型悬殊，他们却是最好的朋友。他们每天一起探险，分享彼此的快乐和秘密。他们的友谊告诉森林里所有的动物，真正的朋友是超越外表的。"
}
```
示例输出：
```json
{
  "instruction": "写一个关于友谊的短篇故事。",
  "input": "",
  "output": "从前，在一片绿色的森林里，住着一只名叫Leo的小狮子和一只名叫Mia的小老鼠。尽管体型悬殊，他们却是最好的朋友。他们每天一起探险，分享彼此的快乐和秘密。他们的友谊告诉森林里所有的动物，真正的朋友是超越外表的。",
  "AlpagasusScore": 4.5
}
```
