---
title: StopWordFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/stopwordfilter/
---

## 📘 Overview

`StopWordFilter` is a stop word filtering operator that verifies whether the ratio of stop words in text reaches a specified threshold. It supports two tokenization modes: professional tokenization using the NLTK library or simple space-based splitting. This operator filters out text lines that do not meet the stop word ratio criteria.

## 📦 Dependencies

This operator depends on the **NLTK (Natural Language Toolkit)** library for tokenization and stop word identification. During initialization, the operator automatically downloads the required `stopwords` data package.

### NLTK Data Download Issues

If you encounter slow or stuck NLTK data downloads during initialization, you can adopt the following solutions:

**Method 1: Manual Download**
1. Visit the NLTK data repository: [https://github.com/nltk/nltk_data](https://github.com/nltk/nltk_data)
2. Download the `stopwords` data package
3. Place the data package in the NLTK data directory (usually `~/nltk_data/` or check via `nltk.data.path`)

**Method 2: Use Mirror Source**
```python
import nltk
nltk.download('stopwords', download_dir='./nltk_data/')
```

**Method 3: Use Non-tokenizer Mode**

If you don't need to use the NLTK tokenizer, you can set `use_tokenizer=False` during initialization, which will use simple space splitting without requiring NLTK data download.

## __init__ Function
```python
def __init__(self, threshold: float, use_tokenizer: bool):
```
### Init Parameters

| Parameter | Type | Default | Description |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **threshold** | float | Required | Stop word ratio threshold. |
| **use_tokenizer** | bool | Required | Whether to use NLTK tokenizer. If `False`, uses simple space splitting. |

## run Function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='stop_word_filter_label'):
```
#### Parameters

| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to be filtered. |
| **output_key** | str | "stop_word_filter_label" | Output column name for marking filter results. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import StopWordFilter
from dataflow.utils.storage import FileStorage

class StopWordFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/stop_word_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = StopWordFilter(
            threshold=0.3,
            use_tokenizer=False
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='stop_word_filter_label'
        )

if __name__ == "__main__":
    test = StopWordFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

The operator adds a boolean label column (specified by `output_key`) to the DataFrame and filters out rows that don't meet the stop word ratio threshold. The output DataFrame retains all original columns and only includes rows that pass the filter.

| Field | Type | Description |
| :-------------- | :---- | :---------- |
| stop_word_filter_label | int | Stop word filter result label (1 for pass, 0 for fail), always 1 in output DataFrame. |

### 📋 Example Input

```json
{"text": "programming machine learning artificial intelligence"}
{"text": "The quick brown fox jumps over the lazy dog"}
{"text": "This is an example of a sentence with many stop words in it"}
```

### 📤 Example Output

```json
{"text": "This is an example of a sentence with many stop words in it", "stop_word_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (No stop words)**:
- Words: programming, machine, learning, artificial, intelligence
- Stop word count: 0
- Total word count: 4
- Stop word ratio: 0 / 4 = 0.0
- **Filtered out** (0.0 ≤ 0.3, and stop word count ≤ 2)

**Sample 2 (Medium stop words)**:
- Words: the, quick, brown, fox, jumps, over, the, lazy, dog
- Stop word count: 3 ("the" appears twice, "over" once)
- Total word count: 9
- Stop word ratio: 3 / 9 ≈ 0.33
- **Passes filter** (0.33 > 0.3, and stop word count > 2)

**Sample 3 (High stop word ratio)**:
- Words: this, is, an, example, of, a, sentence, with, many, stop, words, in, it
- Stop word count: 10 (this, is, an, of, a, with, in, it, etc.)
- Total word count: 13
- Stop word ratio: 10 / 13 ≈ 0.77
- **Passes filter** (0.77 > 0.3, and stop word count > 2)

**Filter Conditions**:
```python
ratio > threshold AND num_stop_words > 2
```
- Stop word ratio must be **greater than** threshold
- Stop word count must be **greater than** 2
- Both conditions must be met to pass filter

**How It Works**:
1. Convert text to lowercase
2. Select tokenization method based on `use_tokenizer`
3. Count stop words
4. Calculate stop word ratio = stop words / total words
5. Retain only if both ratio and count requirements are met

**Use Cases**:
- Filter non-natural language text lacking stop words
- Detect machine-generated or keyword-stuffed text
- Ensure text linguistic completeness
- Dataset quality control

**Notes**:
- NLTK stop word list is optimized for English
- Case-insensitive (converted to lowercase for comparison)
- Stop word count must be > 2 to potentially pass filter
- Using `use_tokenizer=False` avoids NLTK download issues
