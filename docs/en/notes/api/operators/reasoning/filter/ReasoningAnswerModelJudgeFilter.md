---
title: ReasoningAnswerModelJudgeFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/filter/reasoninganswermodeljudgefilter/
---

## 📘 Overview [ReasoningAnswerModelJudgeFilter]
This operator evaluates the correctness of answers by comparing the semantic consistency between the current answer and the reference answer. It uses a large language model for semantic understanding and judgment, ultimately returning a binary classification result for each answer.

## `__init__` function
```python
def __init__(self,
            system_prompt: str = "You are a helpful assistant specialized in evaluating answer correctness.",
            llm_serving: LLMServingABC = None,
            prompt_template = AnswerJudgePrompt | DIYPromptABC,
            keep_all_samples: bool = False,
            ):
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **system_prompt** | str | "You are a helpful assistant..." | System prompt to define the behavior of the LLM. |
| **llm_serving** | LLMServingABC | None | An instance of the large language model serving class, responsible for executing inference. |
| **prompt_template** | AnswerJudgePrompt \| DIYPromptABC | AnswerJudgePrompt() | The prompt template object used to construct the evaluation prompt. |
| **keep_all_samples** | bool | False | If `True`, all samples are kept in the output. If `False`, only samples judged as correct are kept. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| AnswerJudgePrompt | Default prompt template for evaluating answer correctness. | Suitable for general answer judgment scenarios. | Contains fields for question, answer to be judged, and reference answer. |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_question_key: str = "question", input_answer_key: str = "answer", input_reference_key: str = "reference_answer")
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading and writing data. |
| **input_question_key** | str | "question" | The column name in the input data that contains the question. |
| **input_answer_key** | str | "answer" | The column name in the input data that contains the answer to be judged. |
| **input_reference_key**| str | "reference_answer" | The column name in the input data that contains the ground truth or reference answer. |

## 🧠 Example Usage
```python
from dataflow.operators.reasoning import ReasoningAnswerModelJudgeFilter
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC
from dataflow.serving import APILLMServing_request
from dataflow.prompts.reasoning.general import AnswerJudgePrompt

class ReasoningAnswerModelJudgeFilterTest():
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
        
        self.operator = ReasoningAnswerModelJudgeFilter(
            system_prompt="You are a helpful assistant specialized in evaluating answer correctness.",
            llm_serving=self.llm_serving,
            prompt_template=AnswerJudgePrompt(),
            keep_all_samples=False
        )   
        
    def forward(self):
        self.operator.run(
            storage = self.storage.step(),
            input_question_key="question",
            input_answer_key="answer",
            input_reference_key="reference_answer"  
        )

if __name__ == "__main__":
    pl = ReasoningAnswerModelJudgeFilterTest()
    pl.forward()
```

#### 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| question | str | The original input question text. (Or content from `input_question_key`) |
| answer | str | The original answer text to be judged. (Or content from `input_answer_key`) |
| reference_answer | str | The original reference answer text. (Or content from `input_reference_key`) |
| answer_match_result | bool | The result of the judgment: `True` if the answer is considered correct, `False` otherwise. |

Example input:

```json
{
    "question": "What is the highest mountain in the world?",
    "answer": "Mount Everest is the highest mountain in the world.",
    "reference_answer": "Mount Everest"
}
```

Example output:

```json
{
    "question": "What is the highest mountain in the world?",
    "answer": "Mount Everest is the highest mountain in the world.",
    "reference_answer": "Mount Everest",
    "answer_match_result": true
}
```
