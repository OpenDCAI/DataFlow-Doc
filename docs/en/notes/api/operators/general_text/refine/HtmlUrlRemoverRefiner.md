---
title: HtmlUrlRemoverRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/htmlurlremoverrefiner/
---

## 📘 Overview

`HtmlUrlRemoverRefiner` is a text cleaning operator designed to remove URL links and HTML tags from text content. This operator uses regular expressions to match and remove various forms of URLs and HTML tags, achieving effective text data cleansing.

## `__init__` function

```python
def __init__(self)
```

### init parameter description

This function requires no parameters.

## `run` function

```python
def run(storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name        | Type            | Default | Description                                     |
| :---------- | :-------------- | :-----  | :---------------------------------------------- |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str             | Required | Input column name for text field to be cleaned. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import HtmlUrlRemoverRefiner
from dataflow.utils.storage import FileStorage

class HtmlUrlRemoverRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/html_url_remover_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = HtmlUrlRemoverRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = HtmlUrlRemoverRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with URLs and HTML tags removed |

### 📋 Sample Input

```json
{"text":"Visit https://example.com for more info"}
{"text":"<p>Hello <b>world</b>!</p>"}
{"text":"Check http://test.org and <div>content</div>"}
```

### 📤 Sample Output

```json
{"text":"Visit  for more info"}
{"text":"Hello world!"}
{"text":"Check  and content"}
```

### 📊 Results Analysis

**Sample 1**: Removed URL "https://example.com"
**Sample 2**: Removed HTML tags `<p>` `<b>`
**Sample 3**: Removed both URL and HTML tags

**Use Cases**:
- Clean text scraped from web pages
- Remove formatting tags from rich text
- Text preprocessing

**Notes**:
- May leave extra spaces after removing URLs and tags
