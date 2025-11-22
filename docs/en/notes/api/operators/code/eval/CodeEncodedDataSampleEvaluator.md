---
title: CodeEncodedDataSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/eval/codeencodeddatasampleevaluator/
---

## 📘 Overview

The `CodeEncodedDataSampleEvaluator` is an operator designed to evaluate code samples by detecting patterns of encoded data, such as Base64, hexadecimal, and Unicode escape sequences. It calculates ratios for each pattern and produces a final score, which is useful for filtering out binary content or auto-generated code that has been embedded within text files.

## `__init__`

```python
def __init__(self)
```

This operator does not require any parameters during initialization.

## Prompt Template Descriptions

(No information provided)

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

Executes the main logic of the operator. It reads a DataFrame from storage, evaluates each sample in the specified input column for encoded data patterns, and writes the new columns containing the scores back to the storage.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be evaluated. |

## 🧠 Example Usage

(No information provided)

#### 🧾 Output Format

The operator appends the following columns to the original DataFrame:

| Field | Type | Description |
| :--- | :--- | :--- |
| CodeEncodedDataBase64Ratio | float | The ratio of Base64 encoded data in the text. |
| CodeEncodedDataHexRatio | float | The ratio of hexadecimal data in the text. |
| CodeEncodedDataUnicodeRatio | float | The ratio of Unicode escape sequences in the text. |
| CodeEncodedDataScore | float | A comprehensive score between 0.0 and 1.0. A score of 1.0 indicates the sample passes the encoded data checks. |
