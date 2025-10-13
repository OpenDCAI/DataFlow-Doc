---
title: SymbolWordRatioFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/symbolwordratiofilter/
---

## 📘 Overview

The `SymbolWordRatioFilter` operator is designed to check if the ratio of specific symbols (e.g., #, ..., …) to the total word count in a given text exceeds a specified threshold. It filters out texts that contain an excessive usage of these symbols.

## `__init__` function

```python
__init__(self, threshold: float=0.4)
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.4 | The threshold for the symbol-to-word ratio. Texts with a ratio above this value will be filtered out. |

## `run` function

```python
run(self, storage: DataFlowStorage, input_key: str, output_key: str='symbol_word_ratio_filter_label')
```
Executes the main logic of the operator. It reads a DataFrame from storage, filters it based on the symbol-to-word ratio, and writes the filtered DataFrame back to storage.

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the column in the DataFrame that contains the text to be analyzed. |
| **output_key** | str | 'symbol\_word\_ratio\_filter\_label' | The name of the new column that will be added to the DataFrame to store the filter result (1 for pass, 0 for fail). |

## 🧠 Example Usage

```python
# Blank as requested
```

#### 🧾 Default Output Format (Output Format)

The operator adds a new column (specified by `output_key`) to the DataFrame, marking rows that pass the filter with a `1`. The final DataFrame written back to storage contains only the rows that passed the filter.

| Field | Type | Description |
| :--- | :---- | :--- |
| *input\_key* | str | The original input text. |
| *output\_key* | int | The filter label, which will always be `1` in the final output data. |

**Example Input Data in Storage:**
```json
{"text": "This is a perfectly valid sentence without too many symbols."}
{"text": "This one, however... has... so many symbols... #... #… that it should be filtered."}
```
**Example Output Data in Storage (assuming `threshold=0.4`):**
```json
{"text": "This is a perfectly valid sentence without too many symbols.", "symbol_word_ratio_filter_label": 1}
```
