---
title: Case 6. Math Problem Extraction
createTime: 2025/07/16 20:10:28
icon: teenyicons:receipt-outline
permalink: /en/guide/t8ykcw9l/
---

# Quick Start: Math Problem Extraction

This example demonstrates how to use the `MathBookQuestionExtract` operator in Dataflow to automatically extract math problems from a textbook PDF and generate output in JSON/Markdown format.

## 1 Environment and Dependencies

1. Install Dataflow and MinerU dependencies  
   ```shell
   pip install "open-dataflow[mineru]"
   ```  
   Or install from source:  
   ```shell
   pip install -e ".[mineru]"
   ```

2. Download MinerU model weights  
   ```shell
   mineru-models-download
   ```

> This operator uses MinerU for PDF content segmentation and image extraction; please ensure that the installation and model weight download have succeeded.

## 2 Configure LLM Serving

This operator currently only supports API-based VLM Serving. Please configure the API URL and key before running.

- Linux / macOS:  
  ```shell
  export DF_API_KEY="sk-xxxxx"
  ```
- Windows PowerShell:  
  ```powershell
  $env:DF_API_KEY = "sk-xxxxx"
  ```

The API key will be read from the environment variable in the code, so there is no need to hard-code it in the script.

## 3 Prepare the Test PDF

The example repository includes a test PDF:  
```
./dataflow/example/KBCleaningPipeline/questionextract_test.pdf
```  
You can also replace it with any math textbook or exercise collection PDF.

## 4 Initialize and Modify the Script

First, create a new `run_dataflow` folder anywhere, enter that directory, and then execute Dataflow project initialization:

```shell
mkdir run_dataflow
cd run_dataflow
dataflow init
```

After initialization is complete, the following file will appear in the project directory:

```shell
run_dataflow/playground/mathbook_extract.py
```

The contents of that script are as follows:

```python
from dataflow.operators.generate import MathBookQuestionExtract
from dataflow.serving.APIVLMServing_openai import APIVLMServing_openai

class QuestionExtractPipeline:
    def __init__(self, llm_serving: APIVLMServing_openai):
        self.extractor = MathBookQuestionExtract(llm_serving)
        self.test_pdf = "../example/KBCleaningPipeline/questionextract_test.pdf"

    def forward(
        self,
        pdf_path: str,
        output_name: str,
        output_dir: str,
        api_url: str = "https://api.openai.com/v1/chat/completions",
        key_name_of_api_key: str = "DF_API_KEY",
        model_name: str = "o4-mini",
        max_workers: int = 20
    ):
        self.extractor.run(
            pdf_file_path=pdf_path,
            output_file_name=output_name,
            output_folder=output_dir,
            api_url=api_url,
            key_name_of_api_key=key_name_of_api_key,
            model_name=model_name,
            max_workers=max_workers
        )

if __name__ == "__main__":
    # 1. Initialize LLM Serving
    llm_serving = APIVLMServing_openai(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="o4-mini",      # It is recommended to use a strong reasoning model
        max_workers=20             # Number of concurrent requests
    )

    # 2. Construct and run the extraction pipeline
    pipeline = QuestionExtractPipeline(llm_serving)
    pipeline.forward(
        pdf_path=pipeline.test_pdf,
        output_name="test_question_extract",
        output_dir="./output"
    )
```

### Key Parameter Explanation

- `api_url`: OpenAI VLM endpoint URL  
- `key_name_of_api_key`: Name of the environment variable  
- `model_name`: Model name (e.g., `o4-mini`; strong reasoning models are recommended)  
- `max_workers`: Number of concurrent requests  


### Operator Logic

The complete implementation of the operator is located at  
`dataflow/operators/generate/KnowledgeCleaning/mathbook_question_extract.py`  
Below, starting from the overall flow, we provide concise yet detailed explanations of each key stage to facilitate use and secondary development:

1. PDF file splitting  
   - Use `pymupdf` (fitz) to open the target PDF, rendering each page into a high-quality JPEG image at the specified DPI.  
   - Save the images, named by page number, to the specified output directory, and log the conversion progress of each page to ensure traceability.

2. Invoke MinerU for content recognition and image extraction  
   - Dynamically import the `mineru` module; if it is not installed, throw a friendly prompt guiding the user to run `pip install mineru[pipeline]` and download the models.  
   - Specify loading models from the local source via the environment variable `MINERU_MODEL_SOURCE=local`, supporting backend options `"vlm-sglang-engine"` or `"pipeline"`.  
   - Execute the command-line tool:  
```shell
    mineru -p <pdf_file> -o <output_folder> -b <backend> --source local  
```
   - After execution, the tool will generate `*_content_list.json` (a structured content inventory) and a folder of the original split images in the intermediate directory.

3. Organize and rename image resources  
   - Read the `content_list.json` produced by MinerU, filtering out all items where `type=='image'`.  
   - Copy the corresponding images from MinerU’s temporary directory to the final result folder, renaming them sequentially as `0.jpg, 1.jpg...`.  
   - Also generate a new JSON inventory, recording each image’s page number in the source PDF and its new file path.

4. Organize model invocation commands  
   - Retrieve the predefined text prompt (`mathbook_question_extract_prompt`) from `dataflow.prompts.kbcleaning.KnowledgeCleanerPrompt`, specifying the task requirements and format conventions.  
   - Package the rendered commands together with multiple input images (page snapshots, illustrations) to prepare for subsequent concurrent LLM service calls.

5. Concurrently obtain model responses  
   - Use `APIVLMServing_openai` (or another `LLMServingABC` implementation) combined with `ThreadPoolExecutor` to concurrently submit the packaged list of images and labels to the model.  
   - Allow customization of the model name, API endpoint, concurrency level, and timeout to flexibly meet different performance and cost requirements.

6. Parse and save the final output  
   - In the `analyze_and_save` method, use regular expressions to precisely capture the `<image>index.jpg</image>` tags in the model’s returned text.  
   - Copy the corresponding images referenced in the tags to the `images/` subfolder in the results directory.  
   - Output the results in two formats:  
     a. JSON file: sequentially store each question’s plain text (with tags removed) and the corresponding list of image paths  
     b. Markdown file: embed images in the original text using the `![](images/xx.jpg)` format for easy visualization  
   - All output files are saved in the user-specified result folder, facilitating subsequent verification and secondary use.

## 5 Run the Script

```shell
python generate_question_extract_api.py
```

After it finishes, the `./output` directory will contain:

- `test_question_extract.json`  
  Each record includes:  
  - `text`: Extracted problem text  
  - `pics`: List of image paths involved in the problem  
- `test_question_extract.md`  
  Displays the problems and their images in Markdown format

## 6 Optional Extensions

- Custom prompts: To adjust the system prompt, replace it inside the operator:  
  ```python
  from dataflow.prompts.kbcleaning import KnowledgeCleanerPrompt
  system_prompt = KnowledgeCleanerPrompt().mathbook_question_extract_prompt()
  ```
- Parameter customization: Supports switching the MinerU backend (`pipeline` | `vlm-sglang-engine`), adjusting DPI, concurrency, etc. See the `run` method signature in the operator.