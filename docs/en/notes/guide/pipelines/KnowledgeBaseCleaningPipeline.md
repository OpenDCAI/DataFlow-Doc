---
title: Knowledge Base Cleaning Pipeline
createTime: 2025/07/05 12:23:14
icon: fa6-regular:bookmark
permalink: /en/guide/r51ooua8/
---

# Knowledge Base Cleaning & QA Generation Pipeline

## 1. Overview

The core objective of the knowledge base cleaning pipeline is to provide **end-to-end** information extraction, normalization, and necessary metadata generation services for raw documents provided by users, which often come in heterogeneous formats and contain high levels of informational noise. The extracted data can be directly used for RAG, pre-training, and various downstream tasks for large language models. Additionally, the pipeline converts the cleaned knowledge into a set of Multi-Hop QAs using a sliding window approach. According to experiments from [MIRIAD](https://github.com/eth-medical-ai-lab/MIRIAD), this QA-formatted knowledge significantly enhances the accuracy of RAG-based reasoning.

The knowledge base cleaning pipeline supports the following file formats: **PDF, Markdown, HTML, and webpage information crawled from URLs**.

The main workflow of the pipeline includes:

1. **Information Extraction**: Utilizing tools like [MinerU](https://github.com/opendatalab/MinerU) and [trafilatura](https://github.com/adbar/trafilatura) to extract textual information from raw documents.
2. **Text Segmentation**: Using [chonkie](https://github.com/chonkie-inc/chonkie) to split the text into segments, supporting segmentation by tokens, characters, sentences, and other methods.
3. **Knowledge Cleaning**: Cleaning the raw textual information by removing redundant tags, correcting formatting errors, and filtering out private or non-compliant content to make the text cleaner and more usable.
4. **QA Construction**: Employing a sliding window of three sentences to transform the cleaned knowledge base into a series of multi-step reasoning QAs, which further improves the accuracy of RAG-based reasoning.

## 2. Pipeline Designing

### 1. Information Extraction

The first step of the pipeline is to extract textual knowledge from users' original documents or URLs using FileOrURLToMarkdownConverter. This step is crucial as it converts various formats of raw documents into unified markdown text, facilitating subsequent cleaning processes.

> *Since `MinerU` is primarily deployed based on `SGLang`, the `open-dataflow[minerU]` environment mainly operates on `Dataflow[SGLang]`. Currently, there is no tutorial available for processing based on `Dataflow[vllm]`.*


```shell
conda create -n dataflow python=3.10
conda activate dataflow
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .[mineru]
```

PDF file extraction in this system is based on [MinerU](https://github.com/opendatalab/MinerU), and requires additional configuration. Users can configure it using the following steps.


> #### Using the Local Model
> 
> To run the `MinerU` model locally, you need to first download the model files to your local storage. `MinerU` provides an interactive command-line tool to simplify this process.
> 
> #### 1. Download Tool Guide:
> 
> You can view the help information for the model download tool using the following command:
> 
> ```bash
> mineru-models-download --help
> ```
> 
> #### 2. Start the Model Download:
> 
> Run the following command to begin the download process:
> 
> ```bash
> mineru-models-download
> ```
> 
> During the download process, you will encounter the following interactive prompts:
> 
> * **Choose Model Download Source**:
> 
> ```bash
> Please select the model download source: (huggingface, modelscope) [huggingface]:
> ```
> 
> *It is recommended to choose `modelscope` as the source for a better download experience.*
> 
> * **Select `MinerU` Version**:
> 
> `MinerU1` uses a `pipeline` approach — slower but with lower GPU memory requirements.  
> `MinerU2` uses a `vlm` (Vision-Language Model) approach — faster but requires more GPU memory.
> 
> Users can choose the MinerU version based on their needs and download it locally.
> 
> <table>
>   <tbody>
>     <tr>
>       <td>Parsing Backend</td>
>       <td>pipeline</td>
>       <td>vlm-sglang</td>
>     </tr>
>     <tr>
>       <td>Operating System</td>
>       <td>Linux / Windows / macOS</td>
>       <td>Linux / Windows (via WSL2)</td>
>     </tr>
>     <tr>
>       <td>CPU Inference Support</td>
>       <td>✅</td>
>       <td colspan="2">❌</td>
>     </tr>
>     <tr>
>       <td>GPU Requirements</td>
>       <td>Turing or newer architecture, 6GB+ VRAM or Apple Silicon</td>
>       <td colspan="2">Turing or newer architecture, 8GB+ VRAM</td>
>     </tr>
>     <tr>
>       <td>RAM Requirements</td>
>       <td colspan="3">Minimum 16GB, 32GB recommended</td>
>     </tr>
>     <tr>
>       <td>Disk Space Requirements</td>
>       <td colspan="3">At least 20GB, SSD recommended</td>
>     </tr>
>     <tr>
>       <td>Python Version</td>
>       <td colspan="3">3.10–3.13</td>
>     </tr>
>   </tbody>
> </table>   
> 
> ```bash
> Please select the model type to download: (pipeline, vlm, all) [all]:
> ```
> 
> *It is recommended to choose the `vlm` (MinerU2) version for faster parsing. If you have strict GPU memory limitations or prefer the traditional pipeline approach, choose `pipeline` (MinerU1). You can also select `all` to download all available versions.*
> 
> #### 3. Model Path Configuration
> 
> The `mineru.json` configuration file will be automatically generated when you run the `mineru-models-download` command for the first time. After the download completes, the local path to the model will be displayed in the terminal and automatically written to your `mineru.json` file in your user directory for future use.
> 
> #### 4. Environment Verification
> 
> You can verify your setup using the simplest command-line call:
> 
> ```bash
> mineru -p <input_path> -o <output_path> -b <MinerU_Backend> --source local
> ```
> 
> * `<input_path>`: Local PDF/image file or directory (`./demo.pdf` or `./image_dir`)
> * `<output_path>`: Output directory
> * `<mineru_backend>`: Backend engine of the MinerU version. For `MinerU2`, set `MinerU_Backend` to `"vlm-sglang-engine"`; for `MinerU1`, set it to `"pipeline"`.
> 
> #### 5. Tool Usage
> 
> The `FileOrURLToMarkdownConverter` operator allows you to choose the desired backend engine of MinerU.
> 
> * If using `MinerU1`: set the `MinerU_Backend` parameter to `"pipeline"`, which uses the traditional pipeline approach.
> * If using `MinerU2` **(recommended by default)**: set the `MinerU_Backend` parameter to `"vlm-sglang-engine"` to enable the vision-language model engine.
> 
> ```python
> self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverter(
>    intermediate_dir="../example_data/KBCleaningPipeline/raw/",
>    lang="en",
>    mineru_backend="vlm-sglang-engine",
>    raw_file = raw_file,
> )
> ```
> 
> 🌟 **More Info**: For detailed information about MinerU, please refer to its GitHub repository: [MinerU Official Documentation](https://github.com/opendatalab/MinerU)


**Input**: Original document files or URL (Using MinerU2)
 ​**​Output​**: Extracted markdown text

**Example**:

```python
file_to_markdown_converter = FileOrURLToMarkdownConverter(
    intermediate_dir="../example_data/KBCleaningPipeline/raw/",
    lang="en",
    mineru_backend="vlm-sglang-engine",
    raw_file = raw_file,
)
extracted=file_to_markdown_converter.run(
    storage=self.storage,
)
```

------

### 2. Text Chunking

After document extraction, the text chunking step(CorpusTextSplitter) divides the extracted long text into chunks. The system supports chunking by token, character, sentence, or semantic dimensions.

**Input**: Extracted Markdown text
 ​**​Output​**: Chunked JSON file

**Example**:

```python
text_splitter = CorpusTextSplitter(
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

After text chunking, the Knowledge Cleaning(KnowledgeCleaner) specializes in standardizing raw knowledge content for RAG (Retrieval-Augmented Generation) systems. This process utilizes large language model interfaces to intelligently clean and format unstructured knowledge, improving the accuracy and readability of the knowledge base.

**Input**: Chunked JSON file
 ​**​Output​**: Cleaned JSON file

```python
knowledge_cleaner = KnowledgeCleaner(
    llm_serving=api_llm_serving,
    lang="en"
)
extracted_path = knowledge_cleaner.run(
  storage=self.storage.step(),
  input_key= "raw_content",
  output_key="cleaned",
)
```

### 4. QA Generation

After knowledge cleaning, the MultiHop-QA Generation(MultiHopQAGenerator) specializes in automatically generating multi-step reasoning question-answer pairs from text data. This process uses large language model interfaces for intelligent text analysis and complex question construction, suitable for building high-quality multi-hop QA datasets. According to experiments from [MIRIAD](https://github.com/eth-medical-ai-lab/MIRIAD), this QA-formatted knowledge significantly enhances RAG reasoning accuracy.

**Input**: JSON-formatted plain text
 ​**​Output​**: For each text segment, generates a set of multi-hop QAs (output in JSON format)

**Usage Example**:

```python
  multi_hop_qa_generator = MultiHopQAGenerator(
      llm_serving=local_llm_serving,
      lang="en"
  )
  multi_hop_qa_generator.run(
      storage=self.storage.step(),
      input_key="cleaned",
      output_key="MultiHop_QA"
  )
```

### 5. Using `Dataflow[vllm]`

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
```


## 3. Execution Examples

Users can execute the following scripts to meet different data requirements. Note that scripts under gpu_pipelines, api_pipelines, and cpu_pipelines are respectively suitable for test machines with GPU, user-configured API, and other scenarios.

> *With `Dataflow[vllm]`, you can run the `gpu_pipelines/*_vllm.py` scripts, while with `Dataflow[sglang]`, you can run the `gpu_pipelines/*_sglang.py` scripts.*

- Knowledge base cleaning and construction for PDF files:

  ```shell
  python gpu_pipelines/kbcleaning_pipeline_pdf_vllm.py
  python gpu_pipelines/kbcleaning_pipeline_pdf_sglang.py
  ```
- Knowledge base cleaning and construction after URL crawling:

  ```shell
  python gpu_pipelines/kbcleaning_pipeline_url_vllm.py
  python gpu_pipelines/kbcleaning_pipeline_url_sglang.py
  ```

## 4. Pipeline Example

The following provides an example pipeline configured for the `Dataflow[vllm]` environment, demonstrating how to use multiple operators for knowledge base cleaning. This example shows how to initialize a knowledge base cleaning pipeline and sequentially execute each extraction and cleaning step.

```python
from dataflow.operators.generate import (
    CorpusTextSplitter,
    FileOrURLToMarkdownConverter,
    KnowledgeCleaner,
    MultiHopQAGenerator,
)
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request

class KBCleaningPDF_APIPipeline():
    def __init__(self, url:str=None, raw_file:str=None):

        self.storage = FileStorage(
            first_entry_file_name="../example_data/KBCleaningPipeline/kbc_placeholder.json",
            cache_path="./.cache/api",
            file_name_prefix="pdf_cleaning_step",
            cache_type="json",
        )

        self.llm_serving = APILLMServing_request(
                api_url="https://api.openai.com/v1/chat/completions",
                model_name="gpt-4o",
                max_workers=100
        )

        self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverter(
            intermediate_dir="../example_data/KBCleaningPipeline/raw/",
            lang="en",
            mineru_backend="vlm-sglang-engine",
            raw_file = raw_file,
        )

        self.knowledge_cleaning_step2 = CorpusTextSplitter(
            split_method="token",
            chunk_size=512,
            tokenizer_name="Qwen/Qwen2.5-7B-Instruct",
        )

        self.knowledge_cleaning_step3 = KnowledgeCleaner(
            llm_serving=self.llm_serving,
            lang="en"
        )

        self.knowledge_cleaning_step4 = MultiHopQAGenerator(
            llm_serving=self.llm_serving,
            lang="en"
        )

    def forward(self):
        extracted=self.knowledge_cleaning_step1.run(
            storage=self.storage,
        )
        
        self.knowledge_cleaning_step2.run(
            storage=self.storage.step(),
            input_file=extracted,
            output_key="raw_content",
        )

        self.knowledge_cleaning_step3.run(
            storage=self.storage.step(),
            input_key= "raw_content",
            output_key="cleaned",
        )
        self.knowledge_cleaning_step4.run(
            storage=self.storage.step(),
            input_key="cleaned",
            output_key="MultiHop_QA"
        )
        
if __name__ == "__main__":
    model = KBCleaningPDF_APIPipeline(raw_file="../example_data/KBCleaningPipeline/test.pdf")
    model.forward()
```

