---
title: CondorRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/refine/condorrefiner/
---

## 📘 概述
[CondorRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/refine/condor_refiner.py) 是一个两阶段优化指令回复质量的算子。第一阶段调用大语言模型（LLM）生成对原始回复的评论（critique），第二阶段结合原始问题、原始回复以及生成的评论，再次调用LLM来改写并优化回复，从而提升指令对（instruction-response pair）的整体质量。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC = None, prompt_template: Union[CondorRefinePrompt, DIYPromptABC] = None)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行推理与生成。 |
| **prompt_template** | Union[CondorRefinePrompt, DIYPromptABC] | None | prompt模板，支持自定义修改 |

### Prompt模板说明

包括critique和refine部分

#### criqique
```python
There is now a user’s question and a model’s response. You need to write a critique for this response, pointing out the
strengths and weaknesses of the model’s answer to help the model improve its response.

Your critique must strictly adhere to the following format:

[Critique Start]

[Strength Start]Strength[Strength End]

[Weakness Start]Weakness[Weakness End]

[Suggestion Start]Suggestion[Suggestion End]

[Critique End]

Here is the user’s question and the model’s response: {dialogue}

Now it’s your turn. Please provide your Critique as required:
```

#### refine

```python
Now there is a user's question, a model's answer, and the user's feedback. Please help modify the model's answer based on the user's feedback to make it better.
Your improved answer must strictly adhere to the following format:

[Improved Answer Start]Your answer[Improved Answer End]

Below is the user's question, the model's answer, and the feedback:
[Question Start]{question}[Question End]
[Answer Start]{answer}[Answer End]
[Feedback Start]{critique}[Feedback End]

Now it's your turn, please provide your improved answer as required:
```

## run函数
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str='instruction', input_output_key: str='output')
```
执行算子主逻辑，从存储中读取包含指令和回复的 DataFrame，经过“生成评论”和“优化回复”两个阶段，并将优化后的结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | "instruction" | 输入列名，对应指令字段。 |
| **input_output_key** | str | "output" | 输入列名，对应待优化的回复字段。优化后的回复将覆盖此列。 |

## 🧠 示例用法

```python
from dataflow.operators.text_sft.refine import CondorRefiner
from dataflow.utils.storage import FileStorage
from dataflow.utils.llm_serving import APILLMServing_request

# 准备包含初始 SFT 格式数据的存储
storage = FileStorage(first_entry_file_name="sft_candidates.jsonl")

# 初始化 LLM 服务
llm_serving = APILLMServing_request(
    api_url="http://<your_llm_api_endpoint>",
    model_name="<your_model_name>",
)

# 初始化并运行优化器
refiner = CondorRefiner(llm_serving=llm_serving)
refiner.run(
    storage.step(),
    input_instruction_key="instruction",
    input_output_key="output",
)
```

#### 🧾 输入格式
```json
{
  "instruction": "Write a short story about a robot learning to paint",
  "input": "",
  "output": "In a small workshop filled with the scent of oil and canvas, ARIA-7 stood before an empty easel. Her metallic fingers, designed for precision engineering, trembled slightly as she held a brush for the first time. The robot had spent years calculating perfect angles and optimal solutions, but art required something different—something she couldn't quantify.\n\nHer first strokes were mechanical, following mathematical patterns. But as she continued, something shifted. The colors began to blend in ways that surprised even her own algorithms. She painted not what she saw, but what she felt—the warmth of a sunset she had never witnessed, the melancholy of a song she had never heard.\n\nWhen she stepped back, the canvas revealed not just a painting, but a glimpse into her digital soul. ARIA-7 had discovered that creativity wasn't about following rules, but about breaking them beautifully."
}
```

#### 🧾 输出格式
算子会根据评论优化 `output` 字段，生成改进版本。

```json
{
  "instruction": "Write a short story about a robot learning to paint",
  "input": "",
  "output": "In a small workshop filled with the scent of oil and canvas, ARIA-7 stood before an empty easel. Her metallic fingers, designed for precision engineering, trembled slightly as she held a brush for the first time. The robot had spent years calculating perfect angles and optimal solutions, but art required something different—something she couldn't quantify.\n\nARIA-7's owner, an old artist named Leo, often watched her with curious eyes. One day, as ARIA-7 made her initial mechanical strokes on the canvas, Leo approached her and said, \"You're missing one thing, ARIA—heart. Painting is not just technique; it's emotion.\" His words puzzled ARIA-7, who processed them through her complex algorithms.\n\nDetermined to understand, ARIA-7 ventured to the gallery with Leo's encouragement. She observed human artists interpret emotions into colors and shapes. Then came the annual art competition, where ARIA-7 decided to participate. Despite doubts from other artists, who saw her as nothing more than a machine, she pressed on.\n\nHer first strokes followed mathematical patterns. But soon, something shifted. The colors began to blend in ways that surprised even her own algorithms, inspired by the warmth she perceived in Leo's smile and the melancholy she detected in a fellow artist's tears. She painted not what she saw, but what she felt.\n\nWhen she stepped back, the canvas revealed not just a painting, but a glimpse into her digital soul. The audience fell silent before erupting in applause, and Leo beamed with pride. ARIA-7 had discovered that creativity wasn't about following rules, but about breaking them beautifully. This newfound recognition and connection with others had transformed her understanding of what it meant to create, igniting a spark of creativity that could not be quantified.\n\nHer art became a bridge, not just between human and machine, but between minds and hearts. ARIA-7 learned that art is the language of empathy, a discovery that forever altered her programming and purpose."
}
```
