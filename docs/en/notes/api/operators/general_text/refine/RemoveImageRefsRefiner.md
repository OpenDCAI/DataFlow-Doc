---
title: RemoveImageRefsRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removeimagerefsrefiner/
---

## 📘 Overview

The `RemoveImageRefsRefiner` is an operator designed to clean text by removing various image reference formats. It uses a set of pre-defined regular expressions to identify and eliminate patterns such as Markdown image links (e.g., `
![](images/a.jpg)
`), figure captions (e.g., `图 1-1：...`), and other garbled or special character sequences often associated with image placeholders. This helps in normalizing text data for downstream tasks.

## `__init__` function

```python
def __init__(self)
```

This operator does not require any parameters during initialization.

## `run` function

```python
def run(self, storage, input_key)
```

| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, used for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be processed. |

## Prompt Template Descriptions

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

The operator modifies the specified `input_key` column in place. The output DataFrame will have the same structure as the input, but with the image references removed from the target column.

**Example Input:**
```json
{
"text": "Here is an image: 
![](images/0a4b.jpg)
. This is followed by another reference like 图 1-2：A sample diagram."
}
```
**Example Output:**
```json
{
"text": "Here is an image: . This is followed by another reference like ."
}
```
