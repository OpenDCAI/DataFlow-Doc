---
title: ReasoningAnswerTokenLengthFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/filter/reasoninganswertokenlengthfilter/
---

## 📘 Overview

The `ReasoningAnswerTokenLengthFilter` is an operator designed to filter out answers that exceed a specified token length limit. It uses a tokenizer to count the number of tokens in a given answer string and retains only those entries that are within the configured maximum length.

## `__init__` function

```python
def __init__(self,
            max_answer_token_length: int = 8192,
            tokenizer_dir: str = "Qwen/Qwen2.5-0.5B-Instruct")
```

| Parameter                 | Type | Default                        | Description                                     |
| :------------------------ | :--- | :----------------------------- | :---------------------------------------------- |
| **max_answer_token_length** | int  | 8192                           | The maximum number of tokens allowed for an answer. |
| **tokenizer_dir**         | str  | "Qwen/Qwen2.5-0.5B-Instruct" | The directory path or model name for the tokenizer.   |

### Prompt Template Descriptions

## `run` function

```python
def run(self,
        storage: DataFlowStorage,
        input_key: str = "generated_cot")
```

| Parameter   | Type            | Default         | Description                                                          |
| :---------- | :-------------- | :-------------- | :------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required        | The DataFlowStorage instance used for reading and writing data.      |
| **input_key** | str             | "generated_cot" | The name of the input column containing the answers to be filtered. |

## 🧠 Example Usage

```python
from dataflow.operators.reasoning import ReasoningAnswerTokenLengthFilter
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC

class ReasoningAnswerTokenLengthFilterTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.operator = ReasoningAnswerTokenLengthFilter(
            max_answer_token_length=8192,
            tokenizer_dir="Qwen/Qwen2.5-0.5B-Instruct"
            )   
        
    def forward(self):
        self.operator.run(
            storage = self.storage.step(),
            input_key="output"
        )

if __name__ == "__main__":
    pl = ReasoningAnswerTokenLengthFilterTest()
    pl.forward()
```

#### 🧾 Default Output Format (Output Format)
This operator is a filter that does not change the column structure of the data. The output data format is exactly the same as the input, but only includes rows where the token length in the `input_key` column meets the `max_answer_token_length` limit.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... (Original input fields) | ... | All original fields from the input data will be preserved. |
| Column specified by `input_key` | str | Answer text that has passed length validation and meets the criteria. |
