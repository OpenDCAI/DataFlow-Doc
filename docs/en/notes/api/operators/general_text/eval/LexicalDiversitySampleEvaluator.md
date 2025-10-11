---
title: LexicalDiversitySampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/lexicaldiversitysampleevaluator/
---

## 📘 Overview

`LexicalDiversitySampleEvaluator` is an operator for evaluating text lexical diversity. It uses two mainstream lexical diversity metrics - MTLD (Measure of Textual Lexical Diversity) and HD-D (Hypergeometric Distribution Diversity) to quantify the richness and variety of vocabulary in text.

## __init__

```python
def __init__(self)
```

This operator requires no parameters during initialization.

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
from dataflow.operators.general_text import LexicalDiversitySampleEvaluator
from dataflow.utils.storage import FileStorage

class LexicalDiversitySampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/eval_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = LexicalDiversitySampleEvaluator()
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = LexicalDiversitySampleEvaluatorTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | The original input text |
| mtld | float | MTLD lexical diversity score (higher indicates more diverse vocabulary) |
| hdd | float | HD-D lexical diversity score (0-1, higher indicates more diverse vocabulary) |

### 📋 Example Input
```json
{"text": "The quick brown fox jumps over the lazy dog. The sun is shining brightly in the clear blue sky. Birds are singing melodiously in the tall green trees. Children are playing happily in the beautiful park. Flowers are blooming magnificently everywhere you look. Nature displays its wonder through colorful butterflies dancing among fragrant roses. People enjoy peaceful walks along winding pathways surrounded by lush vegetation."}
{"text": "The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat."}
{"text": "In contemporary discourse surrounding technological advancement, one must acknowledge the multifaceted ramifications of artificial intelligence implementation. The epistemological considerations necessitate comprehensive analysis of socioeconomic implications. Furthermore, the paradigmatic shift toward automation requires meticulous examination of ethical frameworks governing algorithmic decision-making processes. Subsequently, organizational infrastructures must accommodate transformative methodologies while simultaneously addressing unprecedented complexities inherent within technological ecosystems."}
```

### 📤 Example Output
```json
{"text": "The quick brown fox...", "mtld": 68.0, "hdd": 0.9485294116}
{"text": "The cat sat on the mat...", "mtld": 6.0, "hdd": 0.404761905}
{"text": "In contemporary discourse...", "mtld": null, "hdd": null}
```

### 📊 Result Analysis

**Sample 1 (Normal Descriptive Text):**
- MTLD: 68.0 (high lexical diversity, rich vocabulary usage)
- HDD: 0.9485 (close to 1, indicating very diverse vocabulary)
- Text quality good, vocabulary varied

**Sample 2 (Highly Repetitive Text):**
- MTLD: 6.0 (low lexical diversity, high repetition)
- HDD: 0.4048 (low diversity, many repeated words)
- Heavy repetition leading to low text quality

**Sample 3 (Complex Academic Text):**
- MTLD: null (text too short for reliable MTLD calculation)
- HDD: null (insufficient sample size for reliable HDD calculation)
- Note: Lexical diversity metrics require sufficient text length; very short or very long texts may return null scores
