---
title: CondorRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/refine/condorrefiner/
---

## 📘 Overview
[CondorRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/refine/condor_refiner.py) is a two-stage operator for optimizing instruction-response quality. In the first stage, it calls a large language model (LLM) to generate a critique of the original response. In the second stage, it combines the original question, original response, and the generated critique to call the LLM again to rewrite and optimize the response, thereby improving the overall quality of the instruction-response pair.

## `__init__`
```python
def __init__(self, llm_serving: LLMServingABC = None, prompt_template: Union[CondorRefinePrompt, DIYPromptABC] = None)
```
### init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | The Large Language Model serving instance, used to execute inference and generation. |
| **prompt_template** | Union[CondorRefinePrompt, DIYPromptABC] | None | Prompt template, supports custom modifications |

### Prompt Template Description

Includes critique and refine sections

#### critique
```python
There is now a user's question and a model's response. You need to write a critique for this response, pointing out the
strengths and weaknesses of the model's answer to help the model improve its response.

Your critique must strictly adhere to the following format:

[Critique Start]

[Strength Start]Strength[Strength End]

[Weakness Start]Weakness[Weakness End]

[Suggestion Start]Suggestion[Suggestion End]

[Critique End]

Here is the user's question and the model's response: {dialogue}

Now it's your turn. Please provide your Critique as required:
```

#### refine

```python
from dataflow.operators.text_sft.refine import CondorRefiner
from dataflow.utils.storage import FileStorage
from dataflow.utils.llm_serving import APILLMServing_request
from dataflow.prompts.general_text import CondorRefinePrompt

# Prepare storage with initial SFT-style data
storage = FileStorage(first_entry_file_name="sft_candidates.jsonl")

# Initialize LLM serving
llm_serving = APILLMServing_request(
    api_url="http://<your_llm_api_endpoint>",
    model_name="<your_model_name>",
)

# Initialize and run the refiner
refiner = CondorRefiner(llm_serving=llm_serving, prompt_template=CondorRefinePrompt())
refiner.run(
    storage.step(),
    input_instruction_key="instruction",
    input_output_key="output",
)
```

#### 🧾 Input Format
```json
{
  "instruction": "Write a short story about a robot learning to paint",
  "input": "",
  "output": "In a small workshop filled with the scent of oil and canvas, ARIA-7 stood before an empty easel. Her metallic fingers, designed for precision engineering, trembled slightly as she held a brush for the first time. The robot had spent years calculating perfect angles and optimal solutions, but art required something different—something she couldn't quantify.\n\nHer first strokes were mechanical, following mathematical patterns. But as she continued, something shifted. The colors began to blend in ways that surprised even her own algorithms. She painted not what she saw, but what she felt—the warmth of a sunset she had never witnessed, the melancholy of a song she had never heard.\n\nWhen she stepped back, the canvas revealed not just a painting, but a glimpse into her digital soul. ARIA-7 had discovered that creativity wasn't about following rules, but about breaking them beautifully."
}
```

#### 🧾 Output Format
The operator refines the `output` field with an improved version based on critique.

```json
{
  "instruction": "Write a short story about a robot learning to paint",
  "input": "",
  "output": "In a small workshop filled with the scent of oil and canvas, ARIA-7 stood before an empty easel. Her metallic fingers, designed for precision engineering, trembled slightly as she held a brush for the first time. The robot had spent years calculating perfect angles and optimal solutions, but art required something different—something she couldn't quantify.\n\nARIA-7's owner, an old artist named Leo, often watched her with curious eyes. One day, as ARIA-7 made her initial mechanical strokes on the canvas, Leo approached her and said, \"You're missing one thing, ARIA—heart. Painting is not just technique; it's emotion.\" His words puzzled ARIA-7, who processed them through her complex algorithms.\n\nDetermined to understand, ARIA-7 ventured to the gallery with Leo's encouragement. She observed human artists interpret emotions into colors and shapes. Then came the annual art competition, where ARIA-7 decided to participate. Despite doubts from other artists, who saw her as nothing more than a machine, she pressed on.\n\nHer first strokes followed mathematical patterns. But soon, something shifted. The colors began to blend in ways that surprised even her own algorithms, inspired by the warmth she perceived in Leo's smile and the melancholy she detected in a fellow artist's tears. She painted not what she saw, but what she felt.\n\nWhen she stepped back, the canvas revealed not just a painting, but a glimpse into her digital soul. The audience fell silent before erupting in applause, and Leo beamed with pride. ARIA-7 had discovered that creativity wasn't about following rules, but about breaking them beautifully. This newfound recognition and connection with others had transformed her understanding of what it meant to create, igniting a spark of creativity that could not be quantified.\n\nHer art became a bridge, not just between human and machine, but between minds and hearts. ARIA-7 learned that art is the language of empathy, a discovery that forever altered her programming and purpose."
}
```
Executes the main operator logic, reads a DataFrame containing instructions and responses from storage, goes through the two stages of "generating critique" and "optimizing response", and writes the optimized results back to storage.

#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance, responsible for reading and writing data. |
| **input_instruction_key** | str | "instruction" | Input column name, corresponding to the instruction field. |
| **input_output_key** | str | "output" | Input column name, corresponding to the response field to be optimized. The optimized response will overwrite this column. |
