---
title: HtmlEntityRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/htmlentityrefiner/
---

## 📘 Overview

`HtmlEntityRefiner` is a text cleaning operator designed to remove HTML entities from text, such as `&nbsp;`, `&lt;`, etc. It can handle not only standard HTML entities, but also recognize and remove various variant forms (e.g., using full-width ampersand `＆` or Chinese semicolon `；`). This operator supports custom lists of HTML entities to remove, providing flexible text preprocessing capabilities.

## `__init__` function

```python
def __init__(self, html_entities: list = [
            "nbsp", "lt", "gt", "amp", "quot", "apos", "hellip", "ndash", "mdash", 
            "lsquo", "rsquo", "ldquo", "rdquo"
        ]):
```

### init parameter description

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **html_entities** | list | `["nbsp", "lt", "gt", ...]` | A list of strings, where each string is the name of an HTML entity to be removed (without `&` and `;`). |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str):
```

#### Parameters

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str | Required | Name of input column containing text with HTML entities to clean. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import HtmlEntityRefiner
from dataflow.utils.storage import FileStorage

class HtmlEntityRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/html_entity_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = HtmlEntityRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = HtmlEntityRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with HTML entities removed |

### 📋 Sample Input

```json
{"text":"Hello&nbsp;world&lt;test&gt;"}
{"text":"Copyright&copy;2024&mdash;All rights"}
{"text":"Price&colon;$100"}
```

### 📤 Sample Output

```json
{"text":"Helloworldtest"}
{"text":"Copyright&copy;2024All rights"}
{"text":"Price&colon;$100"}
```

### 📊 Results Analysis

**Sample 1**: Removed `&nbsp;` `&lt;` `&gt;`
**Sample 2-3**: Some entities not removed (`&copy;` `&colon;` not in predefined list)

**Use Cases**:
- Clean HTML text
- Remove common HTML entities

**Notes**:
- Only removes HTML entities in predefined list
