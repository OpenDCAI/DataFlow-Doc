---
title: BleuSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/bleusampleevaluator/
---

## 📘 Overview

`BleuSampleEvaluator` is an operator for evaluating text quality by calculating the BLEU (Bilingual Evaluation Understudy) score between generated text and reference text. BLEU scores assess translation or text generation accuracy and fluency primarily through n-gram (sequences of n consecutive words) overlap analysis.

## `__init__`

```python
def __init__(self, n=4, eff="average", special_reflen=None)
```

| Parameter | Type | Default | Description |
| :--- | :-- | :--- | :--- |
| **n** | int | 4 | Maximum n-gram length for BLEU score calculation. |
| **eff** | str | "average" | Reference text length calculation method. Options: "shortest", "average", or "longest". |
| **special_reflen** | int | None | If specified, uses this value as the special reference text length instead of calculating from actual reference text. |

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str, reference_key: str, output_key: str='BleuScore')
```

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the generated text field to be evaluated. |
| **reference_key** | str | Required | Reference column name corresponding to the standard reference text field. |
| **output_key** | str | "BleuScore" | Output column name for storing the calculated BLEU score. |

## 🧠 Example Usage
```python
from dataflow.operators.general_text import BleuSampleEvaluator
from dataflow.utils.storage import FileStorage

class BleuSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/gen_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = BleuSampleEvaluator(
            n=4,
            eff="average"
        )
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='input_key',
            input_reference_key='reference_key',
            output_key='BleuScore'
        )

if __name__ == "__main__":
    test = BleuSampleEvaluatorTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :-- | :--- |
| input_key | str | The original generated text |
| reference_key | str | The original reference text |
| BleuScore | float | BLEU score (0-1, higher indicates better n-gram overlap) |

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
{"input_key": "The quick brown fox jumps over the lazy dog.", "reference_key": "A fast brown fox leaps over a lazy dog.", "BleuScore": 0.5555555554}
{"input_key": "She sells seashells by the seashore.", "reference_key": "She is selling shells by the beach.", "BleuScore": 0.4232408623}
{"input_key": "To be or not to be, that is the question.", "reference_key": "The question is whether to be or not.", "BleuScore": 0.4}
{"input_key": "All that glitters is not gold.", "reference_key": "Not everything that shines is gold.", "BleuScore": 0.4999999998}
{"input_key": "A picture is worth a thousand words.", "reference_key": "A single image can convey so much meaning.", "BleuScore": 0.1238396999}
```
