---
title: AlpagasusSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/eval/alpagasussampleevaluator/
---

# AlpagasusSampleEvaluator

## 📘 Overview
The `AlpagasusSampleEvaluator` is an operator designed to evaluate the quality of instruction-following data samples. It leverages a large language model (LLM) to score samples based on a specified dimension (e.g., 'quality'), providing a numerical score that reflects the sample's performance. A higher score indicates better quality.

## `__init__`
```python
def __init__(self, llm_serving: LLMServingABC = None, dimension: str = 'quality')
```
| Parameter | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| **llm_serving** | LLMServingABC | None | An LLM serving instance that implements the `LLMServingABC` interface, used to generate evaluation scores. |
| **dimension** | str | 'quality' | The dimension to evaluate the sample on. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Features |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str, input_input_key: str, input_output_key: str, output_key: str='AlpagasusScore')
```
Executes the main logic of the operator. It reads an input DataFrame from storage, generates evaluation scores for each sample using an LLM, and writes the DataFrame with the new score column back to storage.

| Parameter | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance responsible for reading and writing data. |
| **input_instruction_key** | str | Required | The column name in the input DataFrame that contains the instruction text. |
| **input_input_key** | str | Required | The column name in the input DataFrame that contains the input text for the instruction. |
| **input_output_key** | str | Required | The column name in the input DataFrame that contains the model's generated response. |
| **output_key** | str | 'AlpagasusScore' | The name of the new column that will be added to store the evaluation scores. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator adds a new column (defaulting to `AlpagasusScore`) to the input DataFrame. All existing columns are preserved.

| Field | Type | Description |
| :--- | :-- | :--- |
| ... | ... | Original columns from the input DataFrame. |
| AlpagasusScore | float | The numerical quality score assigned by the LLM. |
