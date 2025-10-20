---
title: CiderSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/cidersampleevaluator/
---

## 📘 Overview
`CiderSampleEvaluator` is an evaluation operator that uses the CIDEr (Consensus-based Image Description Evaluation) metric to measure similarity between generated text and reference text. This operator primarily calculates scores based on TF-IDF weighted n-gram overlap, commonly used for evaluating tasks such as image caption generation.

## __init__
```python
def __init__(self, n=4, sigma=6.0, df_mode="coco-val-df", idf_path="./dataflow/operators/general_text/eval/cider/coco-val-df.p")
```
### init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **n** | int | 4 | Maximum n-gram length for overlap calculation. |
| **sigma** | float | 6.0 | Sigma parameter for Gaussian penalty calculation, adjusting the magnitude of difference penalty. |
| **df_mode** | str | "coco-val-df" | Document frequency (DF) calculation mode, options: "coco-val-df" or "corpus". |
| **idf_path** | str | "./dataflow/operators/general_text/eval/cider/coco-val-df.p" | Pre-calculated IDF (Inverse Document Frequency) file path. Required when df_mode is "coco-val-df". |

### IDF File Download Instructions
When using `df_mode="coco-val-df"` (default mode), you need to download the pre-trained IDF file:

**Download URL**: [https://github.com/ramavedantam/coco-caption/raw/master/data/coco-val-df.p](https://github.com/ramavedantam/coco-caption/raw/master/data/coco-val-df.p)

**File Location**: Place the downloaded file at `./dataflow/operators/general_text/eval/cider/coco-val-df.p`

Alternatively, you can set `df_mode="corpus"` to dynamically calculate IDF from the current corpus without downloading the file.

## run
```python
def run(self, storage: DataFlowStorage, input_key: str, reference_key: str, output_key: str='CiderScore')
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the generated text field to be evaluated. |
| **reference_key** | str | Required | Input column name corresponding to the reference text field for comparison. |
| **output_key** | str | "CiderScore" | Output column name corresponding to the generated CIDEr score field. |

## 🧠 Example Usage
```python
from dataflow.operators.general_text import CiderSampleEvaluator
from dataflow.utils.storage import FileStorage

class CiderSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/gen_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = CiderSampleEvaluator(
            n=4,
            sigma=6.0,
            df_mode="coco-val-df",
            idf_path="./dataflow/operators/general_text/eval/cider/coco-val-df.p"
        )
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='input_key',
            input_reference_key='reference_key',
            output_key='CiderScore'
        )

if __name__ == "__main__":
    test = CiderSampleEvaluatorTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :-- | :--- |
| input_key | str | The original generated text |
| reference_key | str | The original reference text |
| CiderScore | float | CIDEr score (typically 0-10, higher indicates better similarity) |

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
{"input_key": "The quick brown fox jumps over the lazy dog.", "reference_key": "A fast brown fox leaps over a lazy dog.", "CiderScore": 2.1455700748}
{"input_key": "She sells seashells by the seashore.", "reference_key": "She is selling shells by the beach.", "CiderScore": 0.8880643249}
{"input_key": "To be or not to be, that is the question.", "reference_key": "The question is whether to be or not.", "CiderScore": 0.5822556198}
{"input_key": "All that glitters is not gold.", "reference_key": "Not everything that shines is gold.", "CiderScore": 0.8292019111}
{"input_key": "A picture is worth a thousand words.", "reference_key": "A single image can convey so much meaning.", "CiderScore": 0.6053086919}
```

### 📊 Results Analysis

**Sample 1**:
- CiderScore: 2.146 (high)
- Highest TF-IDF weighted n-gram overlap with good keyword matching

**Sample 2**:
- CiderScore: 0.888 (medium)
- Partial keyword overlap, moderate score after TF-IDF weight adjustment

**Sample 3**:
- CiderScore: 0.582 (medium-low)
- Significant sentence restructuring affects consecutive n-gram matching

**Sample 4**:
- CiderScore: 0.829 (medium)
- Core concept words present but with noticeable expression differences

**Sample 5**:
- CiderScore: 0.605 (medium-low)
- Large vocabulary differences, but TF-IDF weighting still captures some relevance

**Application Scenarios**:
- Image caption generation evaluation
- Video subtitle quality assessment
- Text generation tasks requiring consideration of word importance
- Evaluation scenarios balancing diversity and consistency
