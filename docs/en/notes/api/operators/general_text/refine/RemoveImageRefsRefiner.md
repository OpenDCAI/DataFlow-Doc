---
title: RemoveImageRefsRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removeimagerefsrefiner/
---

## 📘 Overview
`RemoveImageRefsRefiner` operator is designed to remove image reference formats from text, including Markdown image links, image numbers, special symbol combinations, and other image reference patterns. Through multi-pattern regular expression matching, this operator can effectively identify and remove various image reference formats, cleaning text data.

## __init__ function
```python
def __init__(self)
```
### init parameter description
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **None** | - | - | This operator requires no initialization parameters. |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name for text field to process. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import RemoveImageRefsRefiner
from dataflow.utils.storage import FileStorage

class RemoveImageRefsRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_image_refs_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveImageRefsRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveImageRefsRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with image references removed |

### 📋 Sample Input

```json
{"text":"Normal text without references"}
{"text":"See figure ![](images/abc123.jpg) for details"}
{"text":"图 1-2：示例图片说明"}
```

### 📤 Sample Output

```json
{"text":"Normal text  "}
{"text":"See figure  for "}
{"text":""}
```

### 📊 Results Analysis

**Sample 1**: Text was modified (may have removed certain patterns)
**Sample 2**: Removed Markdown image reference `![](images/abc123.jpg)`
**Sample 3**: Removed Chinese image description "图 1-2：示例图片说明"

**Use Cases**:
- Clean image references in documents
- Remove image numbers and captions
- Text preprocessing

**Notes**:
- Uses multiple regex patterns to match image references
- May remove too much content, use with caution
