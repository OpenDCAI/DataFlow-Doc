---
title: KBCMultiHopQAGeneratorBatch
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/kbcmultihopqageneratorbatch/
---

## 📘 Overview

`KBCMultiHopQAGeneratorBatch` is a **batch-based multi-hop question-answer pair generation operator** designed to automatically generate questions and answers that require multi-step reasoning from given textual data.
By invoking a Large Language Model (LLM), this operator transforms raw text into structured QA data, suitable for constructing complex QA datasets or enhancing knowledge bases.

---

## **init** Function

```python
def __init__(self,
  llm_serving: LLMServingABC,
  seed: int = 0,
  lang="en",
  prompt_template = None
):
```

### Initialization Parameters

| Parameter           | Type          | Default                        | Description                                                                            |
| :------------------ | :------------ | :----------------------------- | :------------------------------------------------------------------------------------- |
| **llm_serving**     | LLMServingABC | Required                       | The LLM service instance used for inference and generation.                            |
| **seed**            | int           | 0                              | Random seed to ensure reproducibility of the generation process.                       |
| **lang**            | str           | "en"                           | Language setting that specifies the output language for QA pairs (e.g., "en" or "zh"). |
| **prompt_template** | PromptABC     | Text2MultiHopQAGeneratorPrompt | Prompt template object used to construct the input for multi-hop QA generation.        |

---

### Prompt Template Description

| Template Name                      | Purpose                               | Applicable Scenario                                                                | Key Features                                                                                                                                                   |
| ---------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Text2MultiHopQAGeneratorPrompt** | Generate multi-hop QA pairs from text | Scenarios that require constructing complex reasoning questions from long passages | Built-in template that guides the model to generate the question, reasoning steps, final answer, and supporting facts, ensuring structured and logical output. |

---

## run Function

```python
def run(
    self,
    input_key: str = 'chunk_path',
    output_key: str = 'enhanced_chunk_path',
    storage: DataFlowStorage = None,
):
```

### Parameters

| Name           | Type            | Default               | Description                                                                                          |
| :------------- | :-------------- | :-------------------- | :--------------------------------------------------------------------------------------------------- |
| **storage**    | DataFlowStorage | Required              | DataFlow storage instance responsible for reading and writing data.                                  |
| **input_key**  | str             | "chunk_path"          | The input column name that contains the path to JSON or JSONL files with text chunks to process.     |
| **output_key** | str             | "enhanced_chunk_path" | The output column name that will store the path to the enhanced files containing generated QA pairs. |

---

## 🧠 Example Usage

```python
self.knowledge_cleaning_step4 = KBCMultiHopQAGeneratorBatch(
    llm_serving=self.llm_serving,
    lang="en"
)
self.knowledge_cleaning_step4.run(
    storage=self.storage.step(),
)
```

---

## 🧾 Default Output Format

The operator reads the text files specified by `input_key`, generates QA pairs, and writes the enriched content back to the same file.

| Field        | Type | Description                                                                                                          |
| :----------- | :--- | :------------------------------------------------------------------------------------------------------------------- |
| **text**     | str  | The original context text.                                                                                           |
| **qa_pairs** | list | A list of generated multi-hop QA pairs, each containing the question, answer, reasoning steps, and supporting facts. |

### Example Input (`chunk_path` file content)

```json
{
  "cleaned_chunk": "The Eiffel Tower is located in Paris, the capital of France. The Louvre Museum, also in Paris, is the world's largest art museum."
}
```

### Example Output (after operator execution)

```json
{
  "cleaned_chunk": "The Eiffel Tower is located in Paris, the capital of France. The Louvre Museum, also in Paris, is the world's largest art museum.",
  "qa_pairs": [
    {
      "question": "In which country is the world's largest art museum located?",
      "reasoning_steps": [
        {"step": "The text states the Louvre Museum is the world's largest art museum."},
        {"step": "The text also states the Louvre Museum is in Paris."},
        {"step": "Paris is identified as the capital of France."}
      ],
      "answer": "France",
      "supporting_facts": [
        "The Louvre Museum, also in Paris, is the world's largest art museum.",
        "Paris, the capital of France."
      ],
      "type": "Geography"
    }
  ]
}
```
