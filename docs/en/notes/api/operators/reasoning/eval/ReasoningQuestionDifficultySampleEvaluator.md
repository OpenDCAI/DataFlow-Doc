---
title: ReasoningQuestionDifficultySampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/eval/reasoningquestiondifficultysampleevaluator/
---

## 📘 Overview

[ReasoningQuestionDifficultySampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/evaluate/reasoning_question_difficulty_sample_evaluator.py)
is a question difficulty evaluation operator. It analyzes the complexity of questions by calling a Large Language Model (LLM) and generates a difficulty score from 1 to 10 for each question.

## `__init__` function

```python
@prompt_restrict(
    MathQuestionDifficultyPrompt
)

@OPERATOR_REGISTRY.register()
class ReasoningQuestionDifficultySampleEvaluator(OperatorABC):
    def __init__(self, llm_serving: LLMServingABC = None):
```

### init Parameter Description

| Parameter Name  | Type          | Default | Description                           |
| :-------------- | :------------ | :----- | :----------------------------- |
| **llm_serving** | LLMServingABC | Required   | Large language model service instance for executing inference and generation. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Features |
| --------------- | -------- | -------- | -------- |
| MathQuestionDifficultyPrompt | Question difficulty evaluation | Evaluating the difficulty of user questions | Input question, output difficulty score from 1 to 10 |

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key:str="difficulty_score")
```

#### Parameters

| Name         | Type            | Default               | Description                           |
| :----------- | :-------------- | :------------------- | :----------------------------- |
| **storage**  | DataFlowStorage | Required                 | DataFlow storage instance for reading and writing data.   |
| **input_key**| str             | Required                 | Input column name corresponding to the question field.         |
| **output_key**| str             | "difficulty_score" | Output column name corresponding to the generated difficulty score field. |

## 🧠 Example Usage

```python
from dataflow.operators.reasoning import ReasoningQuestionDifficultySampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC
from dataflow.serving import APILLMServing_request

class ReasoningQuestionDifficultySampleEvaluatorTest():
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
        
        self.evaluator = ReasoningQuestionDifficultySampleEvaluator(llm_serving=self.llm_serving)
        
    def forward(self):
        self.evaluator.run(
            storage = self.storage.step(),
            input_key = "instruction",
            output_key = "difficulty_score",
        )

if __name__ == "__main__":
    pl = ReasoningQuestionDifficultySampleEvaluatorTest()
    pl.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| **difficulty_score** | int | The difficulty score of the question, from 1 to 10. |

Example input:

```json
{
    "instruction": "Calculate 2 to the power of 5."
}
```

Example output:

```json
{
    "difficulty_score": 3
}
```
