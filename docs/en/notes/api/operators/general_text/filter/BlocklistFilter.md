---
title: BlocklistFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/blocklistfilter/
---

## 📘 Overview

`BlocklistFilter` is a text filtering operator that uses language-specific blocklists to screen text data. It can decide whether to retain data based on the count of blocklist keywords in the text, and supports using a tokenizer for more precise word matching.

## __init__ Function

```python
def __init__(self, language:str = 'en', threshold:int = 1, use_tokenizer:bool = False)
```

### Initialization Parameters

| Parameter Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **language** | str | 'en' | Specifies the language code for the blocklist (e.g., 'en', 'zh'). The system will load the corresponding language blocklist file. |
| **threshold** | int | 1 | Maximum threshold for the number of blocklist keywords allowed in the text. Text exceeding this threshold will be filtered. |
| **use_tokenizer** | bool | False | Whether to use the NLTK tokenizer for word-level matching. If False, uses simple whitespace splitting. |

## run Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'blocklist_filter_label')
```

Executes the main operator logic, reading the input DataFrame from storage, filtering based on the blocklist, and writing the filtered results back to storage.

#### Parameters

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance responsible for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to be filtered. |
| **output_key** | str | "blocklist_filter_label" | Output column name for storing the filter label result (1 means passed, 0 means failed). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import BlocklistFilter
from dataflow.utils.storage import FileStorage

class BlocklistFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/blocklist_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = BlocklistFilter(
            language='en',
            threshold=1,
            use_tokenizer=True
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='blocklist_filter_label'
        )

if __name__ == "__main__":
    test = BlocklistFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| text | str | Original input text |
| blocklist_filter_label | int | Filter label. A value of 1 indicates the data passed the blocklist filter (blocklist word count ≤ threshold). Output dataframe only contains rows with this column value of 1. |

### 📋 Sample Input

```json
{"text": "This is a normal and clean text without any problematic words."}
{"text": "This article discusses the anatomy of frogs and their anal glands."}
{"text": "You bastard asshole, this is complete shit!"}
```

### 📤 Sample Output

```json
{"text": "This is a normal and clean text without any problematic words.", "blocklist_filter_label": 1}
{"text": "This article discusses the anatomy of frogs and their anal glands.", "blocklist_filter_label": 1}
```

### 📊 Result Analysis

In this test, 2 texts passed the filter and 1 was filtered out:
- **Sample 1** (Passed): Contains no blocklist words, blocklist count=0 ≤ 1 ✓
- **Sample 2** (Passed): Contains 1 blocklist word "anal", blocklist count=1 ≤ 1 ✓
- **Sample 3** (Filtered): Contains 3 blocklist words "bastard", "asshole", "shit", blocklist count=3 > 1 ✗

Filtering Logic Explanation:
- The system loaded the English blocklist (403 sensitive words)
- The threshold was set to 1, meaning at most 1 blocklist word is allowed
- Using `use_tokenizer=True` for precise word-level matching that correctly handles punctuation

**Use Cases**:
- Filter text containing sensitive words, profanity, or offensive content
- Content moderation and compliance checking
- Protect community environments and maintain content quality
- Multi-language support with different language blocklists

**Notes**:
- Blocklist files are located at `dataflow/operators/general_text/filter/blocklist/{language}.txt`
- Blocklists can be customized by adding or modifying content as needed
- Using `use_tokenizer=True` provides more precise word-level matching to avoid false positives
