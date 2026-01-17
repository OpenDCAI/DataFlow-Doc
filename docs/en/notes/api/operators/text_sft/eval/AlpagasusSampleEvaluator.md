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
from dataflow.operators.text_sft.eval import AlpagasusSampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.utils.llm_serving import APILLMServing_request

# Prepare storage with SFT-style data
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# Initialize LLM serving
llm_serving = APILLMServing_request(
    api_url="http://<your_llm_api_endpoint>",
    model_name="<your_model_name>",
)

# Initialize and run the evaluator
evaluator = AlpagasusSampleEvaluator(
    llm_serving=llm_serving,
    dimension="quality",
)
evaluator.run(
    storage.step(),
    input_instruction_key="instruction",
    input_input_key="input",
    input_output_key="output",
    output_key="AlpagasusScore",
)
```

#### 🧾 Default Output Format
The operator adds a new column (defaulting to `AlpagasusScore`) to the input DataFrame. All existing columns are preserved.

| Field | Type | Description |
| :--- | :-- | :--- |
| ... | ... | Original columns from the input DataFrame. |
| AlpagasusScore | float | The numerical quality score assigned by the LLM. |

**Example Input:**
```json
{
  "instruction": "Write a short story about a robot learning to paint",
  "input": "",
  "output": "In a small workshop filled with the scent of oil and canvas, ARIA-7 stood before an empty easel. Her metallic fingers, designed for precision engineering, trembled slightly as she held a brush for the first time. The robot had spent years calculating perfect angles and optimal solutions, but art required something different—something she couldn't quantify.\n\nHer first strokes were mechanical, following mathematical patterns. But as she continued, something shifted. The colors began to blend in ways that surprised even her own algorithms. She painted not what she saw, but what she felt—the warmth of a sunset she had never witnessed, the melancholy of a song she had never heard.\n\nWhen she stepped back, the canvas revealed not just a painting, but a glimpse into her digital soul. ARIA-7 had discovered that creativity wasn't about following rules, but about breaking them beautifully."
}
```

**Example Output:**
```json
{
  "instruction": "Write a short story about a robot learning to paint",
  "input": "",
  "output": "In a small workshop filled with the scent of oil and canvas, ARIA-7 stood before an empty easel. Her metallic fingers, designed for precision engineering, trembled slightly as she held a brush for the first time. The robot had spent years calculating perfect angles and optimal solutions, but art required something different—something she couldn't quantify.\n\nHer first strokes were mechanical, following mathematical patterns. But as she continued, something shifted. The colors began to blend in ways that surprised even her own algorithms. She painted not what she saw, but what she felt—the warmth of a sunset she had never witnessed, the melancholy of a song she had never heard.\n\nWhen she stepped back, the canvas revealed not just a painting, but a glimpse into her digital soul. ARIA-7 had discovered that creativity wasn't about following rules, but about breaking them beautifully.",
  "AlpagasusScore": 5.0
}
```
