---
title: LexicalDiversityFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/lexicaldiversityfilter/
---

## 📘 Overview

`LexicalDiversityFilter` is a filter based on lexical diversity scores. It calculates text lexical diversity using two methods: MTLD (Moving-Average Type-Token Ratio) and HDD (Hypergeometric Distribution Diversity), and filters data according to set score thresholds. Higher scores indicate richer vocabulary usage in text.

## __init__ Function

```python
def __init__(self, min_scores: dict = {'mtld': 50, 'hdd': 0.8}, max_scores: dict = {'mtld': 99999, 'hdd': 1.0})
```

### Init Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_scores** | dict | `{'mtld': 50, 'hdd': 0.8}` | Dictionary of minimum score thresholds for each metric. |
| **max_scores** | dict | `{'mtld': 99999, 'hdd': 1.0}` | Dictionary of maximum score thresholds for each metric. |

## run Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_keys = ['mtld', 'hdd'])
```

#### Parameters

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field for lexical diversity analysis. |
| **output_keys** | list | `['mtld', 'hdd']` | List of metric names for filtering; must match keys in `min_scores` and `max_scores`. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import LexicalDiversityFilter
from dataflow.utils.storage import FileStorage

class LexicalDiversityFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/lexical_diversity_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = LexicalDiversityFilter(
            min_scores={'mtld': 50, 'hdd': 0.8},
            max_scores={'mtld': 99999, 'hdd': 1.0}
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_keys=['mtld', 'hdd']
        )

if __name__ == "__main__":
    test = LexicalDiversityFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

After execution, the operator adds new columns to the original DataFrame and writes rows meeting filter criteria to new storage files. New columns are as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| text | str | Original input text column. |
| LexicalDiversityMTLDScore | float | MTLD lexical diversity score (higher values indicate better diversity). |
| LexicalDiversityHD-DScore | float | HDD lexical diversity score (higher values indicate better diversity). |
| LexicalDiversityMTLDScore_label | int | MTLD score filter label (1 for pass, 0 for outside threshold range). |
| LexicalDiversityHD-DScore_label | int | HDD score filter label (1 for pass, 0 for outside threshold range). |

### 📋 Example Input

```json
{"text": "The fascinating world of natural language processing encompasses various sophisticated algorithms and methodologies. Machine learning techniques enable computers to understand, interpret, and generate human language effectively. Advanced neural networks transform raw textual data into meaningful representations through complex mathematical operations. Researchers continuously develop innovative approaches to improve accuracy and efficiency in computational linguistics applications."}
{"text": "Good good good good good good good good good good good good good good good good good good good good good good good good good good."}
```

### 📤 Example Output

```json
{"text": "The fascinating world...", "LexicalDiversityMTLDScore": 145.23, "LexicalDiversityHD-DScore": 0.92, "LexicalDiversityMTLDScore_label": 1, "LexicalDiversityHD-DScore_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Vocabulary-rich text)**:
- Text length: Approximately 55 words
- MTLD score: 145.23 (high diversity, ≥ 50 threshold)
- HDD score: 0.92 (rich vocabulary, ≥ 0.8 threshold)
- **Passes filter** (both metrics within range)

**Sample 2 (Repetitive vocabulary text)**:
- Text length: Approximately 26 words
- MTLD score: Possibly NaN (text too short)
- HDD score: Approximately 0.04 (extremely low diversity, < 0.8 threshold)
- **Filtered out** (HDD below minimum threshold)

**Key Features**:
1. **MTLD (Measure of Textual Lexical Diversity)**: Evaluates lexical diversity by calculating the number of words needed to maintain a specific TTR threshold
2. **HDD (HD-D, Hypergeometric Distribution Diversity)**: Lexical richness estimation method based on hypergeometric distribution

**Use Cases**:
- Filter high-quality text with rich vocabulary and diverse expression
- Filter low-quality content with high repetition and poor vocabulary
- Build language model training datasets
- Ensure text lexical diversity meets specific standards

**Notes**:
- **Text Length Requirement**: Recommended text length > 50 words; overly short text may return NaN values
- **NaN Value Handling**: Operator automatically treats NaN values as pass (allows short text to pass)
- **Threshold Settings**: MTLD typically ranges 0-200, HDD ranges 0-1
- **Default Thresholds**: MTLD ≥ 50, HDD between 0.8-1.0, suitable for high-quality text filtering
- Threshold ranges can be adjusted based on specific application scenarios
