---
title: MathBookQuestionExtract
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/mathbookquestionextract/
---

## 📘 概述

`MathBookQuestionExtract` 是一个用于从数学教材 PDF 中提取问题和相关图片内容的算子。它将 PDF 转换为图片，使用 MinerU 进行内容提取，然后组织图片并使用多模态大语言模型（VLM）分析内容，最终生成包含问题和图片的 JSON 和 Markdown 文件。

## `__init__`函数

```python
def __init__(self, llm_serving: APIVLMServing_openai, prompt_template = None)
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | APIVLMServing_openai | 必需 | 视觉语言模型服务实例，用于执行内容分析与提取。 |
| **prompt_template** | PromptABC | `MathbookQuestionExtractPrompt()` | 提示词模板对象。若不提供，则使用默认的 `MathbookQuestionExtractPrompt`。 |

### Prompt 模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, pdf_file_path: str, output_file_name: str, output_folder: str, MinerU_Backend: str = "vlm-sglang-engine", dpi: int = 300, api_url: str = "http://123.129.219.111:3000/v1", key_name_of_api_key: str = "DF_API_KEY", model_name: str = "o4-mini", max_workers: int = 20)
```

执行算子主逻辑，处理输入的 PDF 文件，并生成提取结果。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **pdf_file_path** | str | 必需 | 待处理的数学教材 PDF 文件路径。 |
| **output_file_name** | str | 必需 | 输出文件的主名称（不含扩展名），将用于生成的 JSON 和 Markdown 文件。 |
| **output_folder** | str | 必需 | 用于存放所有输出结果（包括中间文件和最终文件）的文件夹路径。 |
| **MinerU_Backend** | str | `"vlm-sglang-engine"` | MinerU 工具使用的后端类型。 |
| **dpi** | int | `300` | PDF 页面转换为图片时的分辨率。 |
| **api_url** | str | `"http://..."` | VLM 服务的 API 地址。 |
| **key_name_of_api_key** | str | `"DF_API_KEY"` | 存储 API 密钥的环境变量的名称。 |
| **model_name** | str | `"o4-mini"` | 使用的 VLM 模型名称。 |
| **max_workers** | int | `20` | 最大并行工作线程数。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

该算子会在指定的 `output_folder` 中生成两个主要文件：一个 JSON 文件和一个 Markdown 文件。

| 文件类型 | 文件名 | 说明 |
| :--- | :--- | :--- |
| JSON | `{output_file_name}.json` | 包含提取的文本和相关图片路径的结构化数据。 |
| Markdown | `{output_file_name}.md` | 包含提取的文本和内嵌图片的可读 Markdown 文件。 |

**示例输出 JSON (`<output_file_name>.json`)**：
```json
[
    {
        "text": "1. 如图，在△ABC中，∠C=90°，∠A=30°.\n(1)作AB的垂直平分线DE，交AC于点D，交AB于点E；",
        "pics": [
            "/path/to/output_folder/images/0.jpg"
        ]
    },
    {
        "text": "(2)连接BD，求证：BD平分∠CBA.",
        "pics": []
    }
]
```

**示例输出 Markdown (`<output_file_name>.md`)**：
```markdown
1. 如图，在△ABC中，∠C=90°，∠A=30°.
(1)作AB的垂直平分线DE，交AC于点D，交AB于点E；

![](images/0.jpg)

---
(2)连接BD，求证：BD平分∠CBA.
---
```
