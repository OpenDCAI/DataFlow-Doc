---
title: FileOrURLToMarkdownConverterBatch
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/fileorurltomarkdownconverterbatch/
---

## 📘 Overview
Knowledge Extractor: Converts multiple file formats to structured Markdown
Key Features:
1. PDF: Uses MinerU engine to extract text/tables/formulas with layout preservation
2. Office(DOC/PPT): Converts to Markdown via DocConverter
3. Web(HTML/XML): Extracts main content using trafilatura
4. Plaintext(TXT/MD): Directly passes through without conversion
Special Handling:
- Auto-detects Chinese/English documents(lang param)
- Supports both local files and URLs
- Generates intermediate files to specified directory(intermediate_dir)

## __init__
```python
def __init__(self, intermediate_dir: str = "intermediate", lang: str = "en", mineru_backend: str = "vlm-sglang-engine")
```
### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **intermediate_dir** | str | "intermediate" | The directory to store intermediate files generated during conversion. |
| **lang** | str | "en" | The language of the source documents. Used to optimize parsing. |
| **mineru_backend** | str | "vlm-sglang-engine" | The backend engine for MinerU PDF parsing. Options include "pipeline" and "vlm-sglang-engine". |

## run
```python
def run(self, storage: DataFlowStorage, input_key: str = "source", output_key: str = "text_path")
```
#### Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance responsible for reading input data and writing results. |
| **input_key** | str | "source" | The name of the input column containing the file paths or URLs to be processed. |
| **output_key** | str | "text_path" | The name of the output column where the paths to the converted Markdown files will be stored. |

## 🧠 Example Usage
```python

```
#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| source | str | The input file path or URL. |
| text_path | str | The path to the generated Markdown file. |

Example Input:
```json
{
"source": "/path/to/your/document.pdf"
}
```
Example Output:
```json
{
"source": "/path/to/your/document.pdf",
"text_path": "intermediate/document_pdf.md"
}
```
