---
title: MMDDatasetEvaluator
createTime: 2025/04/04 19:46
permalink: /en/api/operators/text_sft/eval/mmddatasetevaluator/
---

## 📘 Overview

The `MMDDatasetEvaluator` is an operator that evaluates the distribution discrepancy between two datasets using the Maximum Mean Discrepancy (MMD) method. It embeds text into a high-dimensional space and computes the kernel-based distance to quantify the distribution shift between the evaluation dataset and a reference dataset. A smaller MMD score indicates that the two distributions are closer.

## `__init__`

```python
def __init__(
    self,
    ref_frame: DataFlowStorage,
    *,
    ref_max_sample_num: int = 5000,
    ref_shuffle_seed: int = 42,
    ref_instruction_key: str = "input",
    ref_output_key: str = "output",
    kernel_type: Literal["RBF"] = "RBF",
    bias: bool = True,
    rbf_sigma: float = 1.0,
    embedding_type: Literal["vllm", "sentence_transformers"] = "sentence_transformers",
    embedding_model_name: str | None = None,
    st_device: str = "cuda",
    st_batch_size: int = 32,
    st_normalize_embeddings: bool = True,
    vllm_max_num_seqs: int = 128,
    vllm_gpu_memory_utilization: float = 0.9,
    vllm_tensor_parallel_size: int = 1,
    vllm_pipeline_parallel_size: int = 1,
    vllm_truncate_max_length: int = 40960,
    cache_type: Literal["redis", "none"] = "none",
    redis_url: str = "redis://127.0.0.1:6379",
    max_concurrent_requests: int = 50,
    redis_db: int = 0,
    cache_model_id: str | None = None,
)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **ref_frame** | DataFlowStorage | Required | The reference dataset used as the distribution baseline. |
| **ref_max_sample_num** | int | `5000` | Maximum number of samples to draw from the reference dataset. |
| **ref_shuffle_seed** | int | `42` | Random seed for sampling the reference dataset. |
| **ref_instruction_key** | str | `'input'` | Column name for the instruction field in the reference dataset. |
| **ref_output_key** | str | `'output'` | Column name for the output field in the reference dataset. |
| **kernel_type** | str | `'RBF'` | Kernel function type; currently only `'RBF'` is supported. |
| **bias** | bool | `True` | Whether to use bias in the MMD computation. |
| **rbf_sigma** | float | `1.0` | Bandwidth parameter for the RBF kernel. |
| **embedding_type** | str | `'sentence_transformers'` | Embedding backend to use; either `'sentence_transformers'` or `'vllm'`. **Note:** when using `'vllm'`, you need to install `distflow[vllm]` first. |
| **embedding_model_name** | str | Required | Name of the embedding model (required). |
| **st_device** | str | `'cuda'` | Device for SentenceTransformers (e.g., `'cuda'`, `'cpu'`). |
| **st_batch_size** | int | `32` | Batch size for SentenceTransformers inference. |
| **st_normalize_embeddings** | bool | `True` | Whether to normalize embeddings from SentenceTransformers. |
| **vllm_max_num_seqs** | int | `128` | Maximum number of sequences for vLLM. |
| **vllm_gpu_memory_utilization** | float | `0.9` | GPU memory utilization ratio for vLLM. |
| **vllm_tensor_parallel_size** | int | `1` | Tensor parallel size for vLLM. |
| **vllm_pipeline_parallel_size** | int | `1` | Pipeline parallel size for vLLM. |
| **vllm_truncate_max_length** | int | `40960` | Maximum truncation length for vLLM inputs. |
| **cache_type** | str | `'none'` | Cache type for embeddings; either `'redis'` or `'none'`. |
| **redis_url** | str | `'redis://127.0.0.1:6379'` | Redis connection URL when `cache_type='redis'`. |
| **max_concurrent_requests** | int | `50` | Maximum concurrent requests to Redis. |
| **redis_db** | int | `0` | Redis database index. |
| **cache_model_id** | str | `None` | Model identifier used for the Redis cache key. |

## `run`

```python
def run(
    self,
    storage: DataFlowStorage,
    input_instruction_key: str,
    input_output_key: str,
    max_sample_num: int | None = None,
    shuffle_seed: int | None = None,
) -> tuple[float, dict[str, Any]]
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance containing the evaluation dataset. |
| **input_instruction_key** | str | Required | Column name for the instruction field in the evaluation dataset. |
| **input_output_key** | str | Required | Column name for the output field in the evaluation dataset. |
| **max_sample_num** | int | `None` | Maximum samples from the evaluation dataset; falls back to `ref_max_sample_num` if not set. |
| **shuffle_seed** | int | `None` | Random seed for sampling the evaluation dataset; falls back to `ref_shuffle_seed` if not set. |

## 🧠 Example Usage

```python
from dataflow.operators.text_sft.eval import MMDDatasetEvaluator
from dataflow.utils.storage import FileStorage

# Prepare reference and evaluation storages
ref_storage = FileStorage(first_entry_file_name="reference_data.jsonl")
eval_storage = FileStorage(first_entry_file_name="eval_data.jsonl")

# Initialize the evaluator
evaluator = MMDDatasetEvaluator(
    ref_frame=ref_storage.step(),
    ref_instruction_key="instruction",
    ref_output_key="output",
    embedding_type="sentence_transformers",
    embedding_model_name="BAAI/bge-large-zh",
    st_device="cuda",
    st_batch_size=32,
)

# Run evaluation
mmd_score, mmd_meta = evaluator.run(
    eval_storage.step(),
    input_instruction_key="instruction",
    input_output_key="output",
)
print(f"MMD Score: {mmd_score}, Meta: {mmd_meta}")
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| **MMDScore** | float | The computed MMD distance (smaller is closer). |
| **MMDMeta** | dict | Metadata dictionary containing computation details. |

**Example Output:**
```json
{
  "MMDScore": 0.00342,
  "MMDMeta": {
    "num_src_samples": 5000,
    "num_tgt_samples": 5000
  }
}
```
