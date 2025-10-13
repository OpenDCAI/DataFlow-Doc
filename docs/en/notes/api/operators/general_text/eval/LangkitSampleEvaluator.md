---
title: LangkitSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/langkitsampleevaluator/
---

# LangkitSampleEvaluator

## 📘 Overview
The `LangkitSampleEvaluator` is an operator that uses the Langkit toolkit to calculate text statistics for evaluating structural complexity and readability. It extracts multiple linguistic features including sentence length, lexical diversity, and sentiment.

## __init__
```python
def __init__(self)
```
### init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| *N/A* | *N/A* | *N/A* | This operator does not require any parameters during initialization. |

## Prompt Template Descriptions


## run
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :------------------------------------------------------------------ |
| **storage** | DataFlowStorage | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be evaluated. |

## 🧠 Example Usage


#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :------------------------------ | :---- | :----------------------------------------------- |
| *input_key* | str | The original input text from the source column. |
| LangkitNumSentencesScore | int | Number of sentences. |
| LangkitNumWordsScore | int | Number of words. |
| LangkitAvgWordLengthScore | float | Average word length. |
| LangkitFleschReadingEaseScore | float | Readability score (Flesch formula). |
| LangkitSentimentScore | float | Sentiment polarity (between -1 and 1). |
