---
title: FileOrURLToMarkdownConverterAPI
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/fileorurltomarkdownconverterapi/
---

## 📘 概述

`FileOrURLToMarkdownConverterAPI` 是一个知识提取算子，它支持从多种文件格式（如PDF、Office文档、网页、纯文本）以及URL中提取结构化内容，并统一转换为标准的Markdown格式。算子能够自动识别文件类型并调用最优的解析引擎（如MinerU、trafilatura等）进行处理，保留原文的布局与核心信息。

## __init__函数

```python
def __init__(self, intermediate_dir: str = "intermediate", mineru_backend: str = "vlm", api_key:str = None):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **intermediate_dir** | str | "intermediate" | 用于存储转换过程中生成的中间文件的目录路径。 |
| **api_key** | str | None | 指定API密钥，用于访问MinerU外部服务。 |
| **mineru_backend** | str | "vlm" | 设置 MinerU 的后端引擎，用于处理PDF等复杂文档。可选值为 "pipeline" 或 "vlm", 'MinerU-HTML'。 |

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
self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterAPI(
    intermediate_dir="../example_data/KBCleaningPipeline/raw/",
    api_key="your-api-key-here",
    mineru_backend="vlm",
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
