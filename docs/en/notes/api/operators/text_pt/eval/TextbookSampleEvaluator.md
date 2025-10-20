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

```

#### 🧾 Default Output Format (Output Format)
The operator adds the `output_key` column to the existing dataframe.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input dataframe are preserved. |
| **TextbookScore** | float | The educational value score assigned by the classifier. The value is a float derived from a weighted sum of 'Low' (1.0), 'Mid' (3.0), and 'High' (5.0) probabilities. |
