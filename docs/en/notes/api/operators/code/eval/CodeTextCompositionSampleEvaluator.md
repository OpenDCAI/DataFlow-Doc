---
title: CodeTextCompositionSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/eval/codetextcompositionsampleevaluator/
---

## 📘 Overview

[CodeTextCompositionSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) evaluates code samples based on character composition to provide scores for filtering binary files, encrypted content, and other non-readable text. It analyzes the ratio of alphabetic and alphanumeric characters to ensure readable content.

## __init__

```python
def __init__(self)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| | | | No parameters |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | Input column name, corresponding to the data to be evaluated. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| CodeTextCompositionAlphaRatio | float | The ratio of alphabetic characters in the text. |
| CodeTextCompositionAlnumRatio | float | The ratio of alphanumeric characters in the text. |
| CodeTextCompositionScore | float | The comprehensive composition score (0.0 or 1.0), where 1.0 indicates the sample passes the composition check. |
