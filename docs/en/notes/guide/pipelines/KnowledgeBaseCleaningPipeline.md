---
title: PDF2QA Pipeline
createTime: 2025/07/05 12:23:14
icon: fa6-regular:bookmark
permalink: /en/guide/r51ooua8/
---

# PDF2QA Pipeline

## 1. Overview

The core objective of the PDF2QA pipeline is to provide **end-to-end** information extraction, normalization, and necessary metadata generation services for raw documents provided by users, which often come in heterogeneous formats and contain high levels of informational noise. The extracted data can be directly used for RAG, pre-training, and various downstream tasks for large language models. Additionally, the pipeline converts the cleaned knowledge into a set of Multi-Hop QAs using a sliding window approach. According to experiments from [MIRIAD](https://github.com/eth-medical-ai-lab/MIRIAD), this QA-formatted knowledge significantly enhances the accuracy of RAG-based reasoning.

The PDF2QA pipeline supports the following file formats: **PDF, Markdown, HTML, and webpage information crawled from URLs**.

The main workflow of the pipeline includes:

1. **Information Extraction**: Utilizing tools like [MinerU](https://github.com/opendatalab/MinerU) and [trafilatura](https://github.com/adbar/trafilatura) to extract textual information from raw documents.
2. **Text Segmentation**: Using [chonkie](https://github.com/chonkie-inc/chonkie) to split the text into segments, supporting segmentation by tokens, characters, sentences, and other methods.
3. **Knowledge Cleaning**: Cleaning the raw textual information by removing redundant tags, correcting formatting errors, and filtering out private or non-compliant content to make the text cleaner and more usable.
4. **QA Construction**: Employing a sliding window of three sentences to transform the cleaned knowledge base into a series of multi-step reasoning QAs, which further improves the accuracy of RAG-based reasoning.

## 2. Pipeline Designing

### 1. Information Extraction

The first step of the pipeline is to extract textual knowledge from the user's original documents or URLs using one of three operators: FileOrURLToMarkdownConverterFlash, FileOrURLToMarkdownConverterAPI, or FileOrURLToMarkdownConverterLocal. This step is critical, as it extracts raw documents in various formats into a unified markdown format text, facilitating subsequent cleaning steps.

#### 1.1 FileOrURLToMarkdownConverterFlash operator

If you use the FileOrURLToMarkdownConverterFlash operator, PDF extraction is based on [Flash-MinerU](https://github.com/OpenDCAI/Flash-MinerU), and the additional flash-mineru library needs to be  installed. (flash-mineru implements multi-process inference acceleration based on mineru, and the parsing speed is much faster than mineru. If you want to parse pdfs locally, it is recommended to use this operator).

```shell
pip install 'flash-mineru[vllm]'
# or
pip install 'open-dataflow[flash-mineru]'
```

Then, you also need to download the pre-trained MinerU model for local inference. You can refer to the model download method in the FileOrURLToMarkdownConverterLocal operator tutorial later in this document, or directly download from huggingface ([mineru model huggingface](https://huggingface.co/opendatalab/MinerU2.5-2509-1.2B)), or download from modelscope ([mineru model modelscope](https://www.modelscope.ai/models/OpenDataLab/MinerU2.5-2509-1.2B)). After downloading, configure the model path into the FileOrURLToMarkdownConverterFlash operator.

**Input**: original document file or URL (using Flash-MinerU) **Output**: extracted markdown text

**Example**:

```python
self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterFlash(
    intermediate_dir = "intermediate", # Directory for intermediate artifacts generated during processing
    mineru_model_path=None, # Model path used by FlashMinerU (required; e.g., MinerU2.5-xxx weights directory)
    batch_size = 4, # Batch size
    replicas = 2, # Number of replicas for PDF inference
    num_gpus_per_replica = 1, # Number of GPUs occupied by each replica
    engine_gpu_util_rate_to_ray_cap = 0.9 # Ray Resource Utilization Upper Bound Coefficient (given that flash-mineru essentially utilizes Ray for multi-process inference). For example, setting this to 0.9 means Ray will reserve 10% of the system resources. To ensure computational efficiency while leaving sufficient resources for Ray's management processes(raylet) and preventing OOM (Out of Memory) errors, this value is typically set between 0.8 and 1.0.
)
self.knowledge_cleaning_step1.run(
    storage=self.storage.step(),
    # input_key=,
    # output_key=,
)
```

#### 1.2 FileOrURLToMarkdownConverterLocal operator

If the FileOrURLToMarkdownConverterLocal operator is used in this system, PDF extraction is based on [MinerU](https://github.com/opendatalab/MinerU), and additional configuration is required. Users can configure it as follows.

<!-- > *Since `MinerU` is mainly deployed based on `SGLang`, the `open-dataflow[minerU]` environment is mainly processed based on `Dataflow[SGLang]`, and there is currently no tutorial based on `Dataflow[vllm]`.* -->

```shell
conda create -n dataflow python=3.10
conda activate dataflow
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .
pip install 'mineru[all]'
```

> #### Using local models
>
> To run `MinerU` models locally, you need to download them to local storage first. `MinerU` provides an interactive command-line tool to simplify this process.
>
> #### 1. Download tool instructions:
>
> You can use the following command to view the help information of the model download tool:
>
> ```bash
> mineru-models-download --help
> ```
>
> #### 2. Start model download:
>
> Execute the following command to start the download process:
>
> ```bash
> mineru-models-download
> ```
>
> During the download process, you will see the following interactive prompts:
>
> * **Select model download source**:
>
>   ```bash
>   Please select the model download source: (huggingface, modelscope) [huggingface]:
>   ```
>
>   *It is recommended to select `modelscope` as the download source for a better download experience.*
> * **Select `MinerU` version**:
>
>   `MinerU1` uses `pipeline`-based parsing, which is slower but has lower VRAM requirements.
>   `MinerU2.5` uses `vlm`-based parsing, which is faster but has higher VRAM requirements. Users can freely select the desired MinerU parsing version as needed and download it locally.
>
>   ```bash
>   Please select the model type to download: (pipeline, vlm, all) [all]:
>   ```
>
>   *It is recommended to select the `vlm` (MinerU2) version, as it provides faster parsing speed. If you have strict VRAM requirements or prefer traditional pipeline processing, you can select `pipeline` (MinerU1). You can also select `all` to download all available versions.*
>
> #### 3. Model path configuration
>
> The `mineru.json` configuration file will be automatically generated when you use the `mineru-models-download` command for the first time. After the model download is complete, its local path will be displayed in the current terminal window and automatically written into the `mineru.json` file in your user directory for convenient subsequent use.
>
> #### 4. MinerU environment verification
>
> The simplest command-line invocation method for environment verification:
>
> ```bash
> mineru -p <input_path> -o <output_path> -b <MinerU_Backend> --source local
> ```
>
> * `<input_path>`: local PDF/image file or directory (`./demo.pdf` or `./image_dir`)
> * `<output_path>`: output directory
> * `<mineru_backend>`: MinerU version selection interface. To use `MinerU2.5`, set the `MinerU_Backend` parameter to `"vlm-vllm-engine"` or `"vlm-transformers"` or `"vlm-http-client"`; to use `MinerU1`, set the `MinerU_Backend` parameter to `"pipeline"`.
>
> #### 5. Tool usage
>
> The `FileOrURLToMarkdownConverterLocal` operator provides a MinerU version selection interface, allowing users to select the appropriate backend engine according to their needs.
>
> * If the user uses `MinerU1`: set the `MinerU_Backend` parameter to `"pipeline"`. This will enable the traditional pipeline processing method.
> * If the user uses `MinerU2.5` **(default recommended)**: set the `MinerU_Backend` parameter to `"vlm-vllm-engine"` or `"vlm-transformers"` or `"vlm-http-client"`. This will enable the new engine based on a multimodal language model.
>
> ```python
> self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterLocal(
>    intermediate_dir="../example_data/KBCleaningPipeline/raw/",
>    mineru_backend="vlm-auto-engine",
>    mineru_model_path="<path_to_local>/MinerU2.5-2509-1.2B",
> )
> ```
>
> 🌟**More details**: For detailed information about MinerU, please refer to its GitHub repository: [MinerU official documentation](https://github.com/opendatalab/MinerU).

**Input**: original document file or URL (using MinerU2) **Output**: extracted markdown text

**Example**:

```python
self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterLocal(self, 
    intermediate_dir="intermediate", 
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

------

### 2. Text Chunking

After document extraction, the text chunking step(KBCChunkGenerator) divides the extracted long text into chunks. The system supports chunking by token, character, sentence, or semantic dimensions.

**Input**: Extracted Markdown text
 ​**​Output​**: Chunked JSON file

**Example**:

```python
text_splitter = KBCChunkGenerator(
    split_method="token",
    chunk_size=512,
    tokenizer_name="Qwen/Qwen2.5-7B-Instruct",
)
text_splitter.run(
    storage=self.storage.step(),
    input_file=extracted,
    output_key="raw_content",
)
```

### 3. Knowledge Cleaning

After text chunking, the Knowledge Cleaning(KBCTextCleaner) specializes in standardizing raw knowledge content for RAG (Retrieval-Augmented Generation) systems. This process utilizes large language model interfaces to intelligently clean and format unstructured knowledge, improving the accuracy and readability of the knowledge base.

**Input**: Chunked JSON file
 ​**​Output​**: Cleaned JSON file

```python
knowledge_cleaner = KBCTextCleaner(
    llm_serving=api_llm_serving,
    lang="en"
)
knowledge_cleaner.run(
  storage=self.storage.step(),
  input_key= "raw_content",
  output_key="cleaned",
)
```

### 4. QA Generation

After knowledge cleaning, the MultiHop-QA Generation(KBCMultiHopQAGenerator) specializes in automatically generating multi-step reasoning question-answer pairs from text data. This process uses large language model interfaces for intelligent text analysis and complex question construction, suitable for building high-quality multi-hop QA datasets. According to experiments from [MIRIAD](https://github.com/eth-medical-ai-lab/MIRIAD), this QA-formatted knowledge significantly enhances RAG reasoning accuracy.

**Input**: JSON-formatted plain text
 ​**​Output​**: For each text segment, generates a set of multi-hop QAs (output in JSON format)

**Usage Example**:

```python
self.knowledge_cleaning_step4 = Text2MultiHopQAGenerator(
    llm_serving=self.llm_serving,
    lang="en",
    num_q = 5
)
self.knowledge_cleaning_step4.run(
    storage=self.storage.step(),
    # input_key=,
    # output_key=,
)
```

<!-- ### 5. Using `Dataflow[vllm]`

> *Since `MinerU` is deployed based on the latest version of `SGLang`, the `Dataflow[vllm]` should be installed using the latest version of `vllm`.*

```bash
conda create -n dataflow python=3.10
conda activate dataflow
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .
pip install -U "mineru[all]"
pip install vllm==0.9.2
pip install "numpy>=1.24,<2.0.0"
``` -->


## 3. Execution Examples

Users can execute the following scripts to meet different data requirements. Note that scripts under gpu_pipelines, api_pipelines, and cpu_pipelines are respectively suitable for test machines with GPU, user-configured API, and other scenarios.

> *With `Dataflow[vllm]`, you can run the `gpu_pipelines/*_vllm.py` scripts, while with `Dataflow[sglang]`, you can run the `gpu_pipelines/*_sglang.py` scripts.*

- PDF2QA:

  ```shell
  python api_pipelines/kbcleaning_pipeline.py  # API版本
  python gpu_pipelines/kbcleaning/kbcleaning_pipeline_vllm.py 
  python gpu_pipelines/kbcleaningkbcleaning_pipeline_sglang.py 
  ```
    [kbcleaning_pipeline.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/statics/pipelines/api_pipelines/kbcleaning_pipeline.py)
    [kbcleaning_pipeline_pdf_vllm.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/statics/pipelines/gpu_pipelines/kbcleaning/kbcleaning_pipeline_vllm.py) 
    [kbcleaning_pipeline_pdf_sglang.py ](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/statics/pipelines/gpu_pipelines/kbcleaning/kbcleaning_pipeline_sglang.py)


## 4. Pipeline Example

The following provides an example pipeline configured for the `Dataflow[vllm]` environment, demonstrating how to use multiple operators for PDF2QA. This example shows how to initialize a PDF2QA pipeline and sequentially execute each extraction and cleaning step.

```python
from dataflow.operators.knowledge_cleaning import (
    KBCChunkGenerator,
    FileOrURLToMarkdownConverterFlash,
    KBCTextCleaner,
    # KBCMultiHopQAGenerator,
)
from dataflow.operators.core_text import Text2MultiHopQAGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import LocalModelLLMServing_vllm

class KBCleaning_PDFvllm_GPUPipeline():
    def __init__(self):

        self.storage = FileStorage(
            first_entry_file_name="../../example_data/KBCleaningPipeline/kbc_test.jsonl",
            cache_path="./.cache/gpu",
            file_name_prefix="knowledge_cleaning_step_vllm_engine",
            cache_type="json",
        )

        self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterFlash(
            intermediate_dir = "intermediate",
            mineru_model_path = "<path_to_local>/MinerU2.5-2509-1.2B", 
            batch_size = 8,
            replicas = 2,
            num_gpus_per_replica = 1,
            engine_gpu_util_rate_to_ray_cap = 0.9
        )

        self.knowledge_cleaning_step2 = KBCChunkGenerator(
            split_method="token",
            chunk_size=512,
            tokenizer_name="Qwen/Qwen2.5-7B-Instruct",
        )

    def forward(self):
        self.knowledge_cleaning_step1.run(
            storage=self.storage.step(),
            # input_key=
            # output_key=
        )
        
        self.knowledge_cleaning_step2.run(
            storage=self.storage.step(),
            # input_key=
            # output_key=
        )

        self.llm_serving = LocalModelLLMServing_vllm(
            hf_model_name_or_path="Qwen/Qwen2.5-7B-Instruct",
            vllm_max_tokens=2048,
            vllm_tensor_parallel_size=4,
            vllm_gpu_memory_utilization=0.6,
            vllm_repetition_penalty=1.2
        )

        self.knowledge_cleaning_step3 = KBCTextCleaner(
            llm_serving=self.llm_serving,
            lang="en"
        )

        self.knowledge_cleaning_step4 = Text2MultiHopQAGenerator(
            llm_serving=self.llm_serving,
            lang="en",
            num_q = 5
        )

        self.knowledge_cleaning_step3.run(
            storage=self.storage.step(),
            # input_key=
            # output_key=
        )
        self.knowledge_cleaning_step4.run(
            storage=self.storage.step(),
            # input_key=
            # output_key=
        )
        
if __name__ == "__main__":
    model = KBCleaning_PDFvllm_GPUPipeline()
    model.forward()
```
