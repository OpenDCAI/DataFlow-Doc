---
title: SFTGeneratorSeed
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/generate/sftgeneratorseed/
---

## 📘 Overview

The `SFTGeneratorSeed` is an operator designed to generate supervised fine-tuning (SFT) formatted question-and-answer data based on the content of a given document. It allows users to provide a custom prompt to guide the generation process, extracting information from raw documents to create instruction-response pairs suitable for model fine-tuning.

## `__init__`

```python
def __init__(self, llm_serving: LLMServingABC, custom_prompt: str)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | An LLM serving instance that implements the `LLMServingABC` interface for model inference. |
| **custom_prompt** | str | Required | A user-defined string that serves as the prompt template for generating the SFT data. |

## Prompt Template Descriptions

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content")
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The dataflow storage instance used to read the input data and write the results. |
| **input_key** | str | "raw_content" | The name of the column in the input data that contains the source document content. |

## 🧠 Example Usage

## 🧾 Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| instruction | str | The generated instruction or question. |
| output | str | The generated response or answer corresponding to the instruction. |
| raw_content | str | The original document content from which the instruction-output pair was generated. |

**Example Input:**

```json
{
  "raw_content": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. Constructed from 1887 to 1889 as the entrance to the 1889 World's Fair, it was initially criticized by some of France's leading artists and intellectuals for its design, but it has become a global cultural icon of France and one of the most recognizable structures in the world."
}
```

**Example Output:**

```json
{
  "instruction": "Who was the Eiffel Tower named after and why?",
  "output": "The Eiffel Tower is named after the engineer Gustave Eiffel, because it was his company that designed and built the tower.",
  "raw_content": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. Constructed from 1887 to 1889 as the entrance to the 1889 World's Fair, it was initially criticized by some of France's leading artists and intellectuals for its design, but it has become a global cultural icon of France and one of the most recognizable structures in the world."
}
```
