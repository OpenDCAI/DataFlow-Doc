---
title: CharNumberFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/charnumberfilter/
---

## 📘 Overview

The `CharNumberFilter` operator filters text data based on character count. It calculates the total number of characters in the specified text field after removing whitespace characters, and only retains records where the character count is greater than or equal to a preset threshold.

## __init__ Function

```python
def __init__(self, threshold: int=100)
```

### Initialization Parameters

| Parameter Name | Type | Default | Description |
| :-------------- | :---- | :------ | :----------------------------------------------------------- |
| **threshold** | int | 100 | Minimum character count threshold. After removing whitespace characters (spaces, newlines, tabs), the character count of the text must be greater than or equal to this value to be retained. |

## run Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='char_number_filter_label')
```

#### Parameters

| Name | Type | Default | Description |
| :------------- | :---------------- | :--------------------------- | :--------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance responsible for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to be filtered. |
| **output_key** | str | 'char_number_filter_label' | Output column name for storing the filter result label (1 means passed, 0 means failed). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import CharNumberFilter
from dataflow.utils.storage import FileStorage

class CharNumberFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/char_number_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = CharNumberFilter(
            threshold=100
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='char_number_filter_label'
        )

if __name__ == "__main__":
    test = CharNumberFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

This operator adds a new column specified by `output_key` to the input DataFrame, with values of `1` (passed filter) or `0` (failed filter). Finally, the operator writes the filtered DataFrame (rows where the new column value is `1`) back to storage.

| Field | Type | Description |
| :--------------------------- | :---- | :--------------------------------------------------- |
| text | str | Original input text |
| **char_number_filter_label** | int | Filter result label, `1` means character count meets threshold condition, `0` means does not meet. |

### 📋 Sample Input

```json
{"text": "Short"}
{"text": "This is a medium length text that should pass the character count filter with enough characters to meet the threshold."}
{"text": "A"}
{"text": "The quick brown fox jumps over the lazy dog. This sentence contains enough characters to pass the minimum threshold for the character number filter."}
{"text": "x"}
```

### 📤 Sample Output

```json
{"text": "The quick brown fox jumps over the lazy dog. This sentence contains enough characters to pass the minimum threshold for the character number filter.", "char_number_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 ("Short")**:
- Character count after removing whitespace: 5
- **Failed filter** (< 100 threshold)

**Sample 2 (Medium Length Text)**:
- Original text: approximately 120 characters
- Character count after removing whitespace: approximately 100 characters
- **Passed filter** (≥ 100 threshold)

**Sample 3 ("A")**:
- Character count after removing whitespace: 1
- **Failed filter** (< 100 threshold)

**Sample 4 (Long Text)**:
- Original text: approximately 157 characters
- Character count after removing whitespace: approximately 135 characters
- **Passed filter** (≥ 100 threshold)

**Sample 5 ("x")**:
- Character count after removing whitespace: 1
- **Failed filter** (< 100 threshold)

**Use Cases**:
- Filter text that is too short to ensure data quality
- Remove invalid or incomplete entries
- Set minimum text length requirements
- Clean noise data in datasets

**Notes**:
- Character counting removes all spaces, newlines, and tabs
- Chinese characters, English characters, numbers, and punctuation are all counted
- Recommend adjusting the threshold based on specific use cases (default 100 is suitable for paragraph-level text)
