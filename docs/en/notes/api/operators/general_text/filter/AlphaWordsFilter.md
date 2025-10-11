---
title: AlphaWordsFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/alphawordsfilter/
---

## 📘 Overview

The `AlphaWordsFilter` operator validates whether the ratio of alphabetic words in text meets a specified threshold. It supports two tokenization modes: professional tokenization using the NLTK library, or simple whitespace splitting. This operator filters out text lines that do not meet the ratio condition.

## `__init__` Function

```python
def __init__(self, threshold: float, use_tokenizer: bool)
```

### Initialization Parameters

| Parameter Name | Type | Default | Description |
| :-------------- | :---- | :----- | :------------------------------------------------------- |
| **threshold**   | float | Required | Threshold for the alphabetic word ratio (between 0-1). The ratio of words containing letters to total words must exceed this value to pass the filter. |
| **use_tokenizer** | bool  | Required | Whether to use the NLTK tokenizer. If `False`, uses simple whitespace splitting. |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='alpha_words_filter_label')
```

#### Parameters

| Name         | Type            | Default                       | Description                                                         |
| :----------- | :-------------- | :--------------------------- | :----------------------------------------------------------- |
| **storage**  | DataFlowStorage | Required                         | DataFlow storage instance responsible for reading and writing data. |
| **input_key**| str             | Required                         | Input column name corresponding to the text field to be filtered. |
| **output_key** | str             | 'alpha_words_filter_label'   | Output column name for storing the filter result label (1 means passed, 0 means failed). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import AlphaWordsFilter
from dataflow.utils.storage import FileStorage

class AlphaWordsFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/alpha_words_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = AlphaWordsFilter(
            threshold=0.5,
            use_tokenizer=False
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='alpha_words_filter_label'
        )

if __name__ == "__main__":
    test = AlphaWordsFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Original input text |
| alpha_words_filter_label | int | Filter label (1 means passed, 0 means failed) |

### 📋 Sample Input

```json
{"text": "The quick brown fox jumps over the lazy dog in the beautiful garden."}
{"text": "123456 789 !!!### @@@ $$$ %%% ^^^ &&& *** ((( )))"}
{"text": "Hello123 World456 Test789 ABC xyz 123"}
{"text": "纯中文文本没有任何英文字母内容全部都是中文"}
{"text": "Mixed 混合 content with 50% English and 50% Chinese 中文"}
```

### 📤 Sample Output

```json
{"text": "The quick brown fox jumps over the lazy dog in the beautiful garden.", "alpha_words_filter_label": 1}
{"text": "Hello123 World456 Test789 ABC xyz 123", "alpha_words_filter_label": 1}
{"text": "Mixed 混合 content with 50% English and 50% Chinese 中文", "alpha_words_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Pure English Text)**:
- All words contain letters
- Alphabetic word ratio: 11/11 = 1.0 (100%)
- **Passed filter** (> 0.5 threshold)

**Sample 2 (Pure Numbers and Symbols)**:
- No words contain letters
- Alphabetic word ratio: 0/11 = 0.0 (0%)
- **Failed filter** (≤ 0.5 threshold)

**Sample 3 (Alphanumeric Mix)**:
- 6 words all contain letters (Hello123, World456, Test789, ABC, xyz, except the last one "123")
- Alphabetic word ratio: 5/6 ≈ 0.83 (83%)
- **Passed filter** (> 0.5 threshold)

**Sample 4 (Pure Chinese)**:
- Chinese characters do not contain English letters
- Alphabetic word ratio: 0/1 = 0.0 (0%)
- **Failed filter** (≤ 0.5 threshold)

**Sample 5 (Chinese-English Mix)**:
- Words with letters: Mixed, content, with, English, and, Chinese
- Alphabetic word ratio: 6/10 = 0.6 (60%)
- **Passed filter** (> 0.5 threshold)

**Use Cases**:
- Filter non-English or primarily numeric/symbolic text
- Ensure datasets contain sufficient English content
- Clean low-quality text mixed with many non-alphabetic characters
