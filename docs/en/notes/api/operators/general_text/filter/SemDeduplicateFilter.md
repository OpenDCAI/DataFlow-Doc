---
title: SemDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/semdeduplicatefilter/
---

## 📘 Overview

`SemDeduplicateFilter` is a BERT semantic similarity-based deduplication operator for identifying and filtering duplicate data with similar content but different expressions. By calculating cosine similarity between text embedding vectors, this operator efficiently performs approximate deduplication, retaining unique samples in the dataset to improve data diversity. It supports deduplication on single or multiple field combinations.

## `__init__` Function

```python
class SemDeduplicateFilter(
    eps: float = 0.05, 
    model_name: str = 'sentence-transformers/all-MiniLM-L6-v2', 
    model_cache_dir: str = './dataflow_cache', 
    device: str = 'cuda'
)
```

### Init Parameters

| Parameter              | Type  | Default                                     | Description                                                       |
| :------------------ | :---- | :----------------------------------------- | :--------------------------------------------------------- |
| **eps**             | float | 0.05                                       | Similarity threshold; smaller values mean lower allowed similarity (i.e., cosine similarity > 1-eps considered duplicate). |
| **model_name**      | str   | 'sentence-transformers/all-MiniLM-L6-v2'   | Pre-trained model name for generating text embeddings.                         |
| **model_cache_dir** | str   | './dataflow_cache'                         | Model cache directory.                                             |
| **device**          | str   | 'cuda'                                     | Device for model execution (e.g., 'cuda' or 'cpu').                       |

## `run` Function

```python
def run(
    storage: DataFlowStorage, 
    input_keys: list = None, 
    input_key: str = None, 
    output_key: str = 'minhash_deduplicated_label'
)
```

#### Parameters

| Name         | Type            | Default                       | Description                                                         |
| :----------- | :-------------- | :--------------------------- | :----------------------------------------------------------- |
| **storage**  | DataFlowStorage | Required                         | DataFlow storage instance for reading and writing data.                         |
| **input_keys** | list          | None                         | List of multiple input field names containing text for deduplication; choose one of `input_key` or `input_keys`.    |
| **input_key**  | str           | None                         | Single input field name containing text for deduplication; choose one of `input_key` or `input_keys`.     |
| **output_key** | str           | 'minhash_deduplicated_label' | Output column name marking whether samples are duplicates (1 for non-duplicate, 0 for duplicate). Final output data only contains samples with value 1. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import SemDeduplicateFilter
from dataflow.utils.storage import FileStorage

class SemDeduplicateFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/sem_deduplicate_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = SemDeduplicateFilter(
            eps=0.05,
            model_name='sentence-transformers/all-MiniLM-L6-v2',
            model_cache_dir='./dataflow_cache',
            device='cuda'
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='minhash_deduplicated_label'
        )

if __name__ == "__main__":
    test = SemDeduplicateFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field                       | Type | Description                                                         |
| :------------------------- | :--- | :----------------------------------------------------------- |
| minhash_deduplicated_label | int  | Deduplication marker; 1 indicates the sample is unique and retained. In filtered output data, this field value is always 1. |

### 📋 Example Input

```json
{"text": "The weather is sunny today."}
{"text": "It is a bright and sunny day."}
{"text": "I need to buy some apples."}
```

### 📤 Example Output

```json
{"text": "The weather is sunny today.", "minhash_deduplicated_label": 1}
{"text": "It is a bright and sunny day.", "minhash_deduplicated_label": 1}
{"text": "I need to buy some apples.", "minhash_deduplicated_label": 1}
```

### 📊 Result Analysis

**Sample 1 ("The weather is sunny today.")**:
- Calculate BERT embedding vector
- First occurrence, serves as baseline
- **Retained** (unique sample)

**Sample 2 ("It is a bright and sunny day.")**:
- Semantically related to Sample 1 (both about sunny weather)
- Calculated cosine similarity < 0.95 (1 - eps)
- **Retained** (similarity below duplicate threshold)

**Sample 3 ("I need to buy some apples.")**:
- Semantically completely different from previous samples
- Very low cosine similarity
- **Retained** (unique sample)

**How It Works**:
1. Use BERT model to convert text into embedding vectors
2. Calculate cosine similarity between embedding vectors
3. Similarity > (1 - eps) considered semantic duplicate
4. Default eps=0.05, meaning similarity > 0.95 considered duplicate

**Use Cases**:
- Semantic deduplication (similar content but different expressions)
- Q&A dataset deduplication
- News article deduplication
- User feedback deduplication

**Notes**:
- Uses `sentence-transformers/all-MiniLM-L6-v2` model
- GPU acceleration recommended
- More accurate than character-level deduplication but higher computational cost
- Smaller `eps` means stricter deduplication
- First run requires model download
