---
title: CondorRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/refine/condorrefiner/
---

## 📘 Overview
The `CondorRefiner` is an operator designed to improve the quality of instruction-response pairs through a two-stage process. In the first stage, it generates a critique of the initial response. In the second stage, it uses this critique to refine the original response, thereby enhancing the overall quality of the question-answering pair through iterative optimization.

## `__init__`
```python
def __init__(self, llm_serving: LLMServingABC = None)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | An instance of a Large Language Model service, used for generating critiques and refined answers. |

## Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str='instruction', input_output_key: str='output')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | An instance of DataFlowStorage, responsible for reading and writing data. |
| **input_instruction_key** | str | "instruction" | The column name in the input data that contains the instructions or questions. |
| **input_output_key** | str | "output" | The column name in the input data that contains the responses to be refined. This column will be overwritten with the refined answers. |

## 🧠 Example Usage
```python
```
#### 🧾 Input Format
```json
```
#### 🧾 Output Format
```json
```
