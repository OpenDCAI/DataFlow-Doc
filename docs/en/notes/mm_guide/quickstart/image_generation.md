---
title: Text‑to‑Image Generation and Image Editing
createTime: 2025/07/15 22:39:14
permalink: /en/mm_guide/rzf2l7kq/
icon: basil:lightning-alt-outline
---

# Quick Start
To enable **DataFlow** to support image‑generation capabilities, we have implemented large‑scale image creation and editing using the latest diffusion‑based methods available in [diffusers](https://github.com/huggingface/diffusers). Additionally, we support using the nano banana (gemini-2.5-flash-image) API for image editing.

## Text‑to‑Image Generation
### Step 1 – Install the DataFlow environment
```shell
pip install open-dataflow
```

### Step 2 – Prepare the text‑prompt data for generation
```jsonl
{"conversations": [{"content": "a fox darting between snow-covered pines at dusk", "role": "user"}], "images": [""]}
{"conversations": [{"content": "a kite surfer riding emerald waves under a cloudy sky", "role": "user"}], "images": [""]}
```

Specify the data path:
```python
from dataflow.utils.storage import FileStorage

self.storage = FileStorage(
    first_entry_file_name="your path",
    cache_path="./cache_local",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl"
)
```

### Step 3 – Use a local model for image generation
```python
from dataflow.serving.local_image_gen_serving import LocalImageGenServing
from dataflow.io import ImageIO

self.serving = LocalImageGenServing(
    image_io=ImageIO(save_path=os.path.join(self.storage.cache_path, "images")),
    batch_size=4,
    hf_model_name_or_path="black-forest-labs/FLUX.1-dev",
    hf_cache_dir="~/.cache/huggingface",
    hf_local_dir="./ckpt/models/"
)
```

### Step 4 – Generate images
```python
from dataflow.operators import Text2ImageGenerator

self.generator = Text2ImageGenerator(pipe=self.serving)

self.generator.run(
    storage=self.storage.step(),
    input_conversation_key="conversations",
    output_image_key="images"
)
```

## Image Editing
The workflow is almost identical to text‑to‑image generation; only minor tweaks are required.

### Call a local model
```python
from dataflow.serving.local_image_gen_serving import LocalImageGenServing

self.serving = LocalImageGenServing(
    image_io=ImageIO(save_path=os.path.join(self.storage.cache_path, "images")),
    hf_model_name_or_path="black-forest-labs/FLUX.1-Kontext-dev",
    hf_cache_dir="./cache_local",
    hf_local_dir="./ckpt/models/",
    Image_gen_task="imageedit",
    batch_size=4,
    diffuser_model_name="FLUX-Kontext",
    diffuser_num_inference_steps=28,
    diffuser_guidance_scale=3.5,
)
```

### Prepare the data
```jsonl
{"conversations": [{"content": "Change the woman's clothes to a white dress.", "role": "user"}], "images": ["./dataflow/example/test_image_editing/images/image1.png"], "edited_images": [""]}
{"conversations": [{"content": "Change the vase to red.", "role": "user"}], "images": ["./dataflow/example/test_image_editing/images/image2.png"], "edited_images": [""]}
```

### Run the editing pipeline
```python
from dataflow.operators.core_vision import PromptedImageEditGenerator

self.generator = PromptedImageEditGenerator(pipe=self.serving)

self.generator.run(
    storage=self.storage.step(),
    input_image_key="images",
    input_conversation_key="conversations",
    output_image_key="edited_images",
)
```

### Calling nano-banana
We have currently integrated image editing using nano-banana. Referring to the image editing section above, you can run tests with nano-banana by simply modifying the corresponding serving component. The model invocation method is as follows:
```python
import os
from dataflow.serving.api_vlm_serving_openai import APIVLMServing_openai

os.environ['DF_API_KEY'] = args.api_key

self.serving = APIVLMServing_openai(
    api_url=api_url,
    model_name="gemini-2.5-flash-image-preview",               # try nano-banana
    image_io=ImageIO(save_path=os.path.join(self.storage.cache_path, "images")),
    send_request_stream=True,
)
```
The API we use is provided by [huiyun](http://123.129.219.111:3000)
