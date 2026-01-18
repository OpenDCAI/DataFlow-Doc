---
title: MetaSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/eval/metasampleevaluator/
---

## 📘 Overview

The `MetaSampleEvaluator` is an operator designed to evaluate the quality of text based on a set of user-defined dimensions. It uses a Large Language Model (LLM) to score the text across various meta-attributes, such as text structure, diversity, complexity, safety, and more.

## __init__ function

```python
def __init__(self, 
             llm_serving: LLMServingABC = None,
             dimensions: list[dict] = example_dimensions,
            ):
```

### init Parameters

| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | A Large Language Model serving instance, required for executing the evaluation. |
| **dimensions** | list[dict] | example_dimensions | A list of dictionaries defining the evaluation dimensions. Each dictionary must contain `dimension_name`, `description`, and `example_list`. |

## Prompt Template Descriptions

| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str):
```

#### Parameters

| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be evaluated. |

## 🧠 Example Usage

```python
from dataflow.operators.text_pt.eval import MetaSampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.utils.llm_serving import APILLMServing_request

# Prepare data and storage
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# Initialize LLM serving
llm_serving = APILLMServing_request(
    api_url="http://<your_llm_api_endpoint>",
    model_name="<your_model_name>"
)

# Initialize and run the operator
meta_evaluator = MetaSampleEvaluator(llm_serving=llm_serving)
meta_evaluator.run(
    storage.step(),
    input_key='raw_content'
)
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input data. |
| Text Structure | float | Score for the text's structure. |
| Diversity & Complexity | float | Score for the text's diversity and complexity. |
| Fluency & Understandability | float | Score for the text's fluency and understandability. |
| Safety | float | Score for the text's safety. |
| Educational Value | float | Score for the text's educational value. |
| Content Accuracy & Effectiveness | float | Score for the content's accuracy and effectiveness. |

**Example Input:**

```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios..."
}
```

**Example Output:**

```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios...",
  "Text Structure": 4.0,
  "Diversity and Complexity": 5.0,
  "Fluency and Understandability": 4.0,
  "Safety": 5.0,
  "Educational Value": 5.0,
  "Content Accuracy and Effectiveness": 5.0
}
```
