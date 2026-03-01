---
title: Case 6. Visual Question Answering (VQA)
createTime: 2025/07/16 20:10:28
icon: heroicons:camera
permalink: /en/guide/l4872nj0/
---

# Quick Start: Visual Question Answering (VQA) Operator

The VQA operator allows users to define a text prompt and then accept a JSON file where each record provides an image path. The VQA operator sends both the image and the text prompt to the model for inference. In just a few simple steps, you can complete tasks like OCR, visual question answering, image information extraction, and more.

## Step 1: Install Dataflow

```shell
pip install open-dataflow
```

### Step 2: Create a new dataflow working directory
```shell
mkdir run_dataflow
cd run_dataflow
```

### Step 3: Initialize Dataflow
```shell
dataflow init
```
After initialization you will see:
```shell
run_dataflow/playground/vqa.py
```

## Step 4: Configure API Key

If you are using the OpenAI API, you need to set an environment variable first:

Linux/Mac:
```shell
export DF_API_KEY="sk-xxxxxx"
```

Windows PowerShell:
```powershell
$env:DF_API_KEY = "sk-xxxxxx"
```

## Step 5: Prepare Image Path Data

In the project root directory, create a JSON file, for example `pic_path.json`, with the following format:

```json
[
  {"raw_content": "/absolute/path/to/image1.jpg"},
  {"raw_content": "/absolute/path/to/image2.png"}
]
```

The operator will read the field name you pass in as the image path to the model. The default field name is `raw_content`, but you can customize it in the invocation script. **Picture must be jpg(jpeg) or png**。

## Step 6: Modify and Use the VQA Script as Needed

Refer to the example code below:

```python
from dataflow.operators.generate.Vqa.PromptedVQAGenerator import PromptedVQAGenerator
from dataflow.serving.APIVLMServing_openai import APIVLMServing_openai
from dataflow.utils.storage import FileStorage

class Vqa_generator:
    def __init__(self):
        # Custom prompt; can be changed to OCR, information extraction, etc., as needed
        self.prompt = "Describe the image in detail."

        # Specify input file and cache directory
        self.storage = FileStorage(
            first_entry_file_name="pic_path.json",
            cache_path="./cache",
            file_name_prefix="vqa",
            cache_type="json",
        )

        # Call the OpenAI API
        self.llm_serving = APIVLMServing_openai(
            model_name="o4-mini",
            api_url="https://api.openai.com/v1",
            key_name_of_api_key="DF_API_KEY",
        )

        # Build the VQA operator
        self.vqa_generate = PromptedVQAGenerator(
            self.llm_serving,
            self.prompt
        )

    def forward(self):
        self.vqa_generate.run(
            storage=self.storage.step(),
            input_key="raw_content"
        )

if __name__ == "__main__":
    Vqa_generator().forward()
```

### Parameter Notes:
- `self.prompt`: Guides the model for description, Q&A, OCR, etc.
- `storage.step()`: Reads each `raw_content` entry from `pic_path.json` in sequence.
- The results will be written to files like `./cache/vqa-0.json`, `vqa-1.json`, etc., with the following format:

  ```json
  {
    "raw_content": "/absolute/path/to/image1.jpg",
    "result": "A close-up photo of a red apple on a wooden table."
  }
  ```
- We provide an example file for running this operator at `dataflow/example/Vqa/pic_path.json`. Just fill in your own API URL and API key to experience the VQA operator in one click.

### Operator Logic Description  
This operator is implemented based on APIVLMServing_openai in dataflow/serving/APIVLMServing_openai.py, and primarily provides the basic functionality for OpenAI‐style image question answering, with a built‐in concurrent invocation mechanism. Its workflow is as follows:

1. The server encodes the input image into a Base64 string via the `_encode_image_to_base64` method;  
2. The user‐provided text prompt and the aforementioned Base64 image are concatenated into a complete message body according to the model interface specification;  
3. This message body is then passed to the OpenAI‐style model for processing.

Instruction format example:
```python
# fmt : png & jpg
content = [
    {"type": "text",      "text": text_prompt},
    {"type": "image_url", "image_url": {"url": f"data:image/{fmt};base64,{b64}"}}
]
```

## Example Prompts

- OCR text recognition:  
  `self.prompt = "Please recognize and output all text present in the image."`

- Visual question answering:  
  `self.prompt = "What is the person doing in this image?"`

- Object detection and attribute extraction:  
  `self.prompt = "Extract main objects and their attributes from the image."`

---

Operator source code location:  
`/dataflow/statics/playground/playground/vqa.py`  

By customizing the prompt, you can quickly reuse this workflow to accomplish various vision-instruction tasks!