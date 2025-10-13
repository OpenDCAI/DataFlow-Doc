---
title: CodeFileTypeContentFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/filter/codefiletypecontentfilter/
---

## 📘 CodeFileTypeContentFilter
CodeFileTypeContentFilter filters code samples based on file types and content characteristics, applying different rules for different file formats to ensure quality and relevance. This filter directly applies filtering rules without using evaluator scores: It removes oversized text files (>512 lines), HTML files with insufficient visible text content, and text files with inappropriate filenames (not documentation-related), while keeping files that meet format-specific quality criteria.

## __init__
```python
def __init__(self)
```
This operator does not require any parameters during initialization.

## Prompt Template Descriptions

## run
```python
def run(storage, input_key, output_key="file_type_content_filter_label")
```
| Parameter | Type | Default | Description |
| :------------- | :---------------- | :------------------------------------ | :----------------------------------------------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | Data storage object responsible for reading and writing data. |
| **input_key** | str | Required | Input field name. The corresponding DataFrame requires 'filetype', 'filename', and 'line_count' columns. |
| **output_key** | str | "file_type_content_filter_label" | Output label field name. This new column will contain a boolean label indicating whether the sample passed the filter. |

## 🧠 Example Usage
