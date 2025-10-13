---
title: KBCTextCleaner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/kbctextcleaner/
---

## 📘 Overview
[KBCTextCleaner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) standardizes raw HTML/text content for RAG quality improvement. Key functions:
1. Removes redundant HTML tags while preserving semantic tags
2. Normalizes special characters (e.g., curly quotes, dashes)
3. Processes hyperlinks and retains their text
4. Preserves paragraph structure and code indentation
5. Ensures factual content remains unchanged

## `__init__` function
```python
def __init__(self, llm_serving: LLMServingABC, lang="en", prompt_template = None)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | LLM serving instance for executing generation. |
| **lang** | str | "en" | Language of the knowledge content, affects prompt selection. Supports 'en' and 'zh'. |
| **prompt_template** | PromptABC | None | Prompt template object for building the cleaning instructions. Defaults to `KnowledgeCleanerPrompt`. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| --- | --- | --- | --- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key:str = "raw_chunk", output_key:str = "cleaned_chunk")
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | "raw_chunk" | Input column name containing the raw text to be cleaned. |
| **output_key** | str | "cleaned_chunk" | Output column name for the cleaned text. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| raw_chunk | str | The input raw text. |
| cleaned_chunk | str | The model-generated cleaned text. |

Example Input:
```json
{
"raw_chunk":"<div class=\"container\">\n  <h1>Title Text</h1>\n  <p>Paragraph with “curly quotes” and – dashes</p>\n  <img src=\"example.jpg\" alt=\"Diagram\">\n  <a href=\"...\">Link text</a>\n  <pre><code>Code block</code></pre>\n</div>"
}
```
Example Output:
```json
{
"raw_chunk":"<div class=\"container\">\n  <h1>Title Text</h1>\n  <p>Paragraph with “curly quotes” and – dashes</p>\n  <img src=\"example.jpg\" alt=\"Diagram\">\n  <a href=\"...\">Link text</a>\n  <pre><code>Code block</code></pre>\n</div>",
"cleaned_chunk":"Title Text\n\nParagraph with \"straight quotes\" and - dashes\n\n[Image: Diagram example.jpg]\n\nLink text\n\n<code>Code block</code>"
}
```
