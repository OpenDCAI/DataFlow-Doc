---
title: 案例6. 数学问题提取
createTime: 2025/07/16 20:10:28
icon: teenyicons:receipt-outline
permalink: /zh/guide/zchbl7uk/
---

# 快速开始：数学问题提取

本示例展示如何使用 Dataflow 中的 `MathBookQuestionExtract` 算子，自动从教材 PDF 中提取数学题目，并生成 JSON/Markdown 格式的输出。

## 1 环境及依赖

1. 安装 Dataflow 与 MinerU 依赖  
   ```shell
   pip install "open-dataflow[mineru]"
   ```  
   或者从源码安装：
   ```shell
   pip install -e ".[mineru]"
   ```

2. 下载 MinerU 模型权重  
   ```shell
   mineru-models-download
   ```

> 本算子基于 MinerU 实现 PDF 内容切分与图像抽取，请确保安装并下载模型权重成功。

## 2 配置 LLM Serving

当前算子仅支持基于 API 的 VLM Serving。请在运行前设置好 API 地址和 Key。

- Linux / macOS：
  ```shell
  export DF_API_KEY="sk-xxxxx"
  ```
- Windows PowerShell：
  ```powershell
  $env:DF_API_KEY = "sk-xxxxx"
  ```

后续在代码中会通过环境变量读取该 API Key，无需在脚本中明文填写。

## 3 准备测试 PDF

示例仓库自带一份测试 PDF：  
```
./dataflow/example/KBCleaningPipeline/questionextract_test.pdf
```  
你也可以替换为任意数学教材或习题集 PDF。

## 4 初始化并修改脚本

首先，在任意位置创建一个新的 `run_dataflow` 文件夹，并进入该目录，然后执行 Dataflow 项目初始化：

```shell
mkdir run_dataflow
cd run_dataflow
dataflow init
```

初始化完成后，项目目录下会出现以下文件：

```shell
run_dataflow/playground/mathbook_extract.py
```

该脚本的内容如下：

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
    # 1. 初始化 LLM Serving
    llm_serving = APIVLMServing_openai(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="o4-mini",      # 推荐使用强推理模型
        max_workers=20             # 并发请求数
    )

    # 2. 构造并运行提取管道
    pipeline = QuestionExtractPipeline(llm_serving)
    pipeline.forward(
        pdf_path=pipeline.test_pdf,
        output_name="test_question_extract",
        output_dir="./output"
    )
```

### 关键参数说明

- `api_url`：OpenAI VLM 接口地址  
- `key_name_of_api_key`：环境变量名称  
- `model_name`：模型名称（如 `o4-mini`，建议使用强推理模型）  
- `max_workers`：并发请求数量


### 算子逻辑

算子的完整实现位于  
`dataflow/operators/generate/KnowledgeCleaning/mathbook_question_extract.py`  
下面从整体流程出发，对各关键环节做简要而不失细节的说明，便于使用和二次开发：

1. PDF 文件切割  
   - 利用 `pymupdf`（fitz）打开目标 PDF，将每一页按设定的 DPI 渲染成高质量的 JPEG 图片。  
   - 图片按页编号保存到指定输出目录，并通过日志记录每一页的转换进度，确保可追溯性。

2. 调用 MinerU 进行内容识别与图片提取  
   - 动态导入 `mineru` 模块，若未安装则抛出友好提示，指导用户完成 `pip install mineru[pipeline]` 和模型下载。  
   - 通过环境变量 `MINERU_MODEL_SOURCE=local` 指定从本地加载模型，支持后端选项 `"vlm-sglang-engine"` 或 `"pipeline"`。  
   - 执行命令行工具：  
```shell
    mineru -p <pdf_file> -o <output_folder> -b <backend> --source local  
```
   - 命令执行后会在中间目录下生成 `*_content_list.json`（结构化内容清单）和原始切割出的图片文件夹。

3. 整理与重命名图片资源  
   - 读取 MinerU 产出的 `content_list.json`，筛选出所有 `type=='image'` 项。  
   - 将对应的图片从 MinerU 的临时目录复制到最终结果文件夹，并按序重命名为 `0.jpg, 1.jpg...`。  
   - 同时生成一份新的 JSON 清单，记录每张图片在源 PDF 中的页码及新文件路径。

4. 组织模型调用指令  
   - 从 `dataflow.prompts.kbcleaning.KnowledgeCleanerPrompt` 中获取预定义的文本提示（`mathbook_question_extract_prompt`），明确任务要求和格式规范。  
   - 将渲染好的指令与多张输入图片（页图、插图）打包，为后续并发调用 LLM 服务做准备。

5. 并发获取模型响应  
   - 使用 `APIVLMServing_openai`（或其他 `LLMServingABC` 实现）并结合 `ThreadPoolExecutor`，将打包好的图片列表与标签并发提交给模型。  
   - 可自定义模型名称、API 地址、并发数和超时时间，灵活满足不同性能与成本需求。

6. 解析并保存最终输出  
   - 在 `analyze_and_save` 方法中，通过正则表达式精准抓取模型返回文本内的 `<image>index.jpg</image>` 标签。  
   - 将标签中引用的对应图片复制到结果目录的 `images/` 子文件夹。  
   - 以两种格式输出结果：  
     a. JSON 文件：按顺序保存各题的纯文本（已剔除标签）和对应图片路径列表  
     b. Markdown 文件：原文中以 `![](images/xx.jpg)` 形式嵌入图片，易于可视化查看  
   - 输出文件统一保存在用户指定的结果文件夹下，便于后续校验和二次使用。



## 5 运行脚本

```shell
python generate_question_extract_api.py
```

执行完成后，`./output` 目录下将产生：

- `test_question_extract.json`  
  每条记录包含：
  - `text`：提取到的题目文本  
  - `pics`：题目涉及的图片路径列表  
- `test_question_extract.md`  
  以 Markdown 形式展示题目与配图

## 6 可选扩展

- 自定义提示词：若需调整系统提示，可在算子内部替换：
  ```python
  from dataflow.prompts.kbcleaning import KnowledgeCleanerPrompt
  system_prompt = KnowledgeCleanerPrompt().mathbook_question_extract_prompt()
  ```
- 参数定制：支持切换 MinerU 后端（`pipeline` | `vlm-sglang-engine`）、调整 DPI、并发数等，详见算子 `run` 方法签名。