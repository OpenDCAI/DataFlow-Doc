---
title: KBCChunkGeneratorBatch
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/kbcchunkgeneratorbatch/
---

## 📘 Overview

`KBCChunkGeneratorBatch` is a batch text segmentation operator designed to divide long texts or corpora into smaller, more manageable chunks. It supports multiple segmentation strategies, including token-based, sentence-based, semantic, and recursive methods. The operator allows customization of chunk size, overlap, and minimum chunk length, and is specifically optimized for RAG (Retrieval-Augmented Generation) applications.

## `__init__` Function

```python
def __init__(self,
    chunk_size: int = 512,
    chunk_overlap: int = 50,
    split_method: str = "token",
    min_tokens_per_chunk: int = 100,
    tokenizer_name: str = "bert-base-uncased",
)
```

### init Parameter Description

| Parameter                | Type | Default             | Description                                                                             |
| :----------------------- | :--- | :------------------ | :-------------------------------------------------------------------------------------- |
| **chunk_size**           | int  | 512                 | Target size for each text chunk (in tokens or characters, depending on `split_method`). |
| **chunk_overlap**        | int  | 50                  | Overlap size between adjacent chunks to preserve context continuity.                    |
| **split_method**         | str  | "token"             | Text segmentation method. Options: "token", "sentence", "semantic", "recursive".        |
| **min_tokens_per_chunk** | int  | 100                 | Minimum number of tokens allowed in each chunk.                                         |
| **tokenizer_name**       | str  | "bert-base-uncased" | Name of the tokenizer used for token splitting and counting.                            |

### Segmentation Method Description

| Method        | Primary Use                      | Applicable Scenario                            | Key Features                                                                           |
| ------------- | -------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| **token**     | Split by fixed token count       | When strict input length control is needed     | Direct method ensuring each chunk stays within `chunk_size`.                           |
| **sentence**  | Split by sentence boundaries     | When sentence integrity must be preserved      | Keeps full sentences together, avoiding semantic breaks.                               |
| **semantic**  | Split by semantic similarity     | For topically coherent documents or paragraphs | Uses semantic clustering to group related content.                                     |
| **recursive** | Recursive hierarchical splitting | For complex or unstructured text               | Uses layered delimiters (paragraphs, sentences, words) for robust, adaptive splitting. |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_key: str = "text_path", output_key: str = "chunk_path")
```

#### Parameters

| Name           | Type            | Default      | Description                                                                        |
| :------------- | :-------------- | :----------- | :--------------------------------------------------------------------------------- |
| **storage**    | DataFlowStorage | Required     | Data flow storage instance responsible for reading and writing data.               |
| **input_key**  | str             | "text_path"  | Input column containing the path to the original text file to be chunked.          |
| **output_key** | str             | "chunk_path" | Output column used to store the path of the generated chunk file (in JSON format). |

## 🧠 Example Usage

```python
self.knowledge_cleaning_step2 = KBCChunkGeneratorBatch(
    split_method="token",
    chunk_size=512,
    tokenizer_name="Qwen/Qwen2.5-7B-Instruct",
)
self.knowledge_cleaning_step2.run(
    storage=self.storage.step(),
)
```

#### 🧾 Default Output Format

After execution, the operator adds a new column (default `chunk_path`) to the input DataFrame, containing the paths to the generated JSON files. Each JSON file has the following structure:

Example Input (one row in DataFrame):

```json
{
"text_path":"/path/to/your/document.txt"
}
```

Example Output (one row in DataFrame):

```json
{
"text_path":"/path/to/your/document.txt",
"chunk_path":"/path/to/your/extract/document_chunk.json"
}
```

Example content of `document_chunk.json`:

```json
[
    {
        "raw_chunk": "This is the content of the first text chunk..."
    },
    {
        "raw_chunk": "This is the second text chunk, overlapping partially with the first one..."
    },
    ...
]
```
