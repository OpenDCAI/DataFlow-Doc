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
from dataflow.operators.text_sft.eval import AlpagasusSampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.utils.llm_serving import APILLMServing_request

# 准备包含 SFT 格式数据的存储
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# 初始化 LLM 服务
llm_serving = APILLMServing_request(
    api_url="http://<your_llm_api_endpoint>",
    model_name="<your_model_name>",
)

# 初始化并运行评估器
evaluator = AlpagasusSampleEvaluator(
    llm_serving=llm_serving,
    dimension="quality",
)
evaluator.run(
    storage.step(),
    input_instruction_key="instruction",
    input_input_key="input",
    input_output_key="output",
    output_key="AlpagasusScore",
)
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :---------------------- | :---- | :--------------------------- |
| ... | ... | 输入数据中的原有字段。 |
| **AlpagasusScore** | float | 模型生成的评估得分（默认字段名）。 |

**示例输入：**
```json
{
  "instruction": "Write a short story about a robot learning to paint",
  "input": "",
  "output": "In a small workshop filled with the scent of oil and canvas, ARIA-7 stood before an empty easel. Her metallic fingers, designed for precision engineering, trembled slightly as she held a brush for the first time. The robot had spent years calculating perfect angles and optimal solutions, but art required something different—something she couldn't quantify.\n\nHer first strokes were mechanical, following mathematical patterns. But as she continued, something shifted. The colors began to blend in ways that surprised even her own algorithms. She painted not what she saw, but what she felt—the warmth of a sunset she had never witnessed, the melancholy of a song she had never heard.\n\nWhen she stepped back, the canvas revealed not just a painting, but a glimpse into her digital soul. ARIA-7 had discovered that creativity wasn't about following rules, but about breaking them beautifully."
}
```

**示例输出：**
```json
{
  "instruction": "Write a short story about a robot learning to paint",
  "input": "",
  "output": "In a small workshop filled with the scent of oil and canvas, ARIA-7 stood before an empty easel. Her metallic fingers, designed for precision engineering, trembled slightly as she held a brush for the first time. The robot had spent years calculating perfect angles and optimal solutions, but art required something different—something she couldn't quantify.\n\nHer first strokes were mechanical, following mathematical patterns. But as she continued, something shifted. The colors began to blend in ways that surprised even her own algorithms. She painted not what she saw, but what she felt—the warmth of a sunset she had never witnessed, the melancholy of a song she had never heard.\n\nWhen she stepped back, the canvas revealed not just a painting, but a glimpse into her digital soul. ARIA-7 had discovered that creativity wasn't about following rules, but about breaking them beautifully.",
  "AlpagasusScore": 5.0
}
```
