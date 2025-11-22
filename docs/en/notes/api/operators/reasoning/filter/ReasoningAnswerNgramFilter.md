---
title: ReasoningAnswerNgramFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/filter/reasoninganswerngramfilter/
---

## 📘 Overview

[ReasoningAnswerNgramFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/filter/reasoning_answer_ngram_filter.py) is a filtering operator based on n-gram repetition rates, designed to detect and filter out answers containing excessive repetitive patterns. This operator calculates n-gram repetition scores in question and answer texts, and retains qualified data rows based on set threshold ranges.

## `__init__` Function

```python
@OPERATOR_REGISTRY.register()
class ReasoningAnswerNgramFilter(OperatorABC):
    def __init__(self,
                min_score: float = 0.1,
                max_score: float = 1.0,
                ngrams: int = 5):
```

### `__init__` Parameters

| Parameter Name  | Type  | Default | Description                                    |
| :-------------- | :---- | :------ | :--------------------------------------------- |
| **min_score**   | float | 0.1     | Minimum acceptable n-gram repetition score.   |
| **max_score**   | float | 1.0     | Maximum acceptable n-gram repetition score.   |
| **ngrams**      | int   | 5       | N-gram size used for calculating repetition.  |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_question_key: str = "instruction", input_answer_key: str = "generated_cot")
```

Executes the main operator logic, reads input DataFrame from storage, calculates n-gram repetition scores and performs filtering, then writes the filtered results back to storage.

#### Parameters

| Name                   | Type            | Default         | Description                                      |
| :--------------------- | :-------------- | :-------------- | :----------------------------------------------- |
| **storage**            | DataFlowStorage | Required        | DataFlow storage instance for reading and writing data. |
| **input_question_key** | str             | "instruction"   | Input column name corresponding to question field. |
| **input_answer_key**   | str             | "generated_cot" | Input column name corresponding to answer field.   |

## 🧠 Example Usage

```python
from dataflow.operators.reasoning import ReasoningAnswerNgramFilter
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC

class ReasoningAnswerNgramFilterTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.operator = ReasoningAnswerNgramFilter(
            min_score=0.1,
            max_score=1.0,
            ngrams=5
        )   
        
    def forward(self):
        self.operator.run(
            storage = self.storage.step(),
            input_question_key="instruction",
            input_answer_key="generated_cot"
        )

if __name__ == "__main__":
    pl = ReasoningAnswerNgramFilterTest()
    pl.forward()
```

#### 🧾 Default Output Format

This operator does not change the data structure but filters rows. The output DataFrame will contain the same columns as the input, but only retains data rows where the n-gram repetition score of the combined text from `input_question_key` and `input_answer_key` falls within the `[min_score, max_score]` range.

| Field         | Type | Description                        |
| :------------ | :--- | :--------------------------------- |
| instruction   | str  | Input question text.               |
| generated_cot | str  | Model-generated reasoning answer.  |

**Example Input:**

Assume there are two samples, one with high repetition and one with low repetition.

```json
// Sample 1 (High Repetition)
{
"instruction": "What is love?",
"generated_cot": "Love is love is love is love is love is love is love is love."
}
// Sample 2 (Low Repetition)
{
"instruction": "A triangle has sides of lengths 7, 24, and 25. Determine if it is a right triangle.",
"generated_cot":"Solution:\n1. Identify key components and premises of the task\n→ Sides of the triangle are 7, 24, and 25.\n\n2. Apply relevant principles, theorems, or methods with step-by-step derivation or argument\n→ Use the Pythagorean theorem for a right triangle: a^2 + b^2 = c^2.\n→ Assume 25 is the hypotenuse (largest side), then check: 7^2 + 24^2 = 25^2.\n\n3. Perform any necessary calculations or logical checks with intermediate verification\n→ Calculate 7^2: 7^2 = 49.\n→ Calculate 24^2: 24^2 = 576.\n→ Calculate 25^2: 25^2 = 625.\n→ Verify: 49 + 576 = 625.\n\n4. Present the final answer or conclusion in a clear, unambiguous notation\n→ Since 7^2 + 24^2 = 25^2 holds true, the triangle is a right triangle.\n→ The triangle is a right triangle: \\boxed{\text{Yes}}."
}
```

**Example Output:**

Using default parameters (`min_score=0.1`, `max_score=1.0`, `ngrams=5`), the first sample will be filtered out due to excessive repetition as its score will be below 0.1. The second sample has low repetition, with a score within the range, so it is retained.

```json
{
"instruction":"A triangle has sides of lengths 7, 24, and 25. Determine if it is a right triangle.",
"generated_cot":"Solution:\n1. Identify key components and premises of the task\n→ Sides of the triangle are 7, 24, and 25.\n\n2. Apply relevant principles, theorems, or methods with step-by-step derivation or argument\n→ Use the Pythagorean theorem for a right triangle: a^2 + b^2 = c^2.\n→ Assume 25 is the hypotenuse (largest side), then check: 7^2 + 24^2 = 25^2.\n\n3. Perform any necessary calculations or logical checks with intermediate verification\n→ Calculate 7^2: 7^2 = 49.\n→ Calculate 24^2: 24^2 = 576.\n→ Calculate 25^2: 25^2 = 625.\n→ Verify: 49 + 576 = 625.\n\n4. Present the final answer or conclusion in a clear, unambiguous notation\n→ Since 7^2 + 24^2 = 25^2 holds true, the triangle is a right triangle.\n→ The triangle is a right triangle: \\boxed{\text{Yes}}."
}
```
