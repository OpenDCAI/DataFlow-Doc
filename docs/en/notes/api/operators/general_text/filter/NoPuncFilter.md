---
title: NoPuncFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/nopuncfilter/
---

## 📘 Overview

`NoPuncFilter` filters text to ensure that sentence lengths do not exceed a set threshold. It traverses each sentence in the text, calculates its word count, and filters out entries containing overly long sentences.

## __init__ Function
```python
def __init__(self, threshold: int=112)
```
### Init Parameters
| Parameter | Type | Default | Description |
| :---------- | :--- | :---- | :----------------------------- |
| **threshold** | int | 112 | Threshold for maximum sentence word count. |

## run Function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='no_punc_filter_label')
```
#### Parameters
| Name | Type | Default | Description |
| :----------- | :---------------- | :------------------------- | :------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to check. |
| **output_key** | str | 'no_punc_filter_label' | Output column name for storing filter result labels. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import NoPuncFilter
from dataflow.utils.storage import FileStorage

class NoPuncFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/no_punc_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = NoPuncFilter(
            threshold=112
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='no_punc_filter_label'
        )

if __name__ == "__main__":
    test = NoPuncFilterTest()
    test.forward()
```

#### 🧾 Default Output Format
After execution, the operator adds a column specified by `output_key` (default `no_punc_filter_label`) to the original data, with a value of 1 indicating that the data passed the filter check. Finally, the operator filters and writes back all rows that pass the check.
| Field | Type | Description |
| :----------------------- | :---- | :----------------------------------------------------------- |
| no_punc_filter_label | int | Filter result label. Value of 1 indicates all sentences in this text row are within the threshold. |

### 📋 Example Input

```json
{"text": "This is a normal sentence. It has proper punctuation."}
{"text": "Thisisaverylongsentencewithoutanyspacesorpunctuationwhichwillexceedthethresholdbecauseithasmanymanywordsthatcannotbecountedproperlywithoutspacesandthiswillcauseittobefiltered"}
{"text": "Short text. Another sentence. Good punctuation throughout the entire document which is very helpful."}
```

### 📤 Example Output

```json
{"text": "This is a normal sentence. It has proper punctuation.", "no_punc_filter_label": 1}
{"text": "Thisisaverylongsentencewithoutanyspacesorpunctuationwhichwillexceedthethresholdbecauseithasmanymanywordsthatcannotbecountedproperlywithoutspacesandthiswillcauseittobefiltered", "no_punc_filter_label": 1}
{"text": "Short text. Another sentence. Good punctuation throughout the entire document which is very helpful.", "no_punc_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Normal sentences)**:
- Split by punctuation: ["This is a normal sentence", " It has proper punctuation", ""]
- Max word count: About 5-6 words
- Threshold: 112
- **Passes filter** (5-6 ≤ 112)

**Sample 2 (Long sentence without spaces)**:
- Split by punctuation: Entire segment as one sentence
- Tokenized with `split()`: 1 "word" (no spaces)
- Max word count: 1
- Threshold: 112
- **Passes filter** (1 ≤ 112)

**Sample 3 (Multiple short sentences)**:
- Split into multiple sentences by punctuation
- Max word count per sentence < 112
- **Passes filter** (all sentences within threshold)

**Use Cases**:
- Filter text containing overly long sentences
- Ensure text has good readability
- Data quality control
- Filter abnormal machine-generated text

**Notes**:
- Uses regex `[–.!?,;•/|…]` to split sentences
- Uses space `split()` to count words
- Despite the name NoPuncFilter, it actually detects overly long sentences
- Default threshold is 112 words
- Text without spaces is treated as a single word
