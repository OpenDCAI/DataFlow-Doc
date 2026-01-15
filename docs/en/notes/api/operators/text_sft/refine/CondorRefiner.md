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
Now there is a user's question, a model's answer, and the user's feedback. Please help modify the model's answer based on the user's feedback to make it better.
Your improved answer must strictly adhere to the following format:

[Improved Answer Start]Your answer[Improved Answer End]

Below is the user's question, the model's answer, and the feedback:
[Question Start]{question}[Question End]
[Answer Start]{answer}[Answer End]
[Feedback Start]{critique}[Feedback End]

Now it's your turn, please provide your improved answer as required:
```

## `run`
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str='instruction', input_output_key: str='output')
```
Executes the main operator logic, reads a DataFrame containing instructions and responses from storage, goes through the two stages of "generating critique" and "optimizing response", and writes the optimized results back to storage.

#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance, responsible for reading and writing data. |
| **input_instruction_key** | str | "instruction" | Input column name, corresponding to the instruction field. |
| **input_output_key** | str | "output" | Input column name, corresponding to the response field to be optimized. The optimized response will overwrite this column. |
