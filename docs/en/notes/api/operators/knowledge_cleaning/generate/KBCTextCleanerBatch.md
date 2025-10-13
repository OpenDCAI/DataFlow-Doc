---
title: KBCTextCleanerBatch
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/kbctextcleanerbatch/
---

# 📘 KBCTextCleanerBatch
KBCTextCleanerBatch is a knowledge cleaning operator designed for RAG. It standardizes raw content by cleaning HTML tags, normalizing special characters, and optimizing structure to improve the quality of the knowledge base.

## \_\_init\_\_ function
```python
def __init__(self, llm_serving: LLMServingABC, lang="en", prompt_template = None)
```
### init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm\_serving** | LLMServingABC | Required | Large language model serving instance. |
| **lang** | str | "en" | Language for the prompt template ('en' or 'zh'). |
| **prompt\_template** | PromptABC | None | Prompt template object. Defaults to `KnowledgeCleanerPrompt`. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| ---------------------- | ------------- | -------------------- | ------------------- |
| | | | |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str = "chunk_path", output_key: str = "cleaned_chunk_path")
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input\_key** | str | "chunk_path" | Input column name containing the path to the chunk file. |
| **output\_key** | str | "cleaned_chunk_path" | Output column name to store the path of the cleaned chunk file. |

## 🧠 Example Usage
```python

```
#### 🧾 Default Output Format (Output Format)
The operator reads a dataframe, finds file paths specified in the `input_key` column, cleans the content within those files, and overwrites them. It then adds an `output_key` column to the dataframe containing the same paths and saves the updated dataframe.

| Field | Type | Description |
| :--- | :--- | :--- |
| *original_columns* | any | The original columns from the input dataframe. |
| cleaned\_chunk\_path | str | Path to the file containing the cleaned chunks. This is the same path as the input file, which is modified in-place. |

Example Input (`dataframe`):
```json
{
"chunk_path":"/path/to/chunks.jsonl"
}
```
Example Input File Content (`/path/to/chunks.jsonl`):
```json
{"raw_chunk": "Content with <b>HTML</b> and &quot;special&quot; characters."}
```
Example Output (`dataframe`):
```json
{
"chunk_path":"/path/to/chunks.jsonl",
"cleaned_chunk_path":"/path/to/chunks.jsonl"
}
```
Example Output File Content (`/path/to/chunks.jsonl` after execution):
```json
{
    "raw_chunk": "Content with <b>HTML</b> and &quot;special&quot; characters.",
    "cleaned_chunk": "Content with HTML and \"special\" characters."
}
```
