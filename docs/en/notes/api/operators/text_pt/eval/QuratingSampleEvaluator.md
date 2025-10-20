---
title: QuratingSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/eval/quratingsampleevaluator/
---

# 📘 QuratingSampleEvaluator
The `QuratingSampleEvaluator` evaluates text quality across four dimensions using the Qurating model (princeton-nlp/QuRater-1.3B): writing_style, required_expertise, facts_and_trivia, and educational_value. Each dimension returns a score between 0 and 1, providing a comprehensive assessment of overall text quality.

## __init__
```python
__init__(self, map_batch_size: int = 512, num_workers: int = 1, device_batch_size: int = 16, device: str = 'cuda', labels: list = ['writing_style', 'required_expertise', 'facts_and_trivia', 'educational_value'], model_cache_dir: str = './dataflow_cache')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **map_batch_size** | int | 512 | Batch size for the mapping function during data processing. |
| **num_workers** | int | 1 | Number of worker processes for data processing. |
| **device_batch_size** | int | 16 | Batch size for model inference on the specified device. |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda', 'cpu'). |
| **labels** | list | ['writing_style', 'required_expertise', 'facts_and_trivia', 'educational_value'] | A list of quality dimensions to evaluate. |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded model. |

## Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Features |
| :--- | :--- | :--- | :--- |
| | | | |

## run
```python
run(self, storage: DataFlowStorage, input_key: str, output_key: str)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be evaluated. |
| **output_key** | str | Required | The name for the output column. Note: This operator adds new columns for each score based on the `labels` parameter. |

## 🧠 Example Usage
```python
...
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| `{input_key}` | str | The original input text from the source column. |
| QuratingWritingStyleScore | float | The score for the writing style dimension (0-1). |
| QuratingRequiredExpertiseScore | float | The score for the required expertise dimension (0-1). |
| QuratingFactsAndTriviaScore | float | The score for the facts and trivia dimension (0-1). |
| QuratingEducationalValueScore | float | The score for the educational value dimension (0-1). |

**Example Input (assuming `input_key` is "text"):**
```json
{
    "text": "The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides."
}
```
**Example Output:**
```json
{
    "text": "The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.",
    "QuratingWritingStyleScore": 0.897,
    "QuratingRequiredExpertiseScore": 0.654,
    "QuratingFactsAndTriviaScore": 0.721,
    "QuratingEducationalValueScore": 0.932
}
```
