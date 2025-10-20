---
title: BertSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/bertsampleevaluator/
---

## 📘 Overview

The `BertSampleEvaluator` is an operator designed to evaluate the similarity between generated text and reference text using BERTScore. It leverages contextual embeddings from BERT-based models to compute precision, recall, and F1 scores, providing a semantic-level assessment of text quality.

## __init__

```python
def __init__(self, lang='en', model_cache_dir='./dataflow_cache')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **lang** | str | 'en' | The language of the text to be evaluated (e.g., 'en', 'zh'). |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded BERT model. |

## run

```python
def run(self, storage: DataFlowStorage, input_key: str, reference_key: str, output_key: str='BertScore')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The column name corresponding to the generated text field. |
| **reference_key** | str | Required | The column name corresponding to the reference text field. |
| **output_key** | str | 'BertScore' | The column name for the output score field. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import BertSampleEvaluator
from dataflow.utils.storage import FileStorage

class BertSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/gen_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = BertSampleEvaluator(
            lang='en',
            model_cache_dir='./dataflow_cache'
        )
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='input_key',
            input_reference_key='reference_key',
            output_key='BertScore'
        )

if __name__ == "__main__":
    test = BertSampleEvaluatorTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| input_key | str | The original generated text |
| reference_key | str | The original reference text |
| BertScore | float | BERTScore F1 score (0-1, higher indicates better similarity) |

### 📋 Example Input

```json
{"input_key": "The quick brown fox jumps over the lazy dog.", "reference_key": "A fast brown fox leaps over a lazy dog."}
{"input_key": "She sells seashells by the seashore.", "reference_key": "She is selling shells by the beach."}
{"input_key": "To be or not to be, that is the question.", "reference_key": "The question is whether to be or not."}
{"input_key": "All that glitters is not gold.", "reference_key": "Not everything that shines is gold."}
{"input_key": "A picture is worth a thousand words.", "reference_key": "A single image can convey so much meaning."}
```

### 📤 Example Output

```json
{"input_key": "The quick brown fox jumps over the lazy dog.", "reference_key": "A fast brown fox leaps over a lazy dog.", "BertScore": 0.9599858522}
{"input_key": "She sells seashells by the seashore.", "reference_key": "She is selling shells by the beach.", "BertScore": 0.8968580365}
{"input_key": "To be or not to be, that is the question.", "reference_key": "The question is whether to be or not.", "BertScore": 0.8636844754}
{"input_key": "All that glitters is not gold.", "reference_key": "Not everything that shines is gold.", "BertScore": 0.9327103496}
{"input_key": "A picture is worth a thousand words.", "reference_key": "A single image can convey so much meaning.", "BertScore": 0.8256326318}
```

### 📊 Results Analysis

**Sample 1**:
- BertScore: 0.960 (high similarity)
- Both sentences are semantically very similar, with only slight differences in word choice (jumps vs leaps, quick vs fast)

**Sample 2**:
- BertScore: 0.897 (moderately high similarity)
- Subject and location remain consistent, with slight changes in verb tense (sells vs selling, seashore vs beach)

**Sample 3**:
- BertScore: 0.864 (medium similarity)
- Core semantics are the same but sentence structure has noticeable adjustments

**Sample 4**:
- BertScore: 0.933 (high similarity)
- Semantics are almost identical with different expressions

**Sample 5**:
- BertScore: 0.826 (medium similarity)
- Completely different vocabulary expressing the same meaning, demonstrating BERT's semantic understanding capabilities

**Application Scenarios**:
- Text generation quality assessment
- Machine translation evaluation
- Summarization quality evaluation
- Semantic similarity computation
