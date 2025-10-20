---
title: KBCChunkGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/kbcchunkgenerator/
---

## 📘 Overview

`KBCChunkGenerator` is a lightweight text chunking tool that supports multiple splitting methods, including word-, sentence-, semantic-, and recursive-based approaches. It allows flexible configuration of chunk size, overlap length, and minimum token count per chunk.

## **init** Function

```python
def __init__(self,
  chunk_size: int = 512,
  chunk_overlap: int = 50,
  split_method: str = "token",
  min_tokens_per_chunk: int = 100,
  tokenizer_name: str = "bert-base-uncased",
):
```

### init Parameter Description

| Parameter                | Type | Default             | Description                                                                        |
| :----------------------- | :--- | :------------------ | :--------------------------------------------------------------------------------- |
| **chunk_size**           | int  | 512                 | Target size of each text chunk.                                                    |
| **chunk_overlap**        | int  | 50                  | Number of overlapping units (e.g., tokens) between adjacent chunks.                |
| **split_method**         | str  | "token"             | Text splitting method. Supports "token", "sentence", "semantic", and "recursive".  |
| **min_tokens_per_chunk** | int  | 100                 | Minimum number of tokens required per chunk.                                       |
| **tokenizer_name**       | str  | "bert-base-uncased" | Name of the pretrained tokenizer used for tokenization, from the Hugging Face Hub. |

## run Function

```python
def run(self, storage: DataFlowStorage, input_key:str='text_path', output_key:str="raw_chunk")
```

#### Parameters

| Name           | Type            | Default     | Description                                                                    |
| :------------- | :-------------- | :---------- | :----------------------------------------------------------------------------- |
| **storage**    | DataFlowStorage | Required    | Data flow storage instance responsible for reading and writing DataFrame data. |
| **input_key**  | str             | "text_path" | Input column name containing the path to the text file to be processed.        |
| **output_key** | str             | "raw_chunk" | Output column name used to store the generated text chunks.                    |

## 🧠 Example Usage

```python
self.knowledge_cleaning_step2 = KBCChunkGenerator(
    split_method="token",
    chunk_size=512,
    tokenizer_name="Qwen/Qwen2.5-7B-Instruct",
)
self.knowledge_cleaning_step2.run(
    storage=self.storage.step(),
    # input_key=,
    # output_key=,
)
```

#### 🧾 Default Output Format

This operator reads a DataFrame, splits the text from the column specified by `input_key` into chunks, and produces a new DataFrame. For each row in the input DataFrame, the number of output rows corresponds to the number of chunks generated from its text. Each new row retains all original fields and adds a new column (defined by `output_key`) containing the chunked text.

Example Input (one row in DataFrame):

```json
{
  "source": "doc_001",
  "text_path": "/path/to/your/document.md"
}
```

Example Output (resulting DataFrame will contain multiple rows as shown below):

```json
{
  "source": "doc_001",
  "text_path": "/path/to/your/document.md",
  "raw_chunk": "This is the first text chunk extracted from the document..."
},
{
  "source": "doc_001",
  "text_path": "/path/to/your/document.md",
  "raw_chunk": "...This is the second chunk, overlapping with the previous one..."
},
{
  "source": "doc_001",
  "text_path": "/path/to/your/document.md",
  "raw_chunk": "...This is the third text chunk..."
}
```
