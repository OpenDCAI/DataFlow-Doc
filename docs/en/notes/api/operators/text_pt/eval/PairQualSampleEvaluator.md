---
title: PairQualSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/eval/pairqualsampleevaluator/
---

## 📘 Overview
`PairQualSampleEvaluator` is a text quality scoring operator based on the BGE model, trained on GPT pairwise comparison data, supporting both English and Chinese.

## `__init__` function
```python
def __init__(self, model_cache_dir:str='./dataflow_cache', device="cuda", lang='en', max_length=512)
```
| Parameter | Type | Default Value | Description |
| :------------------ | :---- | :-------------------- | :--------------------------------------------------------- |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded model. |
| **device** | str | "cuda" | The device to run the model on (e.g., "cuda" or "cpu"). |
| **lang** | str | 'en' | The language of the model to use. Supports 'en' or 'zh'. |
| **max_length** | int | 512 | The maximum sequence length for the tokenizer. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| -------------------- | ----------- | -------------------- | ------------------- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='PairQualScore')
```
| Parameter | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be evaluated. |
| **output_key** | str | 'PairQualScore' | The name of the output column where the quality scores will be stored. |

## 🧠 Example Usage
```python
from dataflow.operators.text_pt.eval import PairQualSampleEvaluator
from dataflow.utils.storage import FileStorage

# Prepare data and storage
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# Initialize and run the operator
pairqual_evaluator = PairQualSampleEvaluator(lang='en')
pairqual_evaluator.run(
    storage.step(),
    input_key='raw_content',
    output_key='PairQualScore'
)
```
#### 🧾 Default Output Format
| Field | Type | Description |
| :-------------- | :---- | :------------------------------------------------------------ |
| ... | ... | Original columns from the input data. |
| PairQualScore | float | The calculated quality score. |

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
  "PairQualScore": 3.2509903908
}
```
