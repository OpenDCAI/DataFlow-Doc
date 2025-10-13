---
title: FileOrURLToMarkdownConverter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/fileorurltomarkdownconverter/
---

## 📘 概述

[FileOrURLToMarkdownConverter](https://github.com/opendatalab/MinerU) 是一个知识提取算子，支持从多种文件格式（如 PDF、Office 文档、网页）和 URL 中提取结构化内容，并将其统一转换为标准的 Markdown 格式。该算子集成了 MinerU 解析引擎、网页内容提取工具等，能够智能处理文本、表格、公式，并保留原始布局，实现高效的文档数字化。

## __init__函数
```python
def __init__(self, 
             url: str = None,
             raw_file: str = None,
             intermediate_dir: str = "intermediate", 
             lang: str = "en", 
             mineru_backend: Literal["vlm-sglang-engine", "pipeline"] = "vlm-sglang-engine"
            )
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :------------------------------------------------ | :---------------------------- | :---------------------------------------------------------- |
| **url** | str | None | 输入内容的 URL 链接，支持 PDF 链接或普通网页链接。 |
| **raw_file** | str | None | 本地原始文件的路径。 |
| **intermediate_dir**| str | "intermediate" | 用于存储转换过程中生成的中间文件的目录。 |
| **lang** | str | "en" | 指定文档语言，用于优化解析效果。支持 'en' (英文) 或 'zh' (中文)。 |
| **mineru_backend** | Literal["vlm-sglang-engine", "pipeline"] | "vlm-sglang-engine" | 设置 MinerU 的后端引擎。'pipeline'为传统流程，'vlm-sglang-engine'为基于多模态大模型的新引擎。 |

### Prompt模板说明

## run函数
```python
def run(self, storage: DataFlowStorage, input_key="", output_key="")
```
执行算子主逻辑，根据 `__init__` 中提供的 `url` 或 `raw_file` 进行文件转换，并返回生成的 Markdown 文件路径。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :--------------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，用于确定部分文件的保存路径。 |
| **input_key** | str | "" | 输入列名，此算子中未使用。 |
| **output_key** | str | "" | 输出列名，此算子中未使用。 |

## 🧠 示例用法


#### 🧾 默认输出格式（Output Format）
该算子执行 `run` 函数后，不直接修改 `storage` 中的数据，而是返回一个字符串（`str`），该字符串为生成的 Markdown 文件的本地路径。
