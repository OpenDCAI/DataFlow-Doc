---
title: SentenceNumberFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/sentencenumberfilter/
---

## 📘 Overview

`SentenceNumberFilter` is a text filtering operator that checks whether the number of sentences in input text falls within a specified minimum and maximum range. It counts sentences using regular expressions and only retains text rows that meet the criteria.

## __init__ Function
```python
def __init__(self, min_sentences: int=3, max_sentences: int=7500)
```
### Init Parameters
| Parameter              | Type | Default | Description                       |
| :------------------ | :--- | :------- | :------------------------- |
| **min_sentences**   | int  | 3        | Minimum number of sentences text should contain. |
| **max_sentences**   | int  | 7500     | Maximum number of sentences text should contain. |

## run Function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'sentence_number_filter_label')
```
#### Parameters
| Name          | Type              | Default                           | Description                                   |
| :------------ | :---------------- | :------------------------------- | :------------------------------------- |
| **storage**   | DataFlowStorage   | Required                             | DataFlow storage instance for reading and writing data.     |
| **input_key** | str               | Required                             | Input column name corresponding to the text field to filter.       |
| **output_key**| str               | 'sentence_number_filter_label'   | Output column name for storing filter result labels.     |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import SentenceNumberFilter
from dataflow.utils.storage import FileStorage

class SentenceNumberFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/sentence_number_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = SentenceNumberFilter(
            min_sentences=3,
            max_sentences=7500
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='sentence_number_filter_label'
        )

if __name__ == "__main__":
    test = SentenceNumberFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

After execution, the operator adds a new field (default `sentence_number_filter_label`) to the original data with a value of 1, retaining only rows that pass filtering.

| Field | Type | Description |
| :--- | :--- | :--- |
| sentence_number_filter_label | int | Filter result label; value of 1 indicates this data row passed filtering. |

### 📋 Example Input

```json
{"text": "Hi"}
{"text": "Hello world. This is a test. It has three sentences."}
{"text": "First sentence. Second sentence. Third sentence. Fourth sentence. Fifth sentence. Sixth sentence."}
```

### 📤 Example Output

```json
{"text": "Hello world. This is a test. It has three sentences.", "sentence_number_filter_label": 1}
{"text": "First sentence. Second sentence. Third sentence. Fourth sentence. Fifth sentence. Sixth sentence.", "sentence_number_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 ("Hi")**:
- Matched sentence count: 1
- Sentence count range: [3, 7500]
- **Filtered out** (1 < 3)

**Sample 2 ("Hello world. This is a test. It has three sentences.")**:
- Matched sentence count: About 3-4 (using regex `\b[^.!?\n]+[.!?]*`)
- Sentence count range: [3, 7500]
- **Passes filter** (within range)

**Sample 3 (6 complete sentences)**:
- Matched sentence count: 6
- Sentence count range: [3, 7500]
- **Passes filter** (within range)

**Use Cases**:
- Filter overly short text fragments
- Filter overly long documents
- Dataset quality control
- Ensure text has sufficient content depth

**Notes**:
- Uses regex `\b[^.!?\n]+[.!?]*` to match sentences
- Supports Chinese and English sentence-ending punctuation (。！？.!?)
- Empty text will be filtered
- Sentence segmentation rules may differ across languages
