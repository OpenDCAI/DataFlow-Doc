---
title: SymbolWordRatioFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/symbolwordratiofilter/
---

## 📘 Overview
`SymbolWordRatioFilter` is a data filtering operator that checks the ratio of specific symbols (such as "#", "...", "…") to the total word count in text. If this ratio exceeds the preset threshold, the text line will be filtered out. This helps clean up entries with symbol abuse or format anomalies in the dataset.

## __init__ Function
```python
def __init__(self, threshold: float=0.4)
```
### Init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.4 | Threshold for symbol-to-word ratio. Text exceeding this threshold will be filtered. |

## run Function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='symbol_word_ratio_filter_label')
```
Executes the operator's main logic, reading the input DataFrame from storage, filtering based on the symbol-to-word ratio, and writing filtered results back to storage.

#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to check. |
| **output_key** | str | "symbol_word_ratio_filter_label" | Output column name for storing filter result labels (1 for pass, 0 for fail). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import SymbolWordRatioFilter
from dataflow.utils.storage import FileStorage

class SymbolWordRatioFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/symbol_word_ratio_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = SymbolWordRatioFilter(
            threshold=0.4
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='symbol_word_ratio_filter_label'
        )

if __name__ == "__main__":
    test = SymbolWordRatioFilterTest()
    test.forward()
```

#### 🧾 Default Output Format
The operator adds a column specified by `output_key` to the DataFrame and filters based on that column's values. The final output DataFrame only contains rows that pass the filter.

| Field | Type | Description |
| :--- | :--- | :--- |
| [input_key] | str | Original input text field. |
| [output_key] | int | Filter label with value 1, indicating this row passed the symbol-to-word ratio check. |

### 📋 Example Input

```json
{"text": "This is a normal sentence without symbols."}
{"text": "This # text # has # too # many # hashtags # everywhere #"}
{"text": "Some text with ... and ... more ... dots..."}
```

### 📤 Example Output

```json
{"text": "This is a normal sentence without symbols.", "symbol_word_ratio_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Normal text)**:
- Word count: 7
- Symbol count: 0 (no #, ..., … symbols)
- Symbol-to-word ratio: 0 / 7 = 0.0
- **Passes filter** (0.0 < 0.4 threshold)

**Sample 2 (Too many hashtags)**:
- Word count: 9
- Symbol count: 8 # symbols
- Symbol-to-word ratio: 8 / 9 ≈ 0.89
- **Filtered out** (0.89 > 0.4 threshold)

**Sample 3 (Too many ellipses)**:
- Word count: 7
- Symbol count: 4 "..." symbols (including the one at the end of "dots...")
- Symbol-to-word ratio: 4 / 7 ≈ 0.57
- **Filtered out** (0.57 > 0.4 threshold)

**Detected Symbol Types**:
- `#` - hashtag symbol
- `...` - ellipsis (three dots)
- `…` - Unicode ellipsis

**Use Cases**:
- Filter social media-style text (excessive hashtags)
- Clean up format-anomalous text
- Remove low-quality content with symbol abuse
- Dataset quality control

**Notes**:
- Symbol counting is exact match, no partial matching
- Uses NLTK's `WordPunctTokenizer` for tokenization
- Smaller `threshold` means stricter filtering
