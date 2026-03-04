---
title: Case 5. Converting Massive PDFs to Markdown
createTime: 2025/07/18 17:31:06
permalink: /en/guide/pdf-to-markdown/
icon: basil:lightning-alt-outline
---

---

# Converting Massive PDFs to Markdown

## Step 1: Install the DataFlow environment

From source:

```shell
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .
````

From PyPi:

```shell
pip install open-dataflow
```

## Step 2: Create a new DataFlow working folder

```shell
mkdir run_dataflow
cd run_dataflow
```

## Step 3: Initialize DataFlow

```shell
dataflow init
```

Enter the script directory:

```shell
cd api_pipelines
export HF_ENDPOINT=https://hf-mirror.com
export DF_API_KEY=xxx
export MINERU_API_KEY=YOUR_MINERU_API_KEY
```

---

## Step 4: Configure batch PDF list

Prepare a JSONL file:

```jsonl
{"source": "/path/to/paper1.pdf"}
{"source": "/path/to/paper2.pdf"}
{"source": "https://arxiv.org/pdf/2505.07773"}
```

---

## Step 5: Minimal Pipeline for PDF → Markdown

Create `batch_pdf_to_markdown.py`:

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

        # ------------ Option 1: MinerU Official API ------------
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

## Step 6: Run

```bash
python batch_pdf_to_markdown.py
```

---

## Output

Results are stored in:

```
.cache/pdf_to_md/
```

Each entry:

```json
{
  "source": "/path/to/paper1.pdf",
  "text_path": "./output/flash/paper1.md"
}
```

The generated Markdown files are stored in:

```
./output/flash/
```

---

This pipeline only performs:

* PDF / URL → Markdown conversion

It does **not** perform chunking, cleaning, or QA generation. To conduct more processing on your PDF data, please refer to [Case8](./knowledge_cleaning.md).

