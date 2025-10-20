---
title: ReasoningAnswerGenerator
createTime: 2025/10/09 11:01:59
permalink: /en/api/u4zfvr4i/
---

## 📘 Overview

[ReasoningAnswerGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) is a reasoning-based answer generation operator designed to automatically construct prompts and invoke large language models (LLMs) to produce reasoning-style answers based on input questions.
This operator can be used in conjunction with various Prompt templates (Mathematical, General, DIY) and LLM service modules to automate the question–answer generation workflow.

## `__init__` Function

```python
@prompt_restrict(
    MathAnswerGeneratorPrompt,
    GeneralAnswerGeneratorPrompt,
    DiyAnswerGeneratorPrompt
)
@OPERATOR_REGISTRY.register()
class ReasoningAnswerGenerator(OperatorABC):
    '''
    Answer Generator is a class that generates answers for given questions.
    '''
    def __init__(self,
                llm_serving: LLMServingABC,
                prompt_template = MathAnswerGeneratorPrompt | GeneralAnswerGeneratorPrompt | DiyAnswerGeneratorPrompt | DIYPromptABC
                ):
```

### `__init__` Parameters

| Parameter Name      | Type            | Default Value                                                                                                                    | Description                                                                                                      |
| :------------------ | :-------------- | :------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **llm_serving**     | `LLMServingABC` | Required                                                                                                                         | Instance of the LLM service used to perform reasoning and answer generation.                                     |
| **prompt_template** | `PromptABC`     | Supports `MathAnswerGeneratorPrompt`, `GeneralAnswerGeneratorPrompt`, `DiyAnswerGeneratorPrompt`, or user-defined `DIYPromptABC` | Prompt template object used to construct the input prompt. Supports mathematical, general, and custom templates. |

### Prompt Template Descriptions

| Prompt Template Name             | Primary Purpose                                           | Applicable Scenario                                                                  | Key Features                                                                                                                            |
| -------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **MathAnswerGeneratorPrompt**    | Generates reasoning and answers for mathematical problems | Math problem solving, formula derivation, theorem proofs, and calculation tasks      | Built-in math-specific template emphasizing logical reasoning and formula representation, supporting step-by-step reasoning structures. |
| **GeneralAnswerGeneratorPrompt** | Generates general reasoning answers                       | Common reasoning, reading comprehension, general knowledge, and analytical questions | Highly versatile template supporting multi-domain logical reasoning and fluent natural language generation.                             |
| **DiyAnswerGeneratorPrompt**     | Custom reasoning template defined by the user             | When the user wants full control over prompt structure or output style               | Allows user-defined prompts and generation rules for maximum flexibility and controllability; can be integrated with system parameters. |

## run Function

```python
def run(storage, input_key="instruction", output_key="generated_cot")
```

Executes the main operator logic — reads input data from storage, generates reasoning-based answers using the LLM with the specified prompt, and writes the results back to storage.

#### Parameters

| Name           | Type              | Default Value     | Description                                                            |
| :------------- | :---------------- | :---------------- | :--------------------------------------------------------------------- |
| **storage**    | `DataFlowStorage` | Required          | DataFlow storage instance responsible for reading and writing data.    |
| **input_key**  | `str`             | `"instruction"`   | Name of the input column corresponding to the question field.          |
| **output_key** | `str`             | `"generated_cot"` | Name of the output column corresponding to the generated answer field. |

## 🧠 Example Usage

```python
from dataflow.operators.reasoning import ReasoningAnswerGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC
from dataflow.prompts.reasoning.general import GeneralAnswerGeneratorPrompt

class ReasoningAnswerGeneratorTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="test_step3.jsonl",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )

        # Use API server as LLM serving
        self.llm_serving = APILLMServing_request(
                    api_url="",
                    model_name="gpt-4o",
                    max_workers=30
        )
        
        self.answer_generator = ReasoningAnswerGenerator(
            llm_serving=self.llm_serving,
            prompt_template=GeneralAnswerGeneratorPrompt()
        )
        
    def forward(self):
        self.answer_generator.run(
            storage = self.storage.step(),
            input_key = "instruction", 
            output_key = "generated_cot"
        )

if __name__ == "__main__":
    pl = ReasoningAnswerGeneratorTest()
    pl.forward()
```

#### 🧾 Default Output Format

| Field           | Type  | Description                                        |
| :-------------- | :---- | :------------------------------------------------- |
| `instruction`   | `str` | The input question text.                           |
| `generated_cot` | `str` | The reasoning-based answer generated by the model. |

Example Input:

```json
{
"instruction":"A triangle has sides of lengths 7, 24, and 25. Determine if it is a right triangle."
}
```

Example Output:

```json
{
"instruction":"A triangle has sides of lengths 7, 24, and 25. Determine if it is a right triangle.",
"generated_cot":"Solution:\n1. Identify key components and premises of the task\n→ Sides of the triangle are 7, 24, and 25.\n\n2. Apply relevant principles, theorems, or methods with step-by-step derivation or argument\n→ Use the Pythagorean theorem for a right triangle: a^2 + b^2 = c^2.\n→ Assume 25 is the hypotenuse (largest side), then check: 7^2 + 24^2 = 25^2.\n\n3. Perform any necessary calculations or logical checks with intermediate verification\n→ Calculate 7^2: 7^2 = 49.\n→ Calculate 24^2: 24^2 = 576.\n→ Calculate 25^2: 25^2 = 625.\n→ Verify: 49 + 576 = 625.\n\n4. Present the final answer or conclusion in a clear, unambiguous notation\n→ Since 7^2 + 24^2 = 25^2 holds true, the triangle is a right triangle.\n→ The triangle is a right triangle: \\\\boxed{\\text{Yes}}."
}
```
