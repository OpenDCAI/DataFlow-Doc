---
title: Phi4QAGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/generate/phi4qagenerator/
---

## 📘 Overview

The `Phi4QAGenerator` is an operator designed to generate multi-turn conversational question-and-answer data in a pre-training format based on given document content. It transforms raw text into a dialogue format suitable for language model pre-training.

## `__init__`

```python
def __init__(self, llm_serving: LLMServingABC)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | An LLM serving object that implements the `LLMServingABC` interface for model inference. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "generated_content")
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance used for reading the input DataFrame and writing the output. |
| **input_key** | str | "raw_content" | The column name in the input DataFrame that contains the source document content. |
| **output_key** | str | "generated_content" | The column name where the generated conversational data will be stored. |

## 🧠 Example Usage

```python
# Blank
```

#### 🧾 Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| raw\_content | str | The original input document text. |
| generated\_content | str | The generated multi-turn dialogue suitable for pre-training. |

**Example Input:**

```json
{
  "raw_content": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower."
}
```

**Example Output:**

```json
{
  "raw_content": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.",
  "generated_content": "<|user|>\nWhat is the Eiffel Tower made of?\n<|end|>\n<|assistant|>\nThe Eiffel Tower is a wrought-iron lattice tower.\n<|end|>\n<|user|>\nWho is it named after?\n<|end|>\n<|assistant|>\nIt is named after the engineer Gustave Eiffel, whose company designed and built the tower.\n<|end|>"
}
```
