---
title: ReferenceRemoverRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/referenceremoverrefiner/
---

## 📘 Overview
`ReferenceRemoverRefiner` is an operator that removes unclosed reference tags and citation links from text, including various complete and incomplete forms of `<ref>` tags and `{{cite}}` templates. It cleans reference markers from text.

## __init__
```python
def __init__(self)
```
This operator does not require any parameters during initialization.

## Prompt Template Descriptions

## run
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name          | Type            | Default  | Description                                                         |
| :------------ | :-------------- | :------- | :------------------------------------------------------------------ |
| **storage**   | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str             | Required | The name of the input column containing the text to be cleaned.      |

## 🧠 Example Usage
```python

```
