---
title: Case 6. PDF VQA Extraction Pipeline
createTime: 2025/11/17 14:01:55
permalink: /en/guide/vqa_extract_optimized/
icon: heroicons:document-text
---

# PDF VQA Extraction Pipeline

## 1. Overview

The **PDF VQA Extraction Pipeline** automatically extracts high-quality Q&A pairs from textbook-style PDFs. It supports both separated question/answer PDFs and interleaved PDFs, and chains together layout parsing (MinerU), subject-aware LLM extraction, and structured post-processing. Typical use cases:

- Building math/physics/chemistry QA corpora from scanned books
- Creating QA pairs' markdown/JSONL exports that preserve figure references

Major stages:

1. **Document layout extraction**: call MinerU to dump structured JSON + rendered page images.
2. **LLM-based QA extraction**: prompt the `VQAExtractor` operator with subject-specific rules.
3. **Merging & filtering**: consolidate question/answer streams, filter invalid entries, emit JSONL/Markdown plus copied images.

## 2. Quick Start

### Step 1: Install Dataflow
Install Dataflow:
```shell
pip install "open-dataflow[pdf2vqa]"
```

Or install Dataflow from source:
```shell
git clone https://github.com/OpenDCAI/DataFlow.git
cd Dataflow
pip install -e ".[pdf2vqa]"
```

### Step 2: Create a workspace
```shell
cd /your/working/directory
mkdir run_dataflow
cd run_dataflow
```

### Step 3: Initialize Dataflow
```shell
dataflow init
```
You can then add your pipeline script under `pipelines/` or any custom path.

### Step 4: Configure API credentials
`DF_API_KEY` is for calling LLM API, and `MINERU_API_KEY` is for calling MinerU for layout analysis.
`MINERU_API_KEY` can be obtained from https://mineru.net/apiManage/token, and `DF_API_KEY` can be obtained from your LLM provider (e.g., OpenAI, Google Gemini, etc.). Set them as environment variables:

Linux / macOS:
```shell
export DF_API_KEY="sk-xxxxx"
export MINERU_API_KEY="sk2-xxxxx"
```
Windows PowerShell:
```powershell
$env:DF_API_KEY = "sk-xxxxx"
$env:MINERU_API_KEY = "sk2-xxxxx"
```
In the pipeline script, set your API endpoint:
```python
self.llm_serving = APILLMServing_request(
    api_url="https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    key_name_of_api_key="DF_API_KEY",
    model_name="gemini-2.5-pro",
    max_workers=100,
)
```
and set LLM max token length (recommended not to exceed 128000 to avoid LLM forgetting details).

```python
self.vqa_extractor = ChunkedPromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt = self.vqa_extract_prompt.build_prompt(),
    max_chunk_len=128000,
)
```

### Step 5: One-click run
```bash
python api_pipelines/pdf_vqa_extract_pipeline.py
```
You can also import the operators into other workflows; the remainder of this doc explains the data flow in detail.

## 3. Data Flow and Pipeline Logic

### 1. Input data

Each job is defined by a JSONL row. `input_pdf_paths` can be a single PDF or a list of PDFs (questions appear before answers). `name` is an identifier for the job. Questions and answers can be interleaved or separated; they can come from the same PDF or different PDFs.

```jsonl
{"input_pdf_paths": "./example_data/PDF2VQAPipeline/questionextract_test.pdf", "name": "math1"}
{"input_pdf_paths": ["./example_data/PDF2VQAPipeline/math_question.pdf", "./example_data/PDF2VQAPipeline/math_answer.pdf"], "name": "math2"}
```

`FileStorage` handles batching/cache management:
```python
self.storage = FileStorage(
            first_entry_file_name="../example_data/PDF2VQAPipeline/vqa_extract_test.jsonl",
            cache_path="./cache",
            file_name_prefix="vqa",
            cache_type="jsonl",
        )
```

### 2. Document layout extraction (MinerU)

For each PDF (question, answer, or mixed), the pipeline calls `_parse_file_with_mineru` inside `FileOrURLToMarkdownConverterAPI`. MinerU outputs:

- `*_content_list.json`: structured layout tokens (texts, figures, tables, IDs)
- `images/`: cropped page images

---
**Note**：
If you want to use a locally deployed MinerU model, you can replace the operator with `FileOrURLToMarkdownConverterLocal` (original version from opendatalab) or `FileOrURLToMarkdownConverterFlash` (our accelerated version), and provide the corresponding model path and deployment parameters. 

For example:

```python
self.mineru_executor = FileOrURLToMarkdownConverterAPI(intermediate_dir = "intermediate")
```

can be replaced with

```python
self.mineru_executor = FileOrURLToMarkdownConverterLocal(
    intermediate_dir = "intermediate",
    mineru_model_path = "path/to/mineru/model",
)
```

or

```python
self.mineru_executor = FileOrURLToMarkdownConverterFlash(
    intermediate_dir = "intermediate",
    mineru_model_path = "path/to/mineru/model",
    batch_size = 4,
    replicas = 1,
    num_gpus_per_replica = 1,
    engine_gpu_util_rate_to_ray_cap = 0.9
)
```

You can refer to https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/knowledge_cleaning/generate/mineru_operators.py for specific parameters and usage.

---

Afterwards, the `MinerU2LLMInputOperator` flattens list items and re-indexes them to create LLM-friendly input.

### 3. QA extraction (VQAExtractor)

`ChunkedPromptedGenerator` chunks the layout JSON to respect token limits, builds prompts (`QAExtractPrompt`), and batches LLM calls via `APILLMServing_request`. Key behaviors:

- Grouping and pairing Q&A based, and inserting images to proper positions.
- Supports QA separated or interleaved PDFs.
- Copies rendered images into `cache_path/name/vqa_images`.
- Parses `<qa_pair>`, `<question>`, `<answer>`, `<solution>`, `<chapter>`, `<label>` tags from the LLM response.

### 4. Post-processing and outputs

The `QA_Merger` operator is called for question-answer pair matching. Its behavior is as follows:

- For mixed layouts (where questions and answers are already interleaved): It writes the complete QA pairs as they are, effectively performing no additional processing.

- For separated layouts (where questions and answers are in different sections): It performs heuristic matching based on chapter titles and question sequence numbers.

This operator includes a `strict_title_match` parameter:

- True: The operator performs an exact string match on chapter titles.

- False: The operator attempts to extract Chinese or English sequence numbers from the titles for matching.

For each `output_dir` (under cache_path/name/), the pipeline writes:

1. `extracted_vqa.jsonl` (extracted questions and answers, could be separate or interleaved depending on input)
2. `merged_qa_pairs.jsonl` (fully merged question-answer pairs)
3. `merged_qa_pairs.md` (markdown version of the merged QA pairs)
4. `vqa_images/` (containing all images extracted for the QA pairs)

Furthermore, the final step of the cache main file will contain all extracted qa pairs, making it easier to connect subsequent operators for downstream post-processing.

Each `qa_item` includes:

- `question`: question text and images
- `answer`: answer text and images
- `solution`: optional worked solution (if present)
- `label`: original qa numbering
- `chapter_title`: chapter/section header detected on the same page

Example:
```json
{
  "question": "Solve for x in x^2 - 1 = 0.",
  "answer": "x = 1 or x = -1",
  "solution": "Factor as (x-1)(x+1)=0.",
  "label": 1,
  "chapter_title": "Chapter 1 Quadratic Equations"
}
```

## 5. Pipeline Example

```python
from dataflow.operators.knowledge_cleaning import FileOrURLToMarkdownConverterAPI

from dataflow.serving import APILLMServing_request
from dataflow.utils.storage import FileStorage
from dataflow.operators.pdf2vqa import MinerU2LLMInputOperator, LLMOutputParser, QA_Merger, PDF_Merger
from dataflow.operators.core_text import ChunkedPromptedGenerator

from dataflow.pipeline import PipelineABC
from dataflow.prompts.pdf2vqa import QAExtractPrompt

from pypdf import PdfWriter
    
class PDF_VQA_extract_optimized_pipeline(PipelineABC):
    def __init__(self):
        super().__init__()
        self.storage = FileStorage(
            first_entry_file_name="./example_data/PDF2VQAPipeline/vqa_extract_test.jsonl",
            cache_path="./cache",
            file_name_prefix="vqa",
            cache_type="jsonl",
        )
        
        self.llm_serving = APILLMServing_request(
            api_url="http://123.129.219.111:3000/v1/chat/completions",
            key_name_of_api_key="DF_API_KEY",
            model_name="gemini-2.5-pro",
            max_workers=100,
        )
        
        self.vqa_extract_prompt = QAExtractPrompt()
        
        self.pdf_merger = PDF_Merger(output_dir="./cache")
        self.mineru_executor = FileOrURLToMarkdownConverterAPI(intermediate_dir = "intermediate")
        self.input_formatter = MinerU2LLMInputOperator()
        self.vqa_extractor = ChunkedPromptedGenerator(
            llm_serving=self.llm_serving,
            system_prompt = self.vqa_extract_prompt.build_prompt(),
            max_chunk_len=128000,
        )
        self.llm_output_parser = LLMOutputParser(output_dir="./cache", intermediate_dir="intermediate")
        self.qa_merger = QA_Merger(output_dir="./cache", strict_title_match=False)
    def forward(self):
        self.pdf_merger.run(
            storage=self.storage.step(),
            input_pdf_list_key="input_pdf_paths",
            input_name_key="name",
            output_pdf_path_key="merged_pdf_path",
        )
        self.mineru_executor.run(
            storage=self.storage.step(),
            input_key="merged_pdf_path",
            output_key="vqa_markdown_path",
        )
        self.input_formatter.run(
            storage=self.storage.step(),
            input_markdown_path_key="vqa_markdown_path",
            output_converted_layout_key="converted_vqa_layout_path",
        )
        self.vqa_extractor.run(
            storage=self.storage.step(),
            input_path_key="converted_vqa_layout_path",
            output_path_key="extracted_llm_vqa_path",
        )
        self.llm_output_parser.run(
            storage=self.storage.step(),
            input_response_path_key="extracted_llm_vqa_path",
            input_converted_layout_path_key="converted_vqa_layout_path",
            input_name_key="name",
            output_qalist_path_key="extracted_vqa_path",
        )
        self.qa_merger.run(
            storage=self.storage.step(),
            input_qalist_path_key="extracted_vqa_path",
            input_name_key="name",
            output_merged_qalist_path_key="output_merged_vqalist_path",
            output_merged_md_path_key="output_merged_md_path",
            output_qa_item_key="vqa_pair",
        )



if __name__ == "__main__":
    # Each line in the jsonl contains input_pdf_paths, name (math1, math2, physics1, chemistry1, ...)
    pipeline = PDF_VQA_extract_optimized_pipeline()
    pipeline.compile()
    pipeline.forward()
```

---

Pipeline source: `DataFlow/dataflow/statics/pipelines/api_pipelines/pdf_vqa_extract_pipeline.py`

Use this pipeline whenever you need structured QA data distilled directly from PDF textbooks with figure references intact.
