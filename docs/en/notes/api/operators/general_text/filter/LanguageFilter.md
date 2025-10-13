---
title: LanguageFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/languagefilter/
---

# 📘 LanguageFilter

The `LanguageFilter` is an operator that filters a dataset based on the language of the text, keeping only the entries that are in a specified list of allowed languages. It uses a pre-trained FastText model for language identification.

## `__init__` function

```python
def __init__(self, allowed_languages: list, model_cache_dir: str = None):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **allowed\_languages** | list | Required | A list of allowed language labels (e.g., `['__label__en', '__label__fr']`). |
| **model\_cache\_dir** | str | None | The directory path to cache the downloaded FastText model. If `None`, a default cache location is used. |

## Prompt Template Descriptions

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'language_label'):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input\_key** | str | Required | The name of the column in the input dataframe that contains the text to be analyzed. |
| **output\_key** | str | 'language\_label' | The name of the column to be added, which will store the filtering result (1 if the language is allowed, 0 otherwise). |

## 🧠 Example Usage

#### 🧾 Default Output Format (Output Format)

The operator modifies the dataframe in storage by filtering out rows that do not match the allowed languages and adds a new column.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | | Original columns from the input dataframe. |
| language\_label | int | A flag indicating the language detection result. The output dataframe is filtered to only include rows where this value is 1. |
