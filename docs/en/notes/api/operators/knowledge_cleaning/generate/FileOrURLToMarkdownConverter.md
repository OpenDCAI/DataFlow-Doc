---
title: FileOrURLToMarkdownConverter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/fileorurltomarkdownconverter/
---

# 📘 Overview
The `FileOrURLToMarkdownConverter` is a knowledge extraction operator that supports converting content from various file formats (PDF, Office, HTML, TXT) and URLs into a standardized Markdown format. It leverages specialized engines like MinerU for PDFs and trafilatura for web content to preserve the original structure, including text, tables, and formulas.

## __init__ function
```python
def __init__(self, 
             url: str = None,
             raw_file: str = None,
             intermediate_dir: str = "intermediate", 
             lang: str = "en", 
             mineru_backend: Literal["vlm-sglang-engine", "pipeline"] = "vlm-sglang-engine"
             ):
```
### init parameters
| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **url** | str | None | The URL of the web page or online file to be converted. |
| **raw_file** | str | None | The local file path for the document to be converted. |
| **intermediate_dir** | str | "intermediate" | The directory where intermediate files will be stored. |
| **lang** | str | "en" | Specifies the language of the document ("en" or "zh") to aid parsing. |
| **mineru_backend** | Literal | "vlm-sglang-engine" | The backend engine for MinerU, used for processing PDF and image files. Options are "vlm-sglang-engine" or "pipeline". |

## run function
```python
def run(self, storage: DataFlowStorage, input_key="", output_key=""):
```
### run parameters
| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance. |
| **input_key** | str | "" | The name of the input column (unused in this operator). |
| **output_key** | str | "" | The name of the output column (unused in this operator). |

## Prompt Template Descriptions



## 🧠 Example Usage
```python

```
