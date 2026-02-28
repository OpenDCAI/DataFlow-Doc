---
title: 案例 5：将大规模 PDF 转换为 Markdown
createTime: 2025/07/18 17:31:06
permalink: /zh/guide/pdf-to-markdown/
icon: basil:lightning-alt-outline
---

---

# 将大规模 PDF 转换为 Markdown

## 第一步：安装 DataFlow 环境

从源码安装：

```shell
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .
````

从 PyPi 安装：

```shell
pip install open-dataflow
```

## 第二步：创建新的 DataFlow 工作目录

```shell
mkdir run_dataflow
cd run_dataflow
```

## 第三步：初始化 DataFlow

```shell
dataflow init
```

进入脚本目录：

```shell
cd api_pipelines
export HF_ENDPOINT=https://hf-mirror.com
export DF_API_KEY=xxx
export MINERU_API_KEY=YOUR_MINERU_API_KEY
```

---

## 第四步：配置批量 PDF 列表

准备一个 JSONL 文件：

```jsonl
{"source": "/path/to/paper1.pdf"}
{"source": "/path/to/paper2.pdf"}
{"source": "https://arxiv.org/pdf/2505.07773"}
```

---

## 第五步：最简 PDF → Markdown 流水线

创建 `batch_pdf_to_markdown.py`：

```python
from dataflow.operators.knowledge_cleaning import (
    FileOrURLToMarkdownConverterAPI,
    FileOrURLToMarkdownConverterFlash,
    FileOrURLToMarkdownConverterLocal,
)
from dataflow.utils.storage import FileStorage


class BatchPDFToMarkdownPipeline():
    def __init__(self):

        self.storage = FileStorage(
            first_entry_file_name="/path/to/all_pdf.jsonl",
            cache_path="./.cache/pdf_to_md",
            file_name_prefix="pdf_to_md_step",
            cache_type="json",
        )

        # ------------ 选项 1：MinerU 官方 API ------------
        self.converter = FileOrURLToMarkdownConverterAPI(
            intermediate_dir="./output/api/",
            mineru_backend="vlm",
        )

    def forward(self):

        self.converter.run(
            storage=self.storage.step(),
            input_key="source",
            output_key="text_path"
        )


if __name__ == "__main__":
    model = BatchPDFToMarkdownPipeline()
    model.forward()
```

---

## 第六步：运行

```bash
python batch_pdf_to_markdown.py
```

---

## 输出

结果保存在：

```
.cache/pdf_to_md/
```

每条记录格式如下：

```json
{
  "source": "/path/to/paper1.pdf",
  "text_path": "./output/flash/paper1.md"
}
```

生成的 Markdown 文件保存在：

```
./output/flash/
```

---

该流水线仅执行：

* PDF / URL → Markdown 转换

**不会**进行分块（chunking）、清洗或问答生成。如需对 PDF 数据进行更多处理，请参考 [Case8](./knowledge_cleaning.md)。

