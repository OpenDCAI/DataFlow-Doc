---
title: ReasoningPretrainFormatConvertGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/generate/reasoningpretrainformatconvertgenerator/
---

```markdown
## 📘 Overview

[ReasoningPretrainFormatConvertGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_pretrain_format_convert_generator.py) is an operator designed to convert data from a Supervised Fine-Tuning (SFT) format to a pre-training format. It achieves this by concatenating a question and its corresponding answer into a single text field, which is a common requirement for pre-training language models.

## `__init__` function

```python
def __init__(self)
```

This operator does not require any parameters during initialization.

## `run` function

```python
def run(self, storage: DataFlowStorage, input_read_key_question: str = "question", input_read_key_answer: str = "answer", output_key: str = "text")
```

Executes the main logic of the operator. It reads a DataFrame from storage, concatenates the specified question and answer columns, and writes the result back to storage.

| Name                      | Type            | Default    | Description                                                  |
| :------------------------ | :-------------- | :--------- | :----------------------------------------------------------- |
| **storage**               | DataFlowStorage | Required   | The DataFlow storage instance used for reading and writing data. |
| **input_read_key_question** | str             | "question" | The column name of the question field in the input DataFrame.  |
| **input_read_key_answer** | str             | "answer"   | The column name of the answer field in the input DataFrame.    |
| **output_key**            | str             | "text"     | The column name for the generated output text field.         |

## Prompt Template Descriptions



## 🧠 Example Usage

```python
from dataflow.operators.reasoning import ReasoningPretrainFormatConvertGenerator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC

class ReasoningPretrainFormatConvertGeneratorTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.operator = ReasoningPretrainFormatConvertGenerator()
        
    def forward(self):
        self.operator.run(
            storage = self.storage.step(),
            input_read_key_question = "instruction",
            input_read_key_answer = "output",
            output_key = "text"
        )

if __name__ == "__main__":
    pl = ReasoningPretrainFormatConvertGeneratorTest()
    pl.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description                                        |
| :---- | :--- | :------------------------------------------------- |
| text  | str  | The concatenated text of the question and answer. |

**Example Input:**

```json
{
  "question": "What is the capital of France?",
  "answer": "The capital of France is Paris."
}
```

**Example Output:**

```json
{
  "text": "What is the capital of France?\nThe capital of France is Paris."
}
```
```
