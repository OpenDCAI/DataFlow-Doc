---
title: PDF VQA Extraction Pipeline
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

### Step 1: Install Dataflow (and MinerU)
```shell
pip install open-dataflow
pip install "mineru[vllm]"
mineru-models-download
```

### Step 2: Create a workspace
```shell
mkdir run_dataflow
cd run_dataflow
```

### Step 3: Initialize Dataflow
```shell
dataflow init
```
You can then add your pipeline script under `pipelines/` or any custom path.

### Step 4: Configure API credentials
Linux / macOS:
```shell
export DF_API_KEY="sk-xxxxx"
```
Windows PowerShell:
```powershell
$env:DF_API_KEY = "sk-xxxxx"
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
and set MinerU backend ('vlm-vllm-engine' or 'vlm-transformers') and LLM max token length (recommended not to exceed 128000 to avoid LLM forgetting details).
**Caution: The pipeline was only tested with the `vlm` backend; compatibility with the `pipeline` backend is uncertain due to format differences. Using the `vlm` backend is recommended.**
The `vlm-vllm-engine` backend requires GPU support.
```python
self.vqa_extractor = VQAExtractor(
            llm_serving=self.llm_serving,
            mineru_backend='vlm-vllm-engine',
            max_chunk_len=128000
        )
```

### Step 5: One-click run
```bash
python api_pipelines/pdf_vqa_extract_pipeline.py
```
You can also import the operators into other workflows; the remainder of this doc explains the data flow in detail.

## 3. Data Flow and Pipeline Logic

### 1. Input data

Each job is defined by a JSONL row. Two modes are supported:

- **Separate PDFs**
  ```jsonl
  {"question_pdf_path": "/abs/path/questions.pdf", "answer_pdf_path": "/abs/path/answers.pdf", "subject": "math", "output_dir": "./output/math"}
  ```
- **Interleaved PDFs**
  ```jsonl
  {"pdf_path": "/abs/path/qa_mixed.pdf", "subject": "physics", "output_dir": "./output/physics"}
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

For each PDF (question, answer, or mixed), the pipeline calls `_extract_doc_layout` inside `VQAExtractor`. MinerU outputs:

- `<book>/<backend>/<book>_content_list.json`: structured layout tokens (texts, figures, tables, IDs)
- `<book>/<backend>/images/`: cropped page images

The backend can be:

- `vlm-transformers`: CPU/GPU compatible
- `vlm-vllm-engine`: high-throughput GPU mode (requires CUDA)

### 3. QA extraction (VQAExtractor)

`VQAExtractor` chunks the layout JSON to respect token limits, builds subject-aware prompts (`QAExtractPrompt`), and batches LLM calls via `APILLMServing_request`. Key behaviors:

- Grouping and pairing Q&A based, and inserting images to proper positions.
- Supports `question_pdf_path` + `answer_pdf_path`, or a single `pdf_path` (auto-detect interleaved mode).
- Copies rendered images into `output_dir/question_images` and/or `answer_images`.
- Parses `<qa_pair>`, `<question>`, `<answer>`, `<solution>`, `<chapter>`, `<label>` tags from the LLM response.

### 4. Post-processing and outputs

For each `output_dir`, the pipeline writes:

1. `vqa_extracted_questions.jsonl`
2. `vqa_extracted_answers.jsonl` (if separate mode)
3. `vqa_merged_qa_pairs.jsonl`
4. `vqa_filtered_qa_pairs.jsonl`
5. `vqa_filtered_qa_pairs.md`
6. `question_images/`, `answer_images/` (depending on mode)

Filtering keeps entries where the question exists and either `answer` or `solution` is non-empty. Markdown conversion (`jsonl_to_md`) provides a human-readable summary.

## 4. Output Data

Each filtered record includes:

- `question`: question text and images
- `answer`: answer text and images(if extracted from answer PDF)
- `solution`: optional worked solution (if present)
- `label`: original numbering (e.g., “Example 3”, “习题2”)
- `chapter_title`: chapter/section header detected on the same page

Example:
```json
{
  "question": "Solve for x in x^2 - 1 = 0.",
  "answer": "x = 1 or x = -1",
  "solution": "Factor as (x-1)(x+1)=0.",
  "label": "Example 1",
  "chapter_title": "Chapter 1 Quadratic Equations"
}
```

## 5. Pipeline Example

```python
from dataflow.serving import APILLMServing_request
from dataflow.utils.storage import FileStorage
from dataflow.operators.pdf2vqa import VQAExtractor

class VQA_extract_optimized_pipeline:
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./example_data/PDF2VQAPipeline/vqa_extract_test.jsonl",
            cache_path="./cache",
            file_name_prefix="vqa",
            cache_type="jsonl",
        )
        
        self.llm_serving = APILLMServing_request(
            api_url="https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            key_name_of_api_key="DF_API_KEY",
            model_name="gemini-2.5-pro",
            max_workers=100,
        )
        
        self.vqa_extractor = VQAExtractor(
            llm_serving=self.llm_serving,
            mineru_backend='vlm-vllm-engine',
            max_chunk_len=128000
        )
        
    def forward(self):
        self.vqa_extractor.run(
            storage=self.storage.step(),
            input_question_pdf_path_key="question_pdf_path",
            input_answer_pdf_path_key="answer_pdf_path",
            input_pdf_path_key="pdf_path",  # for interleaved mode
            input_subject_key="subject",
            output_dir_key="output_dir",
            output_jsonl_key="output_jsonl_path",
        )



if __name__ == "__main__":
    # Each line in the JSONL contains `question_pdf_path`, `answer_pdf_path`, `subject` (math, physics, chemistry, ...), and `output_dir`
    # If the question and the answer are in the same PDF, set both `question_pdf_path` and `answer_pdf_path` to the same path; the pipeline will automatically switch to interleaved mode.
    pipeline = VQA_extract_optimized_pipeline()
    pipeline.forward()
```

---

Pipeline source: `DataFlow/dataflow/statics/pipelines/api_pipelines/pdf_vqa_extract_pipeline.py`

Use this pipeline whenever you need structured QA data distilled directly from PDF textbooks with figure references intact.
