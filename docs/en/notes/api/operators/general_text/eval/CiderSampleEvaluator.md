---
title: CiderSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/cidersampleevaluator/
---

## 📘 Overview

The `CiderSampleEvaluator` is an operator designed to evaluate the similarity between generated text and reference text using the CIDEr (Consensus-based Image Description Evaluation) metric. It calculates a score based on the n-gram overlap, weighted by Term Frequency-Inverse Document Frequency (TF-IDF).

## `__init__` function

```python
def __init__(self, n=4, sigma=6.0, df_mode="coco-val-df", idf_path="./dataflow/operators/general_pt/eval/cider/coco-val-df.p")
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **n** | int | 4 | The maximum n-gram length to be considered. |
| **sigma** | float | 6.0 | The sigma value for the Gaussian penalty function. |
| **df_mode** | str | "coco-val-df" | The document frequency mode. |
| **idf_path** | str | "./dataflow/operators/general_pt/eval/cider/coco-val-df.p" | The path to the IDF file. A pre-trained COCO dataset IDF is used by default. |

## Prompt Template Descriptions

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str, reference_key: str, output_key: str='CiderScore')
```

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance for reading and writing data. |
| **input_key** | str | Required | The column name for the generated text to be evaluated. |
| **reference_key** | str | Required | The column name for the reference text. |
| **output_key** | str | "CiderScore" | The column name where the calculated CIDEr score will be stored. |

## 🧠 Example Usage

## 🧾 Default output format（Output Format）

The operator adds a new column to the input DataFrame.

| Field | Type | Description |
| :--- | :--- | :--- |
| CiderScore | float | The calculated CIDEr score for the generated text against the reference text. |
