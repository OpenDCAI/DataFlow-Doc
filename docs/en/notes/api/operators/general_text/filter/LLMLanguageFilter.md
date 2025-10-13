---
title: LLMLanguageFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/llmlanguagefilter/
---

# 📘 Overview

The `LLMLanguageFilter` is an operator designed to filter text data based on its language. It utilizes a Large Language Model (LLM) to identify the language of each text entry and retains only those entries that match a predefined list of allowed languages. The operator identifies languages using the ISO 639-1 two-letter code standard (e.g., 'en' for English, 'zh' for Chinese).

## `__init__`
```python
def __init__(self, llm_serving: LLMServingABC = None, allowed_languages: list[str] = ['en'])
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | The large language model service instance used for language identification. |
| **allowed_languages** | list[str] | ['en'] | A list of allowed languages specified by their ISO 639-1 two-letter codes. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'language_label')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be analyzed. |
| **output_key** | str | 'language_label' | The name of the output column where the detected language label will be stored. |

## 🧠 Example Usage

```python

```

#### 🧾 Output Format

The operator filters the input DataFrame and writes the result back to storage. The output DataFrame includes the original columns plus a new column for the detected language, but only contains rows where the detected language is in the `allowed_languages` list.

| Field | Type | Description |
| :--- | :--- | :--- |
| [input_key] | str | The original input text. |
| language_label | str | The detected language code (e.g., 'en', 'zh') for the input text. |
