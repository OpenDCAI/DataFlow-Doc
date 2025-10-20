---
title: MinHashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/minhashdeduplicatefilter/
---

## 📘 Overview

`MinHashDeduplicateFilter` is an operator that combines MinHash with LSH (Locality-Sensitive Hashing) to achieve efficient approximate deduplication. It converts text into MinHash signatures, then uses LSH to quickly find similar text clusters, thereby enabling efficient approximate deduplication for large-scale datasets.

## `__init__` Function

```python
def __init__(self, num_perm=128, threshold=0.9, use_n_gram=True, ngram=5)
```

### Init Parameters

| Parameter | Type | Default | Description |
| :------------- | :---- | :--------- | :----------------------------- |
| **num_perm** | int | 128 | Number of hash functions (permutations) used to generate MinHash signatures. |
| **threshold** | float | 0.9 | Jaccard similarity threshold; text exceeding this threshold will be considered duplicates. |
| **use_n_gram** | bool | True | Whether to use n-gram tokenization for generating sets. |
| **ngram** | int | 5 | The n value for n-gram when `use_n_gram` is True. |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```

#### Parameters

| Name | Type | Default | Description |
| :------------- | :---------------- | :----------------------------- | :----------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_keys** | list | None | List of multiple input column names for deduplication checking. The operator will merge content from these columns before computing hash values. |
| **input_key** | str | None | Single input column name for deduplication checking. Either `input_key` or `input_keys` must be provided. |
| **output_key** | str | "minhash_deduplicated_label" | Output column name for marking whether data is unique (`1` for unique, retained). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import MinHashDeduplicateFilter
from dataflow.utils.storage import FileStorage

class MinHashDeduplicateFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/minhash_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = MinHashDeduplicateFilter(
            num_perm=128,
            threshold=0.9,
            use_n_gram=True,
            ngram=5
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='minhash_deduplicated_label'
        )

if __name__ == "__main__":
    test = MinHashDeduplicateFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

The operator adds a marker column (default `minhash_deduplicated_label`) to the original data and filters out identified duplicate data rows.

| Field | Type | Description |
| :--------------------------- | :---- | :---------------------------------- |
| minhash_deduplicated_label | int | Deduplication marker; rows with value `1` are unique and retained. |

### 📋 Example Input

```json
{"id": 1, "text": "这是一个用于测试的示例文本。今天天气很好，阳光明媚。"}
{"id": 2, "text": "这是一个用于测试的示例文本。今天天气很好，阳光明媚。"}
{"id": 3, "text": "这是完全不同的另一段文本。内容和前面完全无关。"}
{"id": 4, "text": "这是一个用于测试的示例文本。今天的天气很好，阳光很明媚。"}
```

### 📤 Example Output

```json
{"id": 1, "text": "这是一个用于测试的示例文本。今天天气很好，阳光明媚。", "minhash_deduplicated_label": 1}
{"id": 3, "text": "这是完全不同的另一段文本。内容和前面完全无关。", "minhash_deduplicated_label": 1}
{"id": 4, "text": "这是一个用于测试的示例文本。今天的天气很好，阳光很明媚。", "minhash_deduplicated_label": 1}
```

### 📊 Result Analysis

**Sample 1 (id=1)**:
- Text: 这是一个用于测试的示例文本。今天天气很好，阳光明媚。
- **Retained** (first sample, serves as baseline)

**Sample 2 (id=2)**:
- Text: 这是一个用于测试的示例文本。今天天气很好，阳光明媚。
- Identical to Sample 1
- Jaccard similarity: 1.0 > 0.9
- **Filtered out** (duplicate of Sample 1)

**Sample 3 (id=3)**:
- Text: 这是完全不同的另一段文本。内容和前面完全无关。
- Completely different from previous samples
- Jaccard similarity < 0.9
- **Retained** (unique text)

**Sample 4 (id=4)**:
- Text: 这是一个用于测试的示例文本。今天的天气很好，阳光很明媚。
- Highly similar to Sample 1, but with slight differences ("的", "很" characters)
- After 5-gram analysis, similarity < 0.9
- **Retained** (similarity below threshold)

**How It Works**:
1. Use MinHash algorithm to generate signatures (128 hash values) for each text
2. Use LSH (Locality-Sensitive Hashing) to quickly find similar text clusters
3. Segment text using 5-gram to calculate Jaccard similarity
4. Samples with similarity exceeding threshold (0.9) are identified as duplicates

**Use Cases**:
- Large-scale dataset deduplication
- Web content deduplication
- News article deduplication
- User-generated content deduplication

**Notes**:
- Larger `num_perm` means higher precision but greater computational overhead
- `threshold` closer to 1 means stricter deduplication
- `use_n_gram=True` uses character-level n-gram, suitable for Chinese
- `use_n_gram=False` uses space tokenization, suitable for English
- LSH provides approximate matching, fast but may miss some duplicates
