---
title: StemmingLemmatizationRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/stemminglemmatizationrefiner/
---

## 📘 Overview

The `StemmingLemmatizationRefiner` is an operator designed to process text by converting words into their basic forms through either stemming or lemmatization. It supports two methods: Porter stemming and WordNet lemmatization, which can be selected via a parameter. This helps in normalizing text for various natural language processing tasks.

## `__init__` function

```python
def __init__(self, method: str = "stemming"):
```

### init Parameters

| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **method** | str | "stemming" | The processing method to use. Can be either 'stemming' or 'lemmatization'. |

### Prompt Template Descriptions

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str):
```

#### Parameters

| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlowStorage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be refined. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format (Output Format)

The operator modifies the column specified by `input_key` in place and writes the entire DataFrame back to storage. Other columns are preserved.

| Field | Type | Description |
| :--- | :--- | :--- |
| <input_key> | str | The input text after stemming or lemmatization has been applied. |
| ... | any | Other columns from the input data remain unchanged. |

**Example Input:**

```json
{
  "text": "The researchers' studies involved analyzing various crying patterns.",
  "id": "doc1"
}
```

**Example Output (with `method="stemming"`):**

```json
{
  "text": "the researchers' studi involv analyz variou cri pattern.",
  "id": "doc1"
}
```

**Example Output (with `method="lemmatization"`):**
*Note: The default NLTK lemmatizer without Part-of-Speech tags has limitations.*

```json
{
  "text": "the researchers' study involved analyzing various cry pattern.",
  "id": "doc1"
}
```
