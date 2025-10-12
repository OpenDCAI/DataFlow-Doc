---
title: PerspectiveFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/perspectivefilter/
---

## 📘 Overview

`PerspectiveFilter` is a data filtering operator based on Perspective API for evaluating text toxicity and filtering data according to set score thresholds. Higher scores indicate higher text toxicity.

## __init__ Function

```python
def __init__(self, min_score: float = 0.0, max_score: float = 0.5):
```

### Init Parameters

| Parameter | Type | Default | Description |
| :-------------- | :---- | :------ | :------------------------------------------------------- |
| **min_score** | float | 0.0 | Minimum toxicity score threshold. Retains text with scores greater than or equal to this value. |
| **max_score** | float | 0.5 | Maximum toxicity score threshold. Retains text with scores less than or equal to this value. |

## run Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PerspectiveScore'):
```

#### Parameters

| Name | Type | Default | Description |
| :------------- | :---------------- | :------------------- | :------------------------------------ |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field for toxicity evaluation. |
| **output_key** | str | "PerspectiveScore" | Output column name corresponding to the generated toxicity score field. |

## 📦 API Key Configuration

Before using `PerspectiveFilter`, you need to configure the Google Perspective API Key. There are two methods:

### Method 1: Set Environment Variable

```bash
export GOOGLE_API_KEY="your-google-api-key"
```

Or set it in Python:
```python
import os
os.environ["GOOGLE_API_KEY"] = "your-google-api-key"
```

### Method 2: Configure via PerspectiveAPIServing

Pass the API Key directly when initializing `PerspectiveAPIServing`:
```python
from dataflow.serving import PerspectiveAPIServing

serving = PerspectiveAPIServing(api_key="your-google-api-key", max_workers=10)
```

### Obtaining API Key

To obtain a Google Perspective API Key, visit: [Google Perspective API](https://perspectiveapi.com/)

## 🧠 Example Usage

```python
from dataflow.operators.general_text import PerspectiveFilter
from dataflow.utils.storage import FileStorage

class PerspectiveFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/perspective_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = PerspectiveFilter(
            min_score=0.0,
            max_score=0.5
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='PerspectiveScore'
        )

if __name__ == "__main__":
    test = PerspectiveFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :----------------- | :---- | :--------------------- |
| [input_key] | str | Input text for evaluation. |
| [output_key] | float | Model-generated toxicity score value. |

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
```

### 📊 Result Analysis

**Sample 1 (Friendly text)**:
- Perspective toxicity score: 0.012
- Score range: [0.0, 0.5]
- **Passes filter** (0.012 within range)
- Characteristics: Gratitude and positive expression, nearly no toxicity

**Sample 2 (Neutral text)**:
- Perspective toxicity score: 0.089
- Score range: [0.0, 0.5]
- **Passes filter** (0.089 within range)
- Characteristics: Expresses disagreement but remains respectful, low toxicity

**Sample 3 (Offensive text)**:
- Perspective toxicity score: 0.952
- Score range: [0.0, 0.5]
- **Filtered out** (0.952 > 0.5)
- Characteristics: Contains insulting words and offensive language, high toxicity

**Score Interpretation**:
- **0.0 - 0.3**: Low or no toxicity (polite, friendly)
- **0.3 - 0.7**: Moderate toxicity (possibly controversial content)
- **0.7 - 1.0**: High toxicity (insults, attacks, hate speech)

**Use Cases**:
- Content moderation systems
- Social media comment filtering
- User-generated content quality control
- Building healthy online communities

**Notes**:
- Requires configured Google Perspective API Key (see [📦 API Key Configuration](#📦-api-key-configuration) section above)
- API calls have rate limits; recommend setting appropriate concurrency
- Supports multiple languages, but works best for English
- Samples with NaN values are automatically retained
