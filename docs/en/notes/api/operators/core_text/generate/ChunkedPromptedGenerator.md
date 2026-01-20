---
title: ChunkedPromptedGenerator
createTime: 2026/01/20 15:00:00
permalink: /en/api/operators/core_text/generate/chunkedpromptedgenerator/
---

## 📘 Overview

`ChunkedPromptedGenerator` is a prompt generation operator that supports **automatic chunking for long texts**. When the input content exceeds a preset Token limit, the operator employs a recursive bisection method to split the text into smaller chunks. It then calls a Large Language Model (LLM) to generate results for each chunk and joins them using a specified separator.

It is particularly suitable for processing extra-long documents (such as books or long papers) and supports reading input content directly from file paths.

## `__init__` Function

```python
def __init__(self, 
             llm_serving: LLMServingABC, 
             system_prompt: str = "You are a helpful agent.", 
             json_schema: dict = None, 
             max_chunk_len: int = 128000, 
             enc = tiktoken.get_encoding("cl100k_base"), 
             seperator: str = "\n"
             )

```

### Initialization Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| **llm_serving** | LLMServingABC | Required | The LLM service instance used for inference. |
| **system_prompt** | str | "You are a helpful agent." | System prompt to define the model's role and behavior. |
| **json_schema** | dict | None | (Optional) A JSON Schema to constrain the LLM's output format. |
| **max_chunk_len** | int | 128000 | The maximum number of tokens allowed per chunk. |
| **enc** | Encoder/Tokenizer | tiktoken.get_encoding("cl100k_base") | The encoder used for token counting. Supports any object with an `encode` method (e.g., tiktoken or AutoTokenizer). |
| **seperator** | str | "\n" | The character used to join results from multiple chunks. |

### Chunking Logic

The operator utilizes a **recursive bisection method**:

1. Calculate the total Token count of the current text.
2. If Token count < `max_chunk_len`, it is processed as a single chunk.
3. If Token count > `max_chunk_len`, the text is split into two halves based on the middle character position, and the process repeats recursively.

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_path_key: str, output_path_key: str)

```

Executes the operator logic: Reads file paths from the specified input column, loads the file content, generates output per chunk, writes the joined results to a new text file, and records the output file path in the DataFrame.

#### Parameters

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_path_key** | str | Required | The input column name containing the **local paths** of the text files. |
| **output_path_key** | str | Required | The output column name where the resulting LLM output file paths will be stored. |

## 🧠 Example Usage

```python
from dataflow.core import LLMServing
from dataflow.utils.storage import DataFlowStorage

# Initialize the operator with a max length of 2000 tokens
operator = ChunkedPromptedGenerator(
    llm_serving=my_llm_instance,
    max_chunk_len=2000,
    seperator="\n---\n"
)

# Run the operator
operator.run(
    storage=my_storage,
    input_path_key="file_path",
    output_path_key="result_path"
)

```

#### 🧾 Output Logic

The operator automatically generates a result file with the suffix `_llm_output.txt` in the same directory as the input file.

| Field | Type | Description |
| --- | --- | --- |
| file_path | str | Path to the original input file (e.g., `data/doc.txt`). |
| result_path | str | Path where the generated result file is saved (e.g., `data/doc_llm_output.txt`). |

**Example Input DataFrame Row:**

```json
{
  "file_path": "/home/user/data/long_article.txt"
}

```

**Chunking Workflow:**

1. Read the content of `long_article.txt`.
2. Assume the text is split into `Chunk A` and `Chunk B`.
3. Call the LLM to obtain `Result A` and `Result B`.
4. Write `Result A\nResult B` into `/home/user/data/long_article_llm_output.txt`.

**Example Output DataFrame Row:**

```json
{
  "file_path": "/home/user/data/long_article.txt",
  "result_path": "/home/user/data/long_article_llm_output.txt"
}

```
