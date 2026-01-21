---
title: PDF中的VQA提取流水线
createTime: 2025/11/17 14:01:55
permalink: /zh/guide/vqa_extract_optimized/
icon: heroicons:document-text
---

# PDF VQA 提取流水线

## 1. 概述

**PDF VQA 提取流水线** 可以自动从教材类 PDF 中提炼高质量问答对，串联了 MinerU 布局解析、面向学科的 LLM 抽取以及结构化后处理。典型场景包括：

- 构建数学 / 物理 / 化学等学科的题库
- 生成保留图片引用的 问答对Markdown / JSONL 资料

核心阶段：

1. **文档布局解析**：通过 MinerU 输出结构化 JSON 与页面切图。
2. **LLM 问答抽取**：基于学科定制提示词，解析题目、答案、解答。
3. **合并与过滤**：整合问答流、过滤无效条目、导出 JSONL/Markdown 以及图片。

## 2. 快速开始

### 步骤 1：安装 Dataflow（以及 MinerU）
安装 Dataflow：
```shell
pip install "open-dataflow[pdf2vqa]"
```

或者从源码安装 Dataflow：
```shell
git clone https://github.com/OpenDCAI/DataFlow.git
cd Dataflow
pip install -e ".[pdf2vqa]"
```

安装 MinerU 及下载模型：
```shell
pip install "mineru[vllm]>=2.5.0,<2.7.0"
mineru-models-download
```

### 步骤 2：创建工作区
```shell
cd /your/working/directory
mkdir run_dataflow
cd run_dataflow
```

### 步骤 3：初始化 Dataflow
```shell
dataflow init
```
初始化后即可在 `pipelines/` 或任意自定义目录编写脚本。

### 步骤 4：配置 API 凭证
Linux / macOS:
```shell
export DF_API_KEY="sk-xxxxx"
```
Windows PowerShell:
```powershell
$env:DF_API_KEY = "sk-xxxxx"
```
在脚本中设置接口：
```python
self.llm_serving = APILLMServing_request(
    api_url="https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    key_name_of_api_key="DF_API_KEY",
    model_name="gemini-2.5-pro",
    max_workers=100,
)
```
并设置MinerU后端（'vlm-vllm-engine'或者'vlm-transformers'）和LLM最大token数量（建议不要设置大于128000，否则LLM因为无法记住细节而效果不好）。`vlm-vllm-engine` 模式需要 GPU。
**目前这个pipeline只在`vlm`后端下经过测试，不确定是否能支持`pipeline`后端，根据官方文档两个后端格式有区别，因此建议使用`vlm`后端。**
```python
self.mineru_executor = FileOrURLToMarkdownConverterBatch(intermediate_dir = "intermediate", mineru_backend="vlm-vllm-engine")
```

```python
self.vqa_extractor = ChunkedPromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt = self.vqa_extract_prompt.build_prompt(),
    max_chunk_len=128000,
)
```

### 步骤 5：一键运行
```bash
python api_pipelines/pdf_vqa_extract_pipeline.py
```
也可将各算子嵌入其他流程，下文详细介绍数据流。

## 3. 数据流与流水线逻辑

### 1. 输入数据

使用 JSONL 描述任务，支持两种模式：

- **题答分离**
  ```jsonl
  {"question_pdf_path": "/abs/path/questions.pdf", "answer_pdf_path": "/abs/path/answers.pdf", "name": "math1"}
  ```
- **题答混排**
  问题和答案设置成同一个pdf即可
  ```jsonl
  {"question_pdf_path": "/abs/path/qa.pdf", "answer_pdf_path": "/abs/path/qa.pdf", "name": "math2"}
  ```

`FileStorage` 负责读取与缓存：
```python
self.storage = FileStorage(
            first_entry_file_name="./example_data/PDF2VQAPipeline/vqa_extract_test.jsonl",
            cache_path="./cache",
            file_name_prefix="vqa",
            cache_type="jsonl",
        )
```

### 2. 文档布局解析（MinerU）

对每个 PDF（题目、答案或混排）调用 `FileOrURLToMarkdownConverterBatch` 内部的 `_parse_file_with_mineru`，MinerU 会产出：

- `<book>/<backend>/<book>_content_list.json`：结构化布局 token
- `<book>/<backend>/images/`：对应页面切图

可选后端：

- `vlm-transformers`：CPU/GPU 均可
- `vlm-vllm-engine`：高吞吐 GPU 模式（需 CUDA）

之后会使用MinerU2LLMInputOperator处理成给llm的输入，主要包括展平列表项并重新编号。

### 3. 问答抽取（VQAExtractor）

`ChunkedPromptedGenerator` 将布局 JSON 切块以控制 token，利用 `QAExtractPrompt` 为提示词，并通过 `APILLMServing_request` 批量调用 LLM。主要特性：

- 整合、匹配问答对，并将图片插入到正确位置。
- 同时支持题目答案在不同pdf，以及题目答案混排（question1-answer1-question2-answer2-...）。
- 将 MinerU 切图复制到 `cache_path/name/question_images`、`answer_images`。
- 解析 `<qa_pair>`、`<question>`、`<answer>`、`<solution>`、`<chapter>`、`<label>` 标签。

### 4. 后处理与产物

调用QA_Merger进行问答对匹配，这个算子：
- 对于题目答案混排的，会直接把已经完整的问答对原样写入，等于什么都没做
- 对于题目答案分离的，会根据章节标题，题目序号进行启发式匹配

这个算子可以设置一个`strict_title_match`参数，如果设置为True，会对章节标题进行严格匹配，否则会尝试提取标题中的中文/英文序号再匹配。

每个 output_dir （cache_path/name/下面） 会得到：

1. `vqa_extracted_questions.jsonl`
2. `vqa_extracted_answers.jsonl`
3. `vqa_merged_qa_pairs.jsonl`
4. `vqa_merged_qa_pairs.md`
5. `question_images/`、`answer_images/`

此外，cache的主文件最后一个step会包含提取出来的所有问答对，方便后面直接接算子做后处理。

每个qa_item包含：

- `question`：题干文本与图片
- `answer`：答案文本与图片
- `solution`：可选的解题过程
- `label`：题目编号
- `chapter_title`：所在章节/小节标题（如果`strict_title_match=False`则为标题序号）

示例：
```json
{
  "question": "计算 $x$ 使得 $x^2-1=0$。",
  "answer": "$x = 1$ 或 $x = -1$",
  "solution": "因式分解 $(x-1)(x+1)=0$。",
  "label": 1,
  "chapter_title": "第一章 二次方程"
}
```

## 5. 流水线示例

```python
from dataflow.operators.knowledge_cleaning import FileOrURLToMarkdownConverterBatch

from dataflow.serving import APILLMServing_request
from dataflow.utils.storage import FileStorage
from dataflow.operators.pdf2vqa import MinerU2LLMInputOperator, LLMOutputParser, QA_Merger
from dataflow.operators.core_text import ChunkedPromptedGenerator

from dataflow.pipeline import PipelineABC
from dataflow.prompts.pdf2vqa import QAExtractPrompt

class VQA_extract_optimized_pipeline(PipelineABC):
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
        
        self.mineru_executor = FileOrURLToMarkdownConverterBatch(intermediate_dir = "intermediate", mineru_backend="vlm-vllm-engine")
        self.input_formatter = MinerU2LLMInputOperator()
        self.vqa_extractor = ChunkedPromptedGenerator(
            llm_serving=self.llm_serving,
            system_prompt = self.vqa_extract_prompt.build_prompt(),
            max_chunk_len=128000,
        )
        self.llm_output_question_parser = LLMOutputParser(mode="question", output_dir="./cache", intermediate_dir="intermediate")
        self.llm_output_answer_parser = LLMOutputParser(mode="answer", output_dir="./cache", intermediate_dir="intermediate")
        self.qa_merger = QA_Merger(output_dir="./cache", strict_title_match=False)
    def forward(self):
        # 目前的处理逻辑是：MinerU处理问题-MinerU处理答案-格式化问题文本-格式化答案文本-问题文本输入LLM-答案文本输入LLM-解析问题输出-解析答案输出-合并问答对
        # 由于问答对可能来自同一份pdf，也有可能来自不同pdf，而dataflow目前不支持分支，因此这里只能将question和answer的pdf都进行一次处理，
        # 即使是同一份pdf也会被处理两次，最后再合并问答对。
        # 未来会再思考如何优化这个流程，避免重复处理同一份pdf，提升性能。
        
        self.mineru_executor.run(
            storage=self.storage.step(),
            input_key="question_pdf_path",
            output_key="question_markdown_path",
        )
        self.mineru_executor.run(
            storage=self.storage.step(),
            input_key="answer_pdf_path",
            output_key="answer_markdown_path",
        )
        self.input_formatter.run(
            storage=self.storage.step(),
            input_markdown_path_key="question_markdown_path",
            output_converted_layout_key="converted_question_layout_path",
        )
        self.input_formatter.run(
            storage=self.storage.step(),
            input_markdown_path_key="answer_markdown_path",
            output_converted_layout_key="converted_answer_layout_path",
        )
        self.vqa_extractor.run(
            storage=self.storage.step(),
            input_path_key="converted_question_layout_path",
            output_path_key="vqa_extracted_questions_path",
        )
        self.vqa_extractor.run(
            storage=self.storage.step(),
            input_path_key="converted_answer_layout_path",
            output_path_key="vqa_extracted_answers_path",
        )
        self.llm_output_question_parser.run(
            storage=self.storage.step(),
            input_response_path_key="vqa_extracted_questions_path",
            input_converted_layout_path_key="converted_question_layout_path",
            input_name_key="name",
            output_qalist_path_key="extracted_questions_path",
        )
        self.llm_output_answer_parser.run(
            storage=self.storage.step(),
            input_response_path_key="vqa_extracted_answers_path",
            input_converted_layout_path_key="converted_answer_layout_path",
            input_name_key="name",
            output_qalist_path_key="extracted_answers_path",
        )
        self.qa_merger.run(
            storage=self.storage.step(),
            input_question_qalist_path_key="extracted_questions_path",
            input_answer_qalist_path_key="extracted_answers_path",
            input_name_key="name",
            output_merged_qalist_path_key="output_merged_qalist_path",
            output_merged_md_path_key="output_merged_md_path",
            output_qa_item_key="qa_pair",
        )



if __name__ == "__main__":
    # jsonl中每一行包含question_pdf_path, answer_pdf_path, name (math1, math2, physics1, chemistry1, ...)
    # 如果question和answer在同一份pdf中，请将question_pdf_path和answer_pdf_path设置为相同的路径
    pipeline = VQA_extract_optimized_pipeline()
    pipeline.compile()
    pipeline.forward()
```

---

Pipeline 源码：`DataFlow/dataflow/statics/pipelines/api_pipelines/pdf_vqa_extract_pipeline.py`

利用该流水线可直接从 PDF 教材中沉淀带图引用的结构化问答数据。
