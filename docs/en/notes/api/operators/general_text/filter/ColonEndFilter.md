---
title: ColonEndFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/colonendfilter/
---

## 📘 Overview
`ColonEndFilter` is a filtering operator that checks whether input text ends with a colon (`:`). This operator is typically used in the data cleaning phase to filter out potentially incomplete sentences or questions.

## `__init__` Function
```python
def __init__(self)
```
### Initialization Parameters
This operator requires no parameters during initialization.

## `run` Function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = None)
```
Executes the main operator logic, reading the input DataFrame from storage, checking whether the text in the specified column ends with a colon, and writing data rows that do not end with a colon back to storage.

#### Parameters
| Name         | Type              | Default | Description                                                         |
| :------------- | :---------------- | :------- | :----------------------------------------------------------- |
| **storage**    | DataFlowStorage   | Required     | DataFlow storage instance responsible for reading and writing data. |
| **input_key**  | str               | Required     | Input column name specifying the text field to check. |
| **output_key** | str               | None     | Output column name for storing the filter label (1 means retain, 0 means filter). If not specified, will automatically be set to "colonendfilter_label". |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import ColonEndFilter
from dataflow.utils.storage import FileStorage

class ColonEndFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/colon_end_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = ColonEndFilter()
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = ColonEndFilterTest()
    test.forward()
```

#### 🧾 Default Output Format
The operator adds a new `output_key` column to the DataFrame with values of 1 (does not end with colon, retain) or 0 (ends with colon, filter), then filters out rows with value 0. The final output DataFrame only contains rows that passed the filter.

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Original input text |
| colonendfilter_label | int | Filter label (1 means retain, 0 means filter) |

### 📋 Sample Input

```json
{"text": "This is a complete sentence without a colon."}
{"text": "This sentence ends with a colon:"}
{"text": "Question: What is this?"}
{"text": "Another incomplete question:"}
{"text": "A proper statement with punctuation."}
```

### 📤 Sample Output

```json
{"text": "This is a complete sentence without a colon.", "colonendfilter_label": 1}
{"text": "Question: What is this?", "colonendfilter_label": 1}
{"text": "A proper statement with punctuation.", "colonendfilter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Complete Sentence)**:
- Text: "This is a complete sentence without a colon."
- Does not end with colon
- **Retained** (colonendfilter_label=1)

**Sample 2 (Ends with Colon)**:
- Text: "This sentence ends with a colon:"
- Ends with colon
- **Filtered** (colonendfilter_label=0, not in output)

**Sample 3 (Colon in Middle)**:
- Text: "Question: What is this?"
- Colon in middle, ends with question mark
- **Retained** (colonendfilter_label=1)

**Sample 4 (Ends with Colon)**:
- Text: "Another incomplete question:"
- Ends with colon
- **Filtered** (colonendfilter_label=0, not in output)

**Sample 5 (Normal Punctuation)**:
- Text: "A proper statement with punctuation."
- Ends with period
- **Retained** (colonendfilter_label=1)

**Use Cases**:
- Filter incomplete questions or titles
- Remove potentially truncated text
- Identify and remove content prompts awaiting completion
- Improve quality of dialogue or Q&A datasets

**Typical Filtered Text Patterns**:
- "Please explain the following concept:"
- "Question:"
- "Title:"
- "Main content:"

**Notes**:
- Only checks if text ends with the colon character `:`
- Does not check for Chinese colon `：` (modify source code if needed)
- Retains cases where colons appear in the middle of text
