---
title: MathBookQuestionExtract
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/mathbookquestionextract/
---

```markdown
## 📘 Overview [MathBookQuestionExtract](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
This operator extracts questions and related images from mathematics textbook PDFs. It converts the PDF to images, uses MinerU for content extraction, organizes the images, and analyzes the content using a large vision-language model, ultimately generating JSON and Markdown files containing questions and images.

## __init__ function
```python
def __init__(self, llm_serving: APIVLMServing_openai, prompt_template = None):
```
### init parameters description
| Parameter | Type | Default Value | Description |
| :------------------ | :------------------- | :---------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **llm_serving** | APIVLMServing_openai | Required | A Vision Language Model (VLM) serving object that implements the `APIVLMServing_openai` interface. |
| **prompt_template** | PromptABC | `None` | A prompt template object to guide the VLM. If not provided, `MathbookQuestionExtractPrompt()` is used by default. |

### Prompt Template Descriptions

## run function
```python
def run(
    self,
    pdf_file_path: str,
    output_file_name: str,
    output_folder: str,
    MinerU_Backend: str = "vlm-sglang-engine",
    dpi: int = 300,
    api_url: str = "http://123.129.219.111:3000/v1",
    key_name_of_api_key: str = "DF_API_KEY",
    model_name: str = "o4-mini",
    max_workers: int = 20
)
```
#### Parameters
| Name | Type | Default Value | Description |
| :-------------------- | :---- | :---------------------- | :----------------------------------------------------------- |
| **pdf_file_path** | str | Required | The file path to the input mathematics textbook PDF. |
| **output_file_name** | str | Required | The base name for the output files (e.g., "chapter1_questions"). |
| **output_folder** | str | Required | The path to the directory where output files will be saved. |
| **MinerU_Backend** | str | "vlm-sglang-engine" | The backend to use for the MinerU content extraction process. |
| **dpi** | int | 300 | The resolution (dots per inch) for converting PDF pages to images. |
| **api_url** | str | "http://..." | The URL of the Vision Language Model API service. |
| **key_name_of_api_key** | str | "DF_API_KEY" | The name of the environment variable containing the API key. |
| **model_name** | str | "o4-mini" | The name of the model to be used for content analysis. |
| **max_workers** | int | 20 | The maximum number of parallel worker threads for processing. |

## 🧠 Example Usage

```
