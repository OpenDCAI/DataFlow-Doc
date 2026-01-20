---
title: QA_Merger
createTime: 2026/01/20 20:25:00
permalink: /en/api/operators/core_text/merge/qamerger/
---

## 📘 Overview

`QA_Merger` is a post-processing operator designed to merge questions and answers. It typically receives two separate outputs from the `LLMOutputParser` (one list of extracted questions and one list of extracted answers) and matches them into complete **QA Pairs** based on chapter titles and question indices.

### Key Features:
* **Bi-directional Merging**: Combines questions, answers, solutions, and labels using logic based on chapter titles or indices.
* **Format Conversion**: Automatically converts the merged `.jsonl` data into a human-readable `.md` (Markdown) format.
* **Data Flattening (Explode)**: Transforms the DataFrame rows from a per-file organization to a per-QA pair organization. While one file originally occupied one row, after execution, each QA pair occupies its own row, facilitating fine-grained downstream processing.

## `__init__` Function

```python
def __init__(self, output_dir: str, strict_title_match: bool = False)

```

### Initialization Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| **output_dir** | str | Required | The root directory for the merged output files. |
| **strict_title_match** | bool | False | Whether to enable strict title matching. If `True`, chapter titles must match exactly. If `False`, it attempts to extract **Chinese/English indices** from the titles before matching. |

## `run` Function

```python
def run(self, 
        storage: DataFlowStorage, 
        input_question_qalist_path_key: str, 
        input_answer_qalist_path_key: str, 
        input_name_key: str, 
        output_merged_qalist_path_key: str, 
        output_merged_md_path_key: str, 
        output_qa_item_key: str = "qa_item"
        )

```

Executes the merging logic: Reads the question and answer JSONL files, invokes internal utility functions to merge them, and updates the storage.

#### Parameter Descriptions

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance. |
| **input_question_qalist_path_key** | str | Required | Column name for the question JSONL file path. |
| **input_answer_qalist_path_key** | str | Required | Column name for the answer JSONL file path. |
| **input_name_key** | str | Required | Column name for the task name, used to create output subdirectories. |
| **output_merged_qalist_path_key** | str | Required | Column name for the merged JSONL file path. |
| **output_merged_md_path_key** | str | Required | Column name for the merged Markdown file path. |
| **output_qa_item_key** | str | "qa_item" | **Key Parameter**: Column name for the exploded QA content. Each row will contain a dictionary of a specific QA pair. |

## 🧠 Core Logic: Data Explosion (Explode)

Unlike most operators, `QA_Merger` changes the number of rows in the DataFrame.

1. **Merge Files**: It first generates a `merged_qa_pairs.jsonl` on disk, containing all QA pairs for that document.
2. **Store Objects**: These QA pairs are loaded into the `output_qa_item_key` column as a `list`.
3. **Execute Explode**: The operator calls `dataframe.explode()`.
* **Before**: 2 rows (corresponding to 2 PDF files containing 10 and 5 QA pairs respectively).
* **After**: 15 rows (each row corresponds to 1 specific QA pair; metadata in other columns like `input_name` is automatically duplicated).



## 🧠 Example Results

#### 🧾 Markdown Output Example (`merged_qa_pairs.md`)

```markdown
# Chapter: Chapter 1 Introduction

**Question 1**: What is a DataFlow system?
**Answer**: A type of...
**Solution**: A DataFlow system is a...
**Label**: 1

---

**Question 2**: [image](images/fig2.png) Please describe this image.
...

```

#### 🧾 Exploded DataFrame Example

| index | name | qa_item (Column) |
| --- | --- | --- |
| 0 | task_01 | {'question': 'Q1...', 'answer': 'A1...', ...} |
| 1 | task_01 | {'question': 'Q2...', 'answer': 'A2...', ...} |
| 2 | task_02 | {'question': 'Q1...', 'answer': 'A1...', ...} |
