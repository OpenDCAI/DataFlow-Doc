---
title: ReasoningQuestionGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/generate/reasoningquestiongenerator/
---

## 📘 Overview
[ReasoningQuestionGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_question_generator.py) is a question generation operator designed to create new questions based on existing ones. It utilizes a Large Language Model (LLM) to synthesize a specified number of new, diverse questions from each input question, leveraging different prompt templates (Math, General, DIY) to control the generation style.

## `__init__`
```python
def __init__(self,
             num_prompts: int = 1,
             llm_serving: LLMServingABC = None,
             prompt_template = MathQuestionSynthesisPrompt | GeneralQuestionSynthesisPrompt | DiyQuestionSynthesisPrompt | DIYPromptABC
             ):
```
### init Parameter Descriptions
| Parameter | Type | Default Value | Description |
| :------------------ | :-------------- | :---------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| **num_prompts** | int | 1 | The number of new questions to generate for each input question. Must be an integer between 1 and 5 (inclusive). |
| **llm_serving** | LLMServingABC | Required | The Large Language Model serving instance used for question generation. |
| **prompt_template** | PromptABC | `MathQuestionSynthesisPrompt` | The prompt template object used to construct the generation prompts. Supports Math, General, and custom DIY templates. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| -------------------------------- | ------------- | ------------------ | ------------------- |
| **MathQuestionSynthesisPrompt** | | | |
| **GeneralQuestionSynthesisPrompt** | | | |
| **DiyQuestionSynthesisPrompt** | | | |

## `run`
```python
def run(self, 
        storage: DataFlowStorage, 
        input_key: str,
        output_synth_or_input_flag: str = "Synth_or_Input"
        ):
```
Executes the main logic of the operator. It reads an input DataFrame from storage, generates new questions based on the `input_key` column, and writes the augmented DataFrame (containing both original and new questions) back to storage.

#### Parameters
| Name | Type | Default Value | Description |
| :--------------------------- | :---------------- | :------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance, responsible for reading input data and writing the output. |
| **input_key** | str | Required | The name of the input column that contains the original questions. |
| **output_synth_or_input_flag** | str | "Synth_or_Input" | The name of the output column that flags whether a row is an original input ('input') or a newly synthesized question ('synth'). |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator adds new rows for each generated question and a new column to distinguish between original and synthesized data.

| Field | Type | Description |
| :--------------------------- | :---- | :------------------------------------------------------------------------------------ |
| *{input\_key}* | str | Contains both the original and the newly generated questions. |
| Synth\_or\_Input | str | Flags the source of the question: 'input' for original questions, 'synth' for generated ones. |

Example Input:
```json
{
"instruction": "What is the capital of France?"
}
```
Example Output (with `num_prompts=1`):
```json
[
  {
    "instruction": "What is the capital of France?",
    "Synth_or_Input": "input"
  },
  {
    "instruction": "Identify the primary city that serves as the governmental seat of the French Republic.",
    "Synth_or_Input": "synth"
  }
]
```
