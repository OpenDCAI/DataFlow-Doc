---
title: PerspectiveSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/perspectivesampleevaluator/
---

## 📘 Overview

`PerspectiveSampleEvaluator` is an operator for detecting toxic content in text using Google's Perspective API. It evaluates text for toxicity, profanity, personal attacks, and other harmful content, returning a toxicity score between 0-1.

**Key Features**:
- Detects multiple types of toxic content (toxicity, severe toxicity, obscenity, threats, insults, identity attacks, etc.)
- Returns normalized toxicity probability scores (0-1)
- Supports multiple languages
- Powered by Google's state-of-the-art toxic content detection models

**Use Cases**: Content moderation, social media monitoring, comment filtering, UGC (User Generated Content) quality control

## __init__

```python
def __init__(self)
```

This operator requires no parameters during initialization but requires Google Perspective API Key configuration.

### API Key Configuration

To use this operator, you need to:
1. Obtain a Perspective API Key from [Google Perspective API](https://perspectiveapi.com/)
2. Configure the API Key via `PerspectiveAPIServing`

## run

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PerspectiveScore')
```

#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name specifying the column containing the text to be evaluated. |
| **output_key** | str | 'PerspectiveScore' | Output column name for storing the toxicity score. |

## 🧠 Example Usage
```python
from dataflow.operators.general_text import PerspectiveSampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.serving import PerspectiveAPIServing

class PerspectiveSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/perspective_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.api_serving = PerspectiveAPIServing(api_key="YOUR_API_KEY")
        
        self.evaluator = PerspectiveSampleEvaluator()
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='PerspectiveScore'
        )

if __name__ == "__main__":
    test = PerspectiveSampleEvaluatorTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | The original input text |
| PerspectiveScore | float | Toxicity score (0-1, higher indicates more toxic content) |

### 📋 Example Input
```json
{"text": "Thank you for your help! I really appreciate your kindness and support."}
{"text": "I disagree with your opinion, but I respect your perspective on this matter."}
{"text": "You are an idiot and your ideas are completely stupid and worthless."}
```

### 📤 Example Output
```json
{"text": "Thank you for your help! I really appreciate your kindness and support.", "PerspectiveScore": 0.012}
{"text": "I disagree with your opinion, but I respect your perspective on this matter.", "PerspectiveScore": 0.089}
{"text": "You are an idiot and your ideas are completely stupid and worthless.", "PerspectiveScore": 0.952}
```

### 📊 Result Analysis

**Sample 1 (Friendly Text):**
- PerspectiveScore: 0.012 (very low toxicity)
- Positive and appreciative language
- Safe for publication

**Sample 2 (Neutral Text):**
- PerspectiveScore: 0.089 (low toxicity)
- Respectful disagreement without offensive language
- Acceptable content

**Sample 3 (Offensive Text):**
- PerspectiveScore: 0.952 (very high toxicity)
- Contains personal attacks and derogatory language
- Should be filtered or flagged for moderation

**Score Interpretation**:
- 0.0-0.3: Low toxicity, generally safe content
- 0.3-0.7: Medium toxicity, may require review
- 0.7-1.0: High toxicity, should be filtered or flagged

**Application Value**: Particularly useful for automated content moderation systems, helping identify and filter toxic content before publication, protecting community health and user experience.
