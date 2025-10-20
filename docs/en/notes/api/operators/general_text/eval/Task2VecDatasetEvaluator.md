---
title: Task2VecDatasetEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/task2vecdatasetevaluator/
---

## 📘 Overview

`Task2VecDatasetEvaluator` is an operator for evaluating dataset diversity. It transforms dataset samples into embedding vectors using the Task2Vec method and quantifies overall dataset diversity by calculating the cosine distance matrix between these embedding vectors.

**Key Features**:
- Uses GPT-2 as the probe network to generate task embeddings
- Calculates dataset diversity through multiple sampling iterations
- Returns dataset-level single diversity score and confidence interval
- Supports both Monte Carlo and Variational embedding methods

**Use Cases**: Evaluating overall dataset diversity, not individual samples

## __init__

```python
def __init__(self, device='cuda', sample_nums=10, sample_size=1, method: Optional[str]='montecarlo', model_cache_dir='./dataflow_cache')
```

### init Parameters

| Parameter | Type | Default | Description |
| :------------------ | :--- | :----------------- | :----------------------------------------------------- |
| **device** | str | 'cuda' | Computing device. |
| **sample_nums** | int | 10 | Number of sampling iterations. |
| **sample_size** | int | 1 | Number of samples per iteration. |
| **method** | str | 'montecarlo' | Embedding calculation method, options: 'montecarlo' or 'variational'. |
| **model_cache_dir** | str | './dataflow_cache' | Cache directory for storing pre-trained models. |

## run

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name | Type | Default | Description |
| :---------- | :-------------- | :----- | :----------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to be evaluated. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import Task2VecDatasetEvaluator
from dataflow.utils.storage import FileStorage

class Task2VecDatasetEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/task2vec_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = Task2VecDatasetEvaluator(
            device='cuda',
            sample_nums=5,
            sample_size=1,
            method='montecarlo',
            model_cache_dir=None
        )
        
    def forward(self):
        result = self.evaluator.run(
            storage=self.storage.step(),
            input_key='text'
        )
        return result

if __name__ == "__main__":
    test = Task2VecDatasetEvaluatorTest()
    result = test.forward()
    print(f"Task2Vec Result: {result}")
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :----------------------- | :---- | :--------------- |
| Task2VecDiversityScore | float | Dataset diversity score. |
| ConfidenceInterval | float | Confidence interval of the diversity score. |

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
  "Task2VecDiversityScore": 0.226,
  "ConfidenceInterval": 0.208
}
```

#### 📊 Result Analysis

**Input dataset contains 10 texts with different topics**: financial markets, marine biology, sports, medical research, technology products, climate change, cuisine, genetics, archaeology, energy economics, etc.

**Output Interpretation**:
- **Task2VecDiversityScore: 0.226** - Dataset diversity score of approximately 0.226, calculated by performing 5 random samplings of the dataset and computing the cosine distance between task embedding vectors after fine-tuning GPT-2 model on different subsets. Higher scores indicate more diverse dataset topics.
- **ConfidenceInterval: 0.208** - Confidence interval of 0.208, representing the statistical reliability range of the diversity score, used to measure estimation stability.

**Application Value**: This operator can be used to evaluate the topic coverage of training datasets, helping determine whether the dataset has sufficient diversity to train models with strong generalization capabilities.
