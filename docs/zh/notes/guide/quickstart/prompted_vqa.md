---
title: 案例6. 图像问答 (VQA)
createTime: 2025/07/16 20:10:28
icon: heroicons:camera
permalink: /zh/guide/p5555dgx/
---

# 快速开始：图像问答 (VQA) 算子

VQA 算子支持用户定义一个文字 Prompt，然后接受一个 JSON 文件，每条记录传入一个图片路径，VQA 算子会把图片和文字 Prompt 一起发给模型进行推理。只需简单几步即可完成 OCR、图像问答、图片信息提取等任务。

## 第一步：安装 Dataflow

```shell
pip install open-dataflow
```

### 第二步:创建新的dataflow工作文件夹
```shell
mkdir run_dataflow
cd run_dataflow
```
### 第三步:初始化Dataflow
```shell
dataflow init
```
初始化后你会看到：
```shell
run_dataflow/playground/vqa.py
```

## 第三步：配置 API Key

如果使用 OpenAI API，需要先设置环境变量：

Linux/Mac:
```shell
export DF_API_KEY="sk-xxxxxx"
```

Windows PowerShell:
```powershell
$env:DF_API_KEY = "sk-xxxxxx"
```

## 第四步：准备图片路径数据

在项目根目录下创建一个 JSON 文件，比如 `pic_path.json`，内容格式如下：

```json
[
  {"raw_content": "/absolute/path/to/image1.jpg"},
  {"raw_content": "/absolute/path/to/image2.png"}
]
```

传入算子的字段名会被算子读取并作为图片路径传入模型，默认名称为 `raw_content` ，可以在调用脚本中自定义字段名。**图片格式必须为jpg(jpeg)或png**。

## 第五步：根据需求修改和使用vqa脚本

参考以下示例代码：

```python
from dataflow.operators.generate.Vqa.PromptedVQAGenerator import PromptedVQAGenerator
from dataflow.serving.APIVLMServing_openai import APIVLMServing_openai
from dataflow.utils.storage import FileStorage

class Vqa_generator:
    def __init__(self):
        # 自定义 Prompt，根据需求可改为 OCR、信息提取等
        self.prompt = "Describe the image in detail."

        # 指定输入文件和缓存目录
        self.storage = FileStorage(
            first_entry_file_name="pic_path.json",
            cache_path="./cache",
            file_name_prefix="vqa",
            cache_type="json",
        )

        # 调用 OpenAI 接口
        self.llm_serving = APIVLMServing_openai(
            model_name="o4-mini",
            api_url="https://api.openai.com/v1",
            key_name_of_api_key="DF_API_KEY",
        )

        # 构建 VQA 算子
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

### 参数说明：
- `self.prompt`：用于指导模型进行描述、问答、OCR 等
- `storage.step()`：会依次读取 `pic_path.json` 中的每一条 `raw_content`
- 结果会被写入 `./cache/vqa-0.json`、`vqa-1.json` 等文件，格式如下：

  ```json
  {
    "raw_content": "/absolute/path/to/image1.jpg",
    "result": "A close-up photo of a red apple on a wooden table."
  }
  ```
- 我们提供了运行此算子用的示例文件`dataflow/example/Vqa/pic_path.json`，填入自己的api-url和api-key即可一键体验vqa算子。

### 算子逻辑说明
本算子基于 dataflow/serving/APIVLMServing_openai.py 中的 APIVLMServing_openai 实现，主要完成 OpenAI 风格的图像问答基础功能，并内置并发调用机制。其工作流程如下：

1. 服务端通过 `_encode_image_to_base64` 方法将输入图片编码为 Base64 字符串；  
2. 将用户提供的文本 prompt 与上述 Base64 图片按模型接口规范拼接为完整的消息体；  
3. 将该消息体传递给 OpenAI 风格的模型进行处理。

指令格式示例：
```python
# fmt : png & jpg
content = [
    {"type": "text",      "text": text_prompt},
    {"type": "image_url", "image_url": {"url": f"data:image/{fmt};base64,{b64}"}}
]
```

## 示例 Prompt

- OCR 文字识别：  
  `self.prompt = "Please recognize and output all text present in the image."`

- 针对图像问答：  
  `self.prompt = "What is the person doing in this image?"`

- 物体检测与属性提取：  
  `self.prompt = "Extract main objects and their attributes from the image."`

---

算子源码位置：  
`/dataflow/statics/playground/playground/vqa.py`  

通过自定义 Prompt，你可以快速复用该流程完成各种视觉指令任务！