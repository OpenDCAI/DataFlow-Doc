---
title: NgramSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/ngramsampleevaluator/
---

## 📘 Overview

`NgramSampleEvaluator` is an operator for evaluating text originality by analyzing the n-gram repetition rate in text. It helps detect content repetition and assess text diversity by calculating the proportion of unique n-grams.

## __init__

```python
def __init__(self, n=3)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **n** | int | 3 | N-gram length (number of consecutive words). Default is trigrams (3-grams). |

## run

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name specifying the column containing the text to be evaluated. |

## 🧠 Example Usage
```python
from dataflow.operators.general_text import NgramSampleEvaluator
from dataflow.utils.storage import FileStorage

class NgramSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/eval_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = NgramSampleEvaluator(n=3)
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = NgramSampleEvaluatorTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | The original input text |
| NgramScore | float | N-gram originality score (0-1, higher indicates less repetition and better originality) |

### 📋 Example Input
```json
{"text": "The quick brown fox jumps over the lazy dog. The sun is shining brightly in the clear blue sky. Birds are singing melodiously in the tall green trees. Children are playing happily in the beautiful park. Flowers are blooming magnificently everywhere you look. Nature displays its wonder through colorful butterflies dancing among fragrant roses. People enjoy peaceful walks along winding pathways surrounded by lush vegetation."}
{"text": "The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat."}
{"text": "In contemporary discourse surrounding technological advancement, one must acknowledge the multifaceted ramifications of artificial intelligence implementation. The epistemological considerations necessitate comprehensive analysis of socioeconomic implications. Furthermore, the paradigmatic shift toward automation requires meticulous examination of ethical frameworks governing algorithmic decision-making processes. Subsequently, organizational infrastructures must accommodate transformative methodologies while simultaneously addressing unprecedented complexities inherent within technological ecosystems."}
```

### 📤 Example Output
```json
{"text": "The quick brown fox...", "NgramScore": 1.0}
{"text": "The cat sat on the mat...", "NgramScore": 0.075}
{"text": "In contemporary discourse...", "NgramScore": 1.0}
```

### 📊 Result Analysis

**Sample 1 (Normal Descriptive Text):**
- NgramScore: 1.0 (perfect score, all 3-grams are unique)
- No repetition, high text quality and originality

**Sample 2 (Highly Repetitive Text):**
- NgramScore: 0.075 (very low score, severe repetition)
- The sentence "The cat sat on the mat" repeats 14 times
- Only a few unique 3-grams, very low text quality

**Sample 3 (Complex Academic Text):**
- NgramScore: 1.0 (perfect score, all 3-grams are unique)
- Despite complex vocabulary, no repetitive patterns
- Demonstrates high originality and diversity

**Application Value**: This operator is particularly effective at detecting low-quality generated text (such as model-generated repetitive content) and can be used for automated text quality filtering.
