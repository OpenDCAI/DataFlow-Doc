---
title: MMDDatasetEvaluator
createTime: 2025/04/04 19:46
permalink: /zh/api/operators/text_sft/eval/mmddatasetevaluator/
---

## 📘 概述

[MMDDatasetEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_sft/eval/mmd_dataset_evaluator.py) 是一个基于最大均值差异（Maximum Mean Discrepancy, MMD）的数据集评估算子。它通过将文本嵌入到高维空间，并计算核函数距离，来量化评估数据集与参考数据集之间的分布偏移程度。MMD 值越小，表示两个数据集的分布越接近。

## `__init__`

```python
def __init__(
    self,
    ref_frame: DataFlowStorage,
    *,
    max_sample_num: int = 5000,
    shuffle_seed: int = 42,
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

### init 参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **ref_frame** | DataFlowStorage | 必需 | 参考数据集（DataFlowStorage），作为分布比较的基准。 |
| **max_sample_num** | int | `5000` | 从参考数据集和评估数据集中采样的最大样本数。 |
| **shuffle_seed** | int | `42` | 数据集采样的随机种子。 |
| **ref_instruction_key** | str | `'input'` | 参考数据集中指令字段的列名。 |
| **ref_output_key** | str | `'output'` | 参考数据集中输出字段的列名。 |
| **kernel_type** | str | `'RBF'` | 核函数类型，当前仅支持 `'RBF'`。 |
| **bias** | bool | `True` | 是否在 MMD 计算中使用偏置项。 |
| **rbf_sigma** | float | `1.0` | RBF 核函数的带宽参数。 |
| **embedding_type** | str | `'sentence_transformers'` | 嵌入模型后端，可选 `'sentence_transformers'` 或 `'vllm'`。**注意：** 使用 `'vllm'` 时需先安装 `distflow[vllm]`。 |
| **embedding_model_name** | str | 必需 | 嵌入模型名称（必填）。 |
| **st_device** | str | `'cuda'` | SentenceTransformers 的运行设备（如 `'cuda'`、`'cpu'`）。 |
| **st_batch_size** | int | `32` | SentenceTransformers 的推理批次大小。 |
| **st_normalize_embeddings** | bool | `True` | 是否对 SentenceTransformers 生成的嵌入向量进行归一化。 |
| **vllm_max_num_seqs** | int | `128` | vLLM 的最大序列数。 |
| **vllm_gpu_memory_utilization** | float | `0.9` | vLLM 的 GPU 显存利用率。 |
| **vllm_tensor_parallel_size** | int | `1` | vLLM 的张量并行大小。 |
| **vllm_pipeline_parallel_size** | int | `1` | vLLM 的流水线并行大小。 |
| **vllm_truncate_max_length** | int | `40960` | vLLM 输入的最大截断长度。 |
| **cache_type** | str | `'none'` | 嵌入缓存类型，可选 `'redis'` 或 `'none'`。 |
| **redis_url** | str | `'redis://127.0.0.1:6379'` | 使用 Redis 缓存时的连接地址。 |
| **max_concurrent_requests** | int | `50` | 对 Redis 缓存的最大并发请求数。 |
| **redis_db** | int | `0` | Redis 数据库索引。 |
| **cache_model_id** | str | `None` | Redis 缓存键中使用的模型标识符。 |

## `run`

```python
def run(
    self,
    storage: DataFlowStorage,
    input_instruction_key: str,
    input_output_key: str,
) -> tuple[float, dict[str, Any]]
```

执行算子主逻辑，从评估数据集中读取样本，计算其与参考数据集之间的 MMD 距离，并返回距离值和元数据。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 包含评估数据集的数据流存储实例。 |
| **input_instruction_key** | str | 必需 | 评估数据集中指令字段的列名。 |
| **input_output_key** | str | 必需 | 评估数据集中输出字段的列名。 |

## 🧠 示例用法

```python
from dataflow.operators.text_sft.eval import MMDDatasetEvaluator
from dataflow.utils.storage import FileStorage

# 准备参考数据集和评估数据集
ref_storage = FileStorage(first_entry_file_name="reference_data.jsonl")
eval_storage = FileStorage(first_entry_file_name="eval_data.jsonl")

# 初始化评估器
evaluator = MMDDatasetEvaluator(
    ref_frame=ref_storage.step(),
    max_sample_num=5000,
    shuffle_seed=42,
    ref_instruction_key="instruction",
    ref_output_key="output",
    embedding_type="sentence_transformers",
    embedding_model_name="BAAI/bge-large-zh",
    st_device="cuda",
    st_batch_size=32,
)

# 执行评估
mmd_score, mmd_meta = evaluator.run(
    eval_storage.step(),
    input_instruction_key="instruction",
    input_output_key="output",
)
print(f"MMD Score: {mmd_score}, Meta: {mmd_meta}")
```

#### 🧾 默认输出格式

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| **MMDScore** | float | 计算得到的 MMD 距离值（越小表示分布越接近）。 |
| **MMDMeta** | dict | 包含计算细节信息的元数据字典。 |

**示例输出：**
```json
{
  "MMDScore": 0.00342,
  "MMDMeta": {
    "num_src_samples": 5000,
    "num_tgt_samples": 5000
  }
}
```
