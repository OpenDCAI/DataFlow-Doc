---
title: VendiDatasetEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/vendidatasetevaluator/
---

## 📘 Overview

`VendiDatasetEvaluator` is an operator for evaluating dataset diversity. It achieves this by calculating VendiScore, using pre-trained BERT and SimCSE models to generate text embeddings, and computing final diversity scores based on these embeddings.

**Key Features**:
- Uses BERT and SimCSE models to generate text embedding vectors
- Calculates Vendi diversity scores based on embedding vectors
- Returns dataset-level diversity evaluation results
- Supports GPU-accelerated computation

**Use Cases**: Evaluating overall dataset semantic diversity, not individual samples

## __init__

```python
def __init__(self, device='cuda')
```

### init Parameters

| Parameter | Type | Default | Description |
| :---------- | :--- | :------- | :----------- |
| **device** | str | `'cuda'` | Computing device. |

## run

```python
def run(self, storage: DataFlowStorage, input_key: str, use_simcse: bool = True)
```

#### Parameters

| Name | Type | Default | Description |
| :-------------- | :---------------- | :----- | :----------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to be evaluated. |
| **use_simcse** | bool | True | Whether to use SimCSE model for score calculation. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import VendiDatasetEvaluator
from dataflow.utils.storage import FileStorage

class VendiDatasetEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/vendi_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = VendiDatasetEvaluator(
            device='cuda'
        )
        
    def forward(self):
        result = self.evaluator.run(
            storage=self.storage.step(),
            input_key='text'
        )
        return result

if __name__ == "__main__":
    test = VendiDatasetEvaluatorTest()
    result = test.forward()
    print(f"Vendi Result: {result}")
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :------------------ | :---- | :--------------- |
| BERTVendiScore | float | Diversity score based on BERT. |
| SimCSEVendiScore | float | Diversity score based on SimCSE. |

#### 📋 Example Input

```json
{"text": "The stock market showed significant gains today as investors responded positively to the Federal Reserve's latest policy announcement."}
{"text": "Scientists discovered a new species of deep-sea fish in the Mariana Trench during a recent expedition."}
{"text": "The championship game ended in a thrilling overtime victory for the home team."}
{"text": "A new study reveals that regular exercise can significantly improve cognitive function in older adults."}
{"text": "The tech company announced plans to launch its innovative smartphone model next quarter."}
{"text": "Climate change activists organized a massive protest in the capital city demanding immediate action."}
{"text": "The award-winning chef opened a new restaurant featuring fusion cuisine from around the world."}
{"text": "Researchers developed a breakthrough treatment that shows promise for treating rare genetic disorders."}
{"text": "The museum unveiled a rare collection of ancient artifacts discovered in Egypt."}
{"text": "Economic analysts predict steady growth in the renewable energy sector over the next decade."}
```

#### 📤 Example Output

```json
{
  "BERTVendiScore": 1.25,
  "SimCSEVendiScore": 8.72
}
```

#### 📊 Result Analysis

**Input dataset contains 10 texts with different topics**: financial markets, marine biology, sports, medical research, technology products, climate change, cuisine, genetics, archaeology, energy economics, etc.

**Output Interpretation**:
- **BERTVendiScore: 1.25** - Diversity score calculated based on BERT embeddings. As a general language model, BERT has a relatively smooth embedding space, resulting in a lower score.
- **SimCSEVendiScore: 8.72** - Diversity score calculated based on SimCSE embeddings. SimCSE is specifically optimized for sentence semantic similarity and can better distinguish texts with different topics, resulting in a higher score that better reflects the actual diversity of the dataset.

**Score Interpretation**: VendiScore theoretically ranges from 1 to the number of samples (10 in this example). Scores closer to the number of samples indicate more diverse datasets; scores closer to 1 indicate more homogeneous datasets. A SimCSEVendiScore of 8.72 indicates that these 10 texts have very high semantic diversity, covering multiple different topic areas.

**Application Value**: This operator can be used to evaluate the semantic coverage and diversity of training datasets, helping determine whether the dataset contains sufficiently rich semantic information to train models with stronger generalization capabilities. Compared to Task2Vec, VendiScore focuses more on direct semantic embedding diversity assessment.
