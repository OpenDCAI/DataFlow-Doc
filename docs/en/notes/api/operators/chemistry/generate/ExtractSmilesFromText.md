---
title: ExtractSmilesFromText
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/chemistry/generate/extractsmilesfromtext/
---

## 📘 Overview
[ExtractSmilesFromText](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) is an operator designed to extract or parse chemical SMILES expressions from OCR text. It uses a given prompt_template to construct model inputs, combining text content and optional abbreviation/monomer information, then calls a Large Language Model (LLM) to produce structured outputs which are parsed into JSON format.

## \_\_init\_\_
```python
def __init__(self, llm_serving: LLMServingABC, prompt_template=None)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | The Large Language Model serving instance for executing inference. |
| **prompt_template** | Any | None | The prompt template object used to construct the model input. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run
```python
def run(self, storage: DataFlowStorage, content_key: str = "text", abbreviation_key: str = "abbreviations", output_key: str = "synth_smiles")
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance responsible for reading and writing data. |
| **content_key** | str | "text" | The name of the input column containing the OCR text. |
| **abbreviation_key** | str | "abbreviations"| The name of the input column containing abbreviation/monomer information. |
| **output_key** | str | "synth_smiles" | The name of the output column where the extracted results will be stored. |

## 🧠 Example Usage
```python
```

#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Input columns from the source dataframe. |
| synth_smiles (default) | list/dict | The JSON-parsed SMILES structure extracted by the model. Returns `[]` on failure. |
