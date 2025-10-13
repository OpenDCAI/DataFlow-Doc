---
title: AIGC 图像生成与评估
createTime: 2025/07/15 22:38:45
permalink: /zh/mm_guide/5ub4phag/
icon: basil:lightning-alt-outline
---

# 快速开始
为了让DataFlow可以支持图片生成功能，我们基于[diffuser](https://github.com/huggingface/diffusers)中最新的图片生成方法实现大规模的图像生成与编辑，与此同时，我们支持了nano banana（gemini-2.5-flash-image）api对图片进行编辑。

## 文本到图片生成
### 第一步:安装dataflow环境
```shell
pip install open-dataflow
```

### 第二步:准备用于生成图片的文本提示词数据
```jsonl
{"conversations": [{"content": "a fox darting between snow-covered pines at dusk", "role": "user"}], "images": [""]}
{"conversations": [{"content": "a kite surfer riding emerald waves under a cloudy sky", "role": "user"}], "images": [""]}
```
提供上述格式的数据，并且将数据路径填入
```python
from dataflow.utils.storage import FileStorage

self.storage = FileStorage(
    first_entry_file_name="your path",
    cache_path="./cache_local",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl"
)
```

### 第二步:(如果选择本地模型进行图片生成)
本地模型调用方式如下，注意我们使用对应的IO类来控制文件的输入以及输出：
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

### 第四步:进行图片生成
根据如下脚本可完成生图任务
```python
from dataflow.operators import Text2ImageGenerator

self.generator = Text2ImageGenerator(pipe=self.serving)

self.generator.run(
    storage=self.storage.step(),
    input_conversation_key="conversations",
    output_image_key="images"
)
```

## 图片编辑
该任务和文本到图片生成基本一致，需要对模型调用、数据准备以及算子调用进行一定的微调

本地模型调用方式如下：
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

数据准备调整如下：
```jsonl
{"conversations": [{"content": "Change the woman's clothes to a white dress.", "role": "user"}], "images": ["./dataflow/example/test_image_editing/images/image1.png"], "edited_images": [""]}
{"conversations": [{"content": "Change the vase to red.", "role": "user"}], "images": ["./dataflow/example/test_image_editing/images/image2.png"], "edited_images": [""]}
```

生成脚本调整如下：
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

### 调用nano-banana
目前我们接入了使用nano-banana对图片进行编辑，参考前文的图片编辑，只要修改对应的serving即可运行nano-banana进行测试。模型调用方式如下所示：
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
我们所使用的api来自于[huiyun](http://123.129.219.111:3000)
