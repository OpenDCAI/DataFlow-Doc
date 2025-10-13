---
title: KBCChunkGeneratorBatch
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/kbcchunkgeneratorbatch/
---

## 📘 Overview
KBCChunkGeneratorBatch is a lightweight text segmentation tool that supports multiple chunking methods (token/sentence/semantic/recursive) with configurable size and overlap, optimized for RAG applications.

## `__init__`
```python
def __init__(self,
             chunk_size: int = 512,
             chunk_overlap: int = 50,
             split_method: str = "token",
             min_tokens_per_chunk: int = 100,
             tokenizer_name: str = "bert-base-uncased"
             )
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **chunk_size** | int | 512 | The target size of each text chunk (in tokens or other units depending on the split method). |
| **chunk_overlap** | int | 50 | The number of tokens to overlap between consecutive chunks to maintain context. |
| **split_method** | str | "token" | The method used for splitting text. Supported methods: "token", "sentence", "semantic", "recursive". |
| **min_tokens_per_chunk** | int | 100 | The minimum number of tokens required for a valid chunk. |
| **tokenizer_name** | str | "bert-base-uncased" | The name or path of the pretrained tokenizer model from Hugging Face. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, 
        storage: DataFlowStorage, 
        input_key: str = "text_path", 
        output_key: str = "chunk_path"
        )
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance responsible for reading and writing data. |
| **input_key** | str | "text_path" | The column name in the input DataFrame that contains the path to the text file to be chunked. |
| **output_key** | str | "chunk_path" | The column name in the output DataFrame where the path to the generated chunk file will be stored. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator appends the `output_key` column to the input DataFrame. This new column contains the file path to a JSON file where the generated text chunks are stored.

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_columns* | - | All original columns from the input DataFrame are preserved. |
| chunk_path | str | The path to the output JSON file containing the list of text chunks. |

**Example Input DataFrame row:**
```json
{
    "text_path": "./data/sample.txt"
}
```

**Example Output DataFrame row:**
```json
{
    "text_path": "./data/sample.txt",
    "chunk_path": "./data/extract/sample_chunk.json"
}
```

**Content of `sample_chunk.json`:**
```json
[
    {
        "raw_chunk": "This is the first chunk of the document. It provides an introduction to the main topic and sets the context for the following sections."
    },
    {
        "raw_chunk": "The following sections delve deeper into specific aspects. This is the second chunk, which continues the discussion from the first."
    }
]
```
