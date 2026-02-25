---
title: FileOrURLToMarkdownConverterFlash
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/fileorurltomarkdownconverterflash/
---

## 📘 概述

`FileOrURLToMarkdownConverterFlash` 是一个在本地使用Flash-MinerU进行知识提取的算子，它支持从多种文件格式（如PDF、Office文档、网页、纯文本）以及URL中提取结构化内容，并统一转换为标准的Markdown格式。算子能够自动识别文件类型并调用最优的解析引擎（如MinerU、trafilatura等）进行处理，保留原文的布局与核心信息。

## __init__函数

```python
def __init__(
    self, 
    intermediate_dir: str = "intermediate", 
    mineru_model_path=None, 
    batch_size:int = 4, 
    replicas:int = 1, 
    num_gpus_per_replica:float = 1, 
    engine_gpu_util_rate_to_ray_cap:float = 0.9
):

```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **intermediate_dir** | str | "intermediate" | 用于存储转换过程中生成的中间文件的目录路径。 |
| **mineru_model_path** | str | None | FlashMinerU 使用的模型路径（必填；如 MinerU2.5-xxx 权重目录）。 |
| **batch_size** | int | 4 | 批处理大小。 |
| **replicas** | int | 1 | 多进程推理的进程数。 |
| **num_gpus_per_replica** | float | 1 | 每个副本占用的 GPU 数。 |
| **engine_gpu_util_rate_to_ray_cap** | float | 0.9 | Ray 资源利用率上限系数（flash-mineru本质上是利用ray实现多进程推理），例如设置成0.9表示ray会预留10%的资源，由于需要在保证计算效率的条件下留出一些资源给ray的管理进程同时防止OOM，通常设置在0.8~1.0之间。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
|-- |-- |-- |-- |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str = "source", output_key: str = "text_path"):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "source" | 输入列名，该列应包含待处理的本地文件路径或URL。 |
| **output_key** | str | "text_path" | 输出列名，该列将用于存储生成的Markdown文件的路径。 |

## 🧠 示例用法

```python
self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterFlash(
    intermediate_dir = "intermediate",
    mineru_model_path="<path_to_local>/MinerU2.5-2509-1.2B",
    batch_size = 4,
    replicas = 2,
    num_gpus_per_replica = 1,
    engine_gpu_util_rate_to_ray_cap = 0.9
)
self.knowledge_cleaning_step1.run(
    storage=self.storage.step(),
    # input_key=,
    # output_key=,
)
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| source | str | 输入的源文件路径或URL。 |
| text_path | str | 生成的Markdown文件的存储路径。 |

示例输入：

```json
{
"source":"/path/to/your/document.pdf"
}
```

示例输出：

```json
{
"source":"/path/to/your/document.pdf",
"text_path":"intermediate/document_pdf.md"
}
```
