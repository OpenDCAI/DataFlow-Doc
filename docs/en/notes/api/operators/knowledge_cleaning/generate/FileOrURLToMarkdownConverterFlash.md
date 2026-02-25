---
title: FileOrURLToMarkdownConverterFlash
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/fileorurltomarkdownconverterflash/
---

## 📘 Overview

`FileOrURLToMarkdownConverterFlash` is an operator that utilizes the local installation of MinerU model for knowledge extraction, it supports extracting structured content from multiple file formats (e.g., PDF, Office documents, web pages, plain text) and URLs, converting them into a unified Markdown format. The operator automatically detects the file type and invokes the optimal parsing engine (such as MinerU or trafilatura) to preserve the original layout and key information.

## **init** Function

```python
def __init__(
    self, 
    intermediate_dir: str = "intermediate", 
    mineru_model_path=None, 
    batch_size:int = 4, 
    replicas:int = 1, 
    num_gpus_per_replica:float = 1, 
    engine_gpu_util_rate_to_ray_cap:float = 0.9
):

```

### init Parameter Description

| Parameter            | Type | Default             | Description                                                                                                                                                                          |
| :------------------- | :--- | :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **intermediate_dir** | str  | "intermediate"      | Directory path for storing intermediate files generated during the conversion process.                                                                                               |
| **mineru_model_path** | str  | None               | Model path used by FlashMinerU (required; e.g., the directory of MinerU2.5-xxx weights).                                                                                                                        |
| **batch_size**       | int  | 4                  | Batch size for processing.                                                                                                                                                                      |
| **replicas**         | int  | 1                  | Number of processes for multi-process inference.                                                                                                                                                      |
| **num_gpus_per_replica** | float | 1                  | Number of GPUs occupied by each replica.                                                                                                                                                      |
| **engine_gpu_util_rate_to_ray_cap** | float | 0.9                | Upper limit coefficient for Ray resource utilization (flash-mineru essentially uses ray for multi-process inference), for example, setting it to 0.9 means that ray will reserve 10% of the resources, since it is necessary to leave some resources for ray's management processes while preventing OOM under the condition of ensuring computational efficiency, it is usually set between 0.8 and 1.0. |


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
self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterFlash(
    intermediate_dir = "intermediate",
    mineru_model_path="<path_to_local>/MinerU2.5-2509-1.2B",
    batch_size = 4,
    replicas = 2,
    num_gpus_per_replica = 1,
    engine_gpu_util_rate_to_ray_cap = 0.9
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
