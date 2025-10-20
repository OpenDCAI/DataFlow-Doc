---
title: SimHashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/simhashdeduplicatefilter/
---

## 📘 Overview

`SimHashDeduplicateFilter` is an approximate text deduplication operator based on the SimHash algorithm. It efficiently identifies similar content by converting text into fixed-length "fingerprints" and calculating the Hamming distance between fingerprints. This operator is faster than semantic deduplication, making it especially suitable for rapid preprocessing deduplication of character-level similar text when processing large-scale datasets.

## __init__ Function

```python
def __init__(self, fingerprint_size: int = 64, bound: float = 0.1)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **fingerprint_size** | int | 64 | Length (in bits) of the SimHash fingerprint. |
| **bound** | float | 0.1 | Similarity distance threshold. When the ratio of Hamming distance between two text fingerprints to fingerprint length is less than this threshold, they are considered duplicates. For example, the default value of 0.1 means text with similarity higher than 90% will be considered duplicates. |

## run Function

```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_keys** | list | None | List of multiple input column names containing text for deduplication. Choose one of `input_key` or `input_keys`. |
| **input_key** | str | None | Single input column name containing text for deduplication. Choose one of `input_key` or `input_keys`. |
| **output_key** | str | 'minhash_deduplicated_label' | Column name for output result labels, marking whether samples are duplicates. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import SimHashDeduplicateFilter
from dataflow.utils.storage import FileStorage

class SimHashDeduplicateFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/simhash_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = SimHashDeduplicateFilter(
            fingerprint_size=64,
            bound=0.1
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='minhash_deduplicated_label'
        )

if __name__ == "__main__":
    test = SimHashDeduplicateFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

The operator adds a new label column (specified by `output_key` parameter) to the DataFrame and filters out duplicate rows.

| Field | Type | Description |
| :--- | :--- | :--- |
| **minhash_deduplicated_label** | int | Deduplication label. Value of 1 indicates the sample is unique (retained), value of 0 indicates duplicate (removed in final output DataFrame). |

### 📋 Example Input

```json
{"text": "Hello world, this is a test message."}
{"text": "Hello world, this is a test message."}
{"text": "Completely different text goes here."}
```

### 📤 Example Output

```json
{"text": "Hello world, this is a test message.", "minhash_deduplicated_label": 1}
{"text": "Completely different text goes here.", "minhash_deduplicated_label": 1}
```

### 📊 Result Analysis

**Sample 1 (First message)**:
- Generate 64-bit SimHash fingerprint
- First occurrence, serves as baseline
- **Retained** (unique sample)

**Sample 2 (Duplicate message)**:
- Generates identical SimHash fingerprint
- Hamming distance = 0, similarity = 1.0
- Similarity 1.0 > (1 - 0.1) = 0.9
- **Filtered out** (duplicate)

**Sample 3 (Different text)**:
- Generates different SimHash fingerprint
- Large Hamming distance, similarity < 0.9
- **Retained** (unique sample)

**How It Works**:
1. Generate fixed-length SimHash fingerprint for each text
2. Calculate Hamming distance between fingerprints
3. Hamming distance / fingerprint length = difference degree
4. Similarity = 1 - difference degree
5. Similarity ≥ (1 - bound) considered duplicate

**Use Cases**:
- Rapid deduplication for large-scale text
- Approximate duplicate detection
- Web content deduplication
- Document similarity detection

**Notes**:
- Larger `fingerprint_size` means higher precision but slower computation
- `bound=0.1` means similarity > 90% considered duplicate
- Faster than MinHash but slightly lower precision
- Suitable for character-level similarity detection
- Sensitive to text order
