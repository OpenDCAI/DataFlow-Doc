---
title: KBCChunkGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/kbcchunkgenerator/
---

## 📘 KBCChunkGenerator
KBCChunkGenerator is a lightweight text segmentation tool that supports multiple chunking methods (token/sentence/semantic/recursive) with configurable size and overlap, optimized for RAG applications.

## __init__ function
```python
def __init__(self,
            chunk_size: int = 512,
            chunk_overlap: int = 50,
            split_method: str = "token",
            min_tokens_per_chunk: int = 100,
            tokenizer_name: str = "bert-base-uncased",
            )
```
### init parameter description
| Parameter              | Type | Default               | Description                                                                                 |
| :--------------------- | :--- | :-------------------- | :------------------------------------------------------------------------------------------ |
| **chunk_size**         | int  | 512                   | The target size of each text chunk.                                                         |
| **chunk_overlap**      | int  | 50                    | The number of overlapping tokens/characters between consecutive chunks.                     |
| **split_method**       | str  | "token"               | The method to split text. Supported values: "token", "sentence", "semantic", "recursive".   |
| **min_tokens_per_chunk**| int | 100                  | The minimum number of tokens for a chunk to be considered valid.                            |
| **tokenizer_name**     | str  | "bert-base-uncased"   | The name or path of the Hugging Face tokenizer to be used.                                  |

## run function
```python
def run(self, storage: DataFlowStorage, input_key:str='text_path', output_key:str="raw_chunk")
```
#### Parameters
| Name         | Type            | Default       | Description                                                                           |
| :----------- | :-------------- | :------------ | :------------------------------------------------------------------------------------ |
| **storage**  | DataFlowStorage | Required      | The DataFlow storage instance for reading the input DataFrame and writing the results.  |
| **input_key**| str             | "text_path"   | The column name in the input DataFrame that contains the path to the text file to chunk.|
| **output_key**| str             | "raw_chunk"   | The column name to be added to the output DataFrame, containing the generated text chunk. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format (Output Format)
The operator preserves all columns from the input data and adds a new column (specified by `output_key`) for each generated chunk. If one input row's text file is split into multiple chunks, it will result in multiple output rows.

| Field                     | Type | Description                                                                 |
| :------------------------ | :--- | :-------------------------------------------------------------------------- |
| `<...all_input_columns>`  | any  | All original columns from the input data are preserved for each output row. |
| `raw_chunk`               | str  | The generated text chunk. The field name is determined by `output_key`.     |

Example Input (`input_key`="text_path"):
```json
{
    "doc_id": "doc-001",
    "text_path": "/path/to/your/document.txt"
}
```
Example Output (`output_key`="raw_chunk"):
```json
[
    {
        "doc_id": "doc-001",
        "text_path": "/path/to/your/document.txt",
        "raw_chunk": "This is the first chunk of text from the document. It is created by the KBCChunkGenerator based on the specified splitting method and chunk size."
    },
    {
        "doc_id": "doc-001",
        "text_path": "/path/to/your/document.txt",
        "raw_chunk": "This is the second chunk, which may have some overlapping text with the previous chunk to maintain context across boundaries."
    }
]
```
