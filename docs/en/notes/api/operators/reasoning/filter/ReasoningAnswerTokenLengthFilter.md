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

## 🧾 Output Format

The operator filters the input DataFrame. The output format is identical to the input format, but only contains the rows where the token count of the text in the `input_key` column is less than or equal to `max_answer_token_length`. No new columns are added.

**Example Input:**
```json
[
    {
        "instruction": "Explain quantum computing in one sentence.",
        "generated_cot": "Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations."
    },
    {
        "instruction": "Write a short story.",
        "generated_cot": "[A very long story text that exceeds the token limit...]"
    }
]
```

**Example Output (assuming `max_answer_token_length` is 50):**
```json
[
    {
        "instruction": "Explain quantum computing in one sentence.",
        "generated_cot": "Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations."
    }
]
```
