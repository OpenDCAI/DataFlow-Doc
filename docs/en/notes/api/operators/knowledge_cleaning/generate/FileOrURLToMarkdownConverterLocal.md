---
title: FileOrURLToMarkdownConverterLocal
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/fileorurltomarkdownconverterlocal/
---

## 📘 Overview

`FileOrURLToMarkdownConverterLocal` is an operator that utilizes the local installation of MinerU model for knowledge extraction, it supports extracting structured content from multiple file formats (e.g., PDF, Office documents, web pages, plain text) and URLs, converting them into a unified Markdown format. The operator automatically detects the file type and invokes the optimal parsing engine (such as MinerU or trafilatura) to preserve the original layout and key information.

## **init** Function

```python
    def __init__(self, 
                 intermediate_dir: str = "intermediate", 
                 mineru_backend: str = "vlm-auto-engine",
                 mineru_source: str = "local",
                 mineru_model_path:str = None,
                 mineru_download_model_type:str = "vlm"
                 ):
```

### init Parameter Description

| Parameter            | Type | Default             | Description                                                                                                                                                                          |
| :------------------- | :--- | :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **intermediate_dir** | str  | "intermediate"      | Directory path used to store intermediate files generated during the conversion process.                                                                                             |
| **mineru_backend**   | str  | "vlm" | Specifies the backend engine for MinerU, used for handling complex documents such as PDFs. Options include "pipeline", "vlm-transformers", "MinerU-HTML". |
| **mineru_source** | str   | "local" | Specifies the source of the MinerU model, corresponding to MINERU_MODEL_SOURCE. Options include "modelscope", "huggingface", "local". |
| **mineru_model_path** | str | None | Local model directory, required when `mineru_source='local'`. |
| **mineru_download_model_type** | str | "vlm" | Specifies the type of MinerU model to download. |

### Prompt Template Description

| Prompt Template Name | Main Purpose | Applicable Scenario | Characteristics |
| -------------------- | ------------ | ------------------- | --------------- |
| --                   | --           | --                  | --              |

## run Function

```python
def run(self, storage: DataFlowStorage, input_key: str = "source", output_key: str = "text_path"):
```

#### Parameters

| Name           | Type            | Default     | Description                                                             |
| :------------- | :-------------- | :---------- | :---------------------------------------------------------------------- |
| **storage**    | DataFlowStorage | Required    | Data flow storage instance responsible for reading and writing data.    |
| **input_key**  | str             | "source"    | Input column name containing the file path or URL to be processed.      |
| **output_key** | str             | "text_path" | Output column name that stores the path to the generated Markdown file. |

## 🧠 Example Usage

```python
self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterLocal(
    intermediate_dir="../example_data/KBCleaningPipeline/raw/",
    mineru_backend="vlm-auto-engine",
    mineru_source="local",
    mineru_model_path="<path_to_local>/MinerU2.5-2509-1.2B",
    mineru_download_model_type="vlm"
)
self.knowledge_cleaning_step1.run(
    storage=self.storage.step(),
    # input_key=,
    # output_key=,
)
```

#### 🧾 Default Output Format

| Field     | Type | Description                          |
| :-------- | :--- | :----------------------------------- |
| source    | str  | Input source file path or URL.       |
| text_path | str  | Path to the generated Markdown file. |

Example Input:

```json
{
"source":"/path/to/your/document.pdf"
}
```

Example Output:

```json
{
"source":"/path/to/your/document.pdf",
"text_path":"intermediate/document_pdf.md"
}
```
