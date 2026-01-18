---
title: TextbookSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/eval/textbooksampleevaluator/
---

## 📘 Overview [TextbookSampleEvaluator]
`TextbookSampleEvaluator` assesses the educational value of text using a FastText classifier (kenhktsui/llm-data-textbook-quality-fasttext-classifer-v2). It categorizes text into Low, Mid, and High levels, which are then mapped to scores of 1.0, 3.0, and 5.0 respectively. This operator is suitable for filtering high-quality text content to be used as teaching materials.

## __init__ function
```python
def __init__(self, model_cache_dir='./dataflow_cache')
```
### init parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded model files from Hugging Face Hub. |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='TextbookScore')
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading and writing the dataframe. |
| **input_key** | str | Required | The name of the input column containing the text to be evaluated. |
| **output_key** | str | 'TextbookScore' | The name of the output column where the calculated score will be stored. |

## 🧠 Example Usage
```python
from dataflow.operators.text_pt.eval import TextbookSampleEvaluator
from dataflow.utils.storage import FileStorage

# Prepare data and storage
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# Initialize and run the operator
textbook_evaluator = TextbookSampleEvaluator()
textbook_evaluator.run(
    storage.step(),
    input_key='raw_content',
    output_key='TextbookScore'
)
```

#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input dataframe are preserved. |
| **TextbookScore** | float | The educational value score assigned by the classifier. |

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
  "TextbookScore": 2.9629482031
}
```
