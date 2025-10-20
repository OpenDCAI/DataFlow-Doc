---
title: ReasoningPseudoAnswerGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/generate/reasoningpseudoanswergenerator/
---

## 📘 Overview
[ReasoningPseudoAnswerGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) is an operator that generates multiple candidate answers for a given question and then selects the most frequent one as the final pseudo-answer. This approach enhances the reliability of the generated answer by leveraging consensus among multiple generation attempts.

## `__init__` function

```python
def __init__(self, llm_serving: LLMServingABC = None, max_times: int = 3):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | Large language model serving instance, used for inference and generation. |
| **max_times** | int | 3 | The number of times to generate an answer for each question to find the most frequent one. |

### Prompt Template Description
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| MathAnswerGeneratorPrompt | Generate answers for questions | Pseudo answer generation | Takes a question as input and outputs an answer |

## `run` function

```python
def run(
    self,
    storage: DataFlowStorage,
    input_key: str = "instruction",
    output_key_answer: str = "pseudo_answers",
    output_key_answer_value: str = "pseudo_answer_value",
    output_key_solutions: str = "pseudo_solutions",
    output_key_correct_solution_example: str = "pseudo_correct_solution_example",
):
```

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | "instruction" | Input column name, corresponding to the question field. |
| **output_key_answer** | str | "pseudo_answers" | Output column name for the list of all generated candidate answers. |
| **output_key_answer_value**| str | "pseudo_answer_value"| Output column name for the final, most frequent answer value. |
| **output_key_solutions** | str | "pseudo_solutions" | Output column name for the list of reasoning steps (solutions) that produced the final answer. |
| **output_key_correct_solution_example**| str | "pseudo_correct_solution_example"| Output column name for a single example of a correct reasoning step (solution). |

## 🧠 Example Usage

```python
from dataflow.operators.reasoning import ReasoningPseudoAnswerGenerator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC
from dataflow.serving import APILLMServing_request

class ReasoningPseudoAnswerGeneratorTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        # use API server as LLM serving
        self.llm_serving = APILLMServing_request(
                    api_url="",
                    model_name="gpt-4o",
                    max_workers=30
        )
        
        self.operator = ReasoningPseudoAnswerGenerator(
            llm_serving = self.llm_serving,
            max_times = 3
        )
        
    def forward(self):
        self.operator.run(
            storage = self.storage.step(),
            input_key = "instruction",
            output_key_answer = "pseudo_answers",
            output_key_answer_value = "pseudo_answer_value",
            output_key_solutions = "pseudo_solutions",
            output_key_correct_solution_example = "pseudo_correct_solution_example",
        )

if __name__ == "__main__":
    pl = ReasoningPseudoAnswerGeneratorTest()
    pl.forward()
```

#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :--- | :--- | :--- |
| instruction | str | The input question text. |
| pseudo_answers | list | A list of all candidate answers generated in `max_times` iterations. |
| pseudo_answer_value | str | The final selected answer, which is the most frequent among the candidates. |
| pseudo_solutions | list | A list of reasoning solutions that led to the final `pseudo_answer_value`. |
| pseudo_correct_solution_example | str | An example of a single reasoning solution that led to the final answer. |

**Example Input:**
```json
{
    "instruction": "A farmer has 15 cows and sells 7. How many cows does he have left?"
}
```

**Example Output:**
```json
{
    "instruction": "A farmer has 15 cows and sells 7. How many cows does he have left?",
    "pseudo_answers": [
        "8",
        "8",
        "9"
    ],
    "pseudo_answer_value": "8",
    "pseudo_solutions": [
        "The farmer starts with 15 cows. He sells 7 cows. To find out how many are left, we subtract the number of cows sold from the initial number: 15 - 7 = 8. The farmer has 8 cows left.",
        "Initial cows: 15. Cows sold: 7. Remaining cows = 15 - 7 = 8. So, the answer is 8."
    ],
    "pseudo_correct_solution_example": "The farmer starts with 15 cows. He sells 7 cows. To find out how many are left, we subtract the number of cows sold from the initial number: 15 - 7 = 8. The farmer has 8 cows left."
}
```
