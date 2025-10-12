---
title: ReasoningQuestionCategorySampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/eval/reasoningquestioncategorysampleevaluator/
---

## 📘 Overview

The `ReasoningQuestionCategorySampleEvaluator` is an operator designed to perform hierarchical classification (primary and secondary categories) on user questions. It utilizes a Large Language Model (LLM) to conduct semantic analysis on the input question and outputs the corresponding category codes. This process helps in organizing and routing questions based on their subject matter.

## `__init__` function

```python
def __init__(self, llm_serving: LLMServingABC = None)
```

| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | An instance of a large language model service, used for executing inference and generation. |

### Prompt Template Descriptions

| Prompt Template Name | Main Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| MathQuestionCategoryPrompt | Multi-level question classification | Classifying user questions into primary and secondary categories | Takes input questions and outputs primary and secondary classifications |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key:str = "instruction", output_key:str="question_category")
```

| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | "instruction" | The name of the input column containing the question text. |
| **output_key** | str | "question_category" | The base name for the output classification results. Note: this key is used for validation to prevent overwriting existing columns. |

## 🧠 Example Usage

```python
from dataflow.operators.reasoning import ReasoningQuestionCategorySampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC
from dataflow.serving import APILLMServing_request

class ReasoningQuestionCategorySampleEvaluatorTest():
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
        
        self.evaluator = ReasoningQuestionCategorySampleEvaluator(llm_serving=self.llm_serving)
        
    def forward(self):
        self.evaluator.run(
            storage = self.storage.step(),
            input_key = "instruction",
            output_key = "category",
        )

if __name__ == "__main__":
    pl = ReasoningQuestionCategorySampleEvaluatorTest()
    pl.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| instruction | str | The input question text. |
| primary_category | str | The identified primary category of the question. |
| secondary_category | str | The identified secondary category of the question. |

**Example Input:**

```json
{
    "instruction": "How do you calculate the volume of a sphere with a radius of 5 units?"
}
```

**Example Output:**

```json
{
    "instruction": "How do you calculate the volume of a sphere with a radius of 5 units?",
    "primary_category": "Geometry",
    "secondary_category": "Volume and Surface Area"
}
```
