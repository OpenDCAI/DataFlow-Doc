---
title: RemoveEmojiRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removeemojirefiner/
---

## 📘 Overview

The `RemoveEmojiRefiner` is an operator designed to remove Unicode emojis from text. It uses a regular expression to identify and filter out a wide range of emojis, including emoticons, symbols, transport icons, and flags, ensuring clean text data for downstream processing.

## `__init__` function

```python
def __init__(self)
```

This operator has no parameters for initialization.

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name          | Type              | Default | Description                                                        |
| :------------ | :---------------- | :------ | :----------------------------------------------------------------- |
| **storage**   | `DataFlowStorage` | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_key** | `str`             | Required | The name of the input column containing the text to be processed.     |

## Prompt Template Descriptions

## 🧠 Example Usage
