---
title: LexicalDiversitySampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/lexicaldiversitysampleevaluator/
---

## 📘 Overview
`LexicalDiversitySampleEvaluator` is an operator that measures the lexical diversity of a given text. It employs two standard metrics: MTLD (Measure of Textual Lexical Diversity) and HDD (Hypergeometric Distribution Diversity) to calculate diversity scores. This operator is useful for assessing the richness and variety of vocabulary in a text corpus.

## __init__ function
```python
def __init__(self)
```
This function does not take any parameters.

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
| Name | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be evaluated. |

## 🧠 Example Usage
```python
```

#### 🧾 Default output format (Output Format)
The operator adds new columns to the existing dataframe for each lexical diversity score.

| Field | Type | Description |
| :------------------------------ | :------------- | :------------------------------------------------------------------------------------------------- |
| `(existing columns)` | - | The original columns from the input dataframe are preserved. |
| `LexicalDiversityMTLDScore` | float / None | MTLD diversity score (higher = more diverse). `None` if the text has <= 50 words. |
| `LexicalDiversityHD-DScore` | float / None | HDD diversity score (higher = more diverse). `None` if text length is not between 50 and 1000 words. |

**Example Input:**
```json
{
"text": "The quick brown fox jumps over the lazy dog. He repeats this action again and again, showing great agility and spirit. The variety of words used in this description is what we are currently analyzing for its lexical properties."
}
```
**Example Output:**
```json
{
"text": "The quick brown fox jumps over the lazy dog. He repeats this action again and again, showing great agility and spirit. The variety of words used in this description is what we are currently analyzing for its lexical properties.",
"LexicalDiversityMTLDScore": 42.5,
"LexicalDiversityHD-DScore": 0.85
}
```
