---
title: FileOrURLToMarkdownConverterLocal
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/fileorurltomarkdownconverterlocal/
---

## 📘 概述

`FileOrURLToMarkdownConverterLocal` 是一个在本地使用MinerU模型进行知识提取的算子，它支持从多种文件格式（如PDF、Office文档、网页、纯文本）以及URL中提取结构化内容，并统一转换为标准的Markdown格式。算子能够自动识别文件类型并调用最优的解析引擎（如MinerU、trafilatura等）进行处理，保留原文的布局与核心信息。

## __init__函数

```python
    def __init__(self, 
                 intermediate_dir: str = "intermediate", 
                 mineru_backend: str = "vlm-auto-engine",
                 mineru_source: str = "local",
                 mineru_model_path:str = None,
                 mineru_download_model_type:str = "vlm"
                 ):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **intermediate_dir** | str | "intermediate" | 用于存储转换过程中生成的中间文件的目录路径。 |
| **mineru_backend** | str | "vlm-auto-engine" | 设置 MinerU 的后端引擎，用于处理PDF等复杂文档。可选值为 "pipeline" 或 "vlm-sglang-engine", 'vlm-auto-engine'。 |
| **mineru_source** | str | "local" | 设置 MinerU 的模型来源，对应 MINERU_MODEL_SOURCE。可选值为"modelscope"，"huggingface"，"local"。 |
| **mineru_model_path** | str | None | 本地模型目录，需要配合`mineru_source='local'`使用。 |
| **mineru_download_model_type** | str | "vlm" | 指定MinerU模型下载类型。 |

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
self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterLocal(
    intermediate_dir="../example_data/KBCleaningPipeline/raw/",
    mineru_backend="vlm-auto-engine",
    mineru_source="local",
    mineru_model_path="<path_to_local>/MinerU2.5-2509-1.2B",
    mineru_download_model_type="vlm"
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
