---
title: ReasoningTokenDatasetEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/eval/reasoningtokendatasetevaluator/
---

## 📘 Overview

[ReasoningTokenDatasetEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) is an operator used to evaluate token information in datasets. It is responsible for counting the number of tokens in question and answer texts, and provides key statistical metrics such as minimum, maximum, mean, and median values. This operator encodes text through a specified tokenizer, helping users understand the text length distribution characteristics of the dataset.

## `__init__` function

```python
@OPERATOR_REGISTRY.register()
class ReasoningTokenDatasetEvaluator(OperatorABC):
    def __init__(self, model_name_or_path: str):
```

### init Parameter Description

| Parameter Name | Type | Default | Description |
| :----- | :--- | :----- | :--- |
| **model_name_or_path** | str | Required | The tokenizer model path or its path on Hugging Face for tokenization. |

## run function

```python
def run(self, storage: DataFlowStorage, input_question_key: str, input_answer_key: str, model_name_or_path: str)
```

Executes the main logic of the operator, reads input DataFrame from storage, counts token information for questions and answers, and returns a dictionary containing statistical results.

#### Parameters

| Name                 | Type              | Default | Description                                                     |
| :------------------- | :---------------- | :----- | :------------------------------------------------------- |
| **storage**          | DataFlowStorage   | Required   | DataFlow storage instance responsible for reading data.                           |
| **input_question_key** | str               | Required   | Column name for the question column in the input data.                                 |
| **input_answer_key**   | str               | Required   | Column name for the answer column in the input data.                                 |
| **model_name_or_path** | str               | Required   | Tokenizer model name or its path on Hugging Face for tokenization. |

## 🧠 Example Usage

```python
from dataflow.operators.reasoning import ReasoningTokenDatasetEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC

class ReasoningTokenDatasetEvaluatorTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = ReasoningTokenDatasetEvaluator(model_name_or_path="Qwen/Qwen2.5-0.5B-Instruct")
        
    def forward(self):
        self.evaluator.run(
            storage = self.storage.step(),
            input_question_key = "instruction",
            input_answer_key = "output",
        )

if __name__ == "__main__":
    pl = ReasoningTokenDatasetEvaluatorTest()
    pl.forward()
```

#### 🧾 Default Output Format

| Field                  | Type  | Description                         |
| :-------------------- | :---- | :--------------------------- |
| questions_zeros_count | int   | Number of samples with 0 question tokens. |
| answers_zeros_count   | int   | Number of samples with 0 answer tokens. |
| questions_min         | int   | Minimum number of question tokens.      |
| questions_max         | int   | Maximum number of question tokens.      |
| questions_mean        | float | Average number of question tokens.      |
| questions_median      | float | Median number of question tokens.      |
| answers_min           | int   | Minimum number of answer tokens.      |
| answers_max           | int   | Maximum number of answer tokens.      |
| answers_mean          | float | Average number of answer tokens.      |
| answers_median        | float | Median number of answer tokens.      |

Example output:

```json
{
    "questions_zeros_count": 0,
    "answers_zeros_count": 0,
    "questions_min": 10,
    "questions_max": 256,
    "questions_mean": 85.5,
    "questions_median": 78.0,
    "answers_min": 50,
    "answers_max": 1024,
    "answers_mean": 350.2,
    "answers_median": 320.0
}
```
