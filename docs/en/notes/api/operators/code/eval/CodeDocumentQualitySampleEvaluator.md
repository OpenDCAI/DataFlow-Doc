---
title: CodeDocumentQualitySampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/eval/codedocumentqualitysampleevaluator/
---

## 📘 CodeDocumentQualitySampleEvaluator
The `CodeDocumentQualitySampleEvaluator` is an operator that evaluates code samples based on comprehensive document-level quality metrics. It calculates various scores related to content length, repetition patterns, character composition, and text entropy, providing a final quality score to help filter low-quality content.

## __init__
```python
def __init__(self, thresholds: Dict[str, Any] = None)
```
| Parameter | Type | Default | Description |
| :---------- | :---------------- | :------ | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **thresholds** | Dict[str, Any] | None | A dictionary of thresholds to override the default quality metric checks. Keys are metric names (e.g., 'min_num_chars') and values are the threshold values. |

### Prompt Template Descriptions


## run
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
| Parameter | Type | Default | Description |
| :---------- | :---------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **storage** | DataFlowStorage | Required | DataFlowStorage instance for reading and writing the DataFrame. |
| **input_key** | str | Required | The column name in the DataFrame that contains the input data. The input data can be a dictionary (with 'text', 'filename', 'language' keys) or a raw text string. |

## 🧠 Example Usage
```python

```

#### 🧾 Default output format (Output Format)
The operator adds several new columns to the input DataFrame, each corresponding to a specific quality metric.

| Field | Type | Description |
| :--------------------------------------- | :------ | :--------------------------------------------------------------------- |
| *{input_key}* | dict/str | The original input data from the specified input column. |
| **CodeDocumentQualityCharCount** | int | The total number of characters in the text. |
| **CodeDocumentQualityWordCount** | int | The total number of words in the text. |
| **CodeDocumentQualityDuplicateLinesRatio** | float | The ratio of duplicate lines to total lines. |
| **CodeDocumentQualityDuplicateNgramRatio** | float | The ratio of duplicate N-grams (e.g., 2-grams, 3-grams). |
| **CodeDocumentQualityCurlyBracketRatio** | float | The ratio of curly bracket characters to total characters. |
| **CodeDocumentQualityAllCapsRatio** | float | The ratio of all-caps words to total words. |
| **CodeDocumentQualityEntropy** | float | The unigram entropy of the text. |
| **CodeDocumentQualityScore** | float | The final comprehensive quality score (1.0 if all checks pass, 0.0 otherwise). |

Example Input:
```json
{
  "code_sample": {
    "text": "def hello():\n    print('Hello, World!')\n\ndef hello():\n    print('Hello, World!')",
    "filename": "hello.py",
    "language": "python"
  }
}
```
Example Output (assuming `input_key="code_sample"`):
```json
{
  "code_sample": {
    "text": "def hello():\n    print('Hello, World!')\n\ndef hello():\n    print('Hello, World!')",
    "filename": "hello.py",
    "language": "python"
  },
  "CodeDocumentQualityCharCount": 84,
  "CodeDocumentQualityWordCount": 8,
  "CodeDocumentQualityDuplicateLinesRatio": 1.0,
  "CodeDocumentQualityCurlyBracketRatio": 0.0,
  "CodeDocumentQualityAllCapsRatio": 0.0,
  "CodeDocumentQualityEntropy": 3.0,
  "CodeDocumentQualityScore": 0.0
}