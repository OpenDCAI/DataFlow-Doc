---
title: RARE数据合成流水线
icon: game-icons:great-pyramid
createTime: 2025/09/20 20:00:31
permalink: /zh/guide/rare_pipeline/  
---

# RARE RARE数据合成流水线

## 1. 概述

**RARE (Retrieval-Augmented Reasoning Modeling) 数据合成流程** 是一个旨在通过解耦知识存储和推理优化来提升大型语言模型（LLM）在特定领域智能的端到端框架。RARE方法的核心思想是：
- **知识外化**：将领域知识存储在可检索的外部来源中。
- **推理内化**：在训练过程中，让模型专注于学习和内化特定领域的推理模式。

该流程可以从给定的文档中，生成高质量的、知识和推理密集型的训练数据，使轻量级模型也能实现顶尖的性能，甚至超越像 GPT-4 和 DeepSeek-R1 这样的大型模型。

### 依赖安装
RAREPipeline中的`BM25HardNeg`算子依赖于`pyserini`, `gensim`和`JDK`。Linux配置方法如下：
```bash
sudo apt install openjdk-21-jdk
pip install pyserini gensim
```

---

## 2. 数据流与流程逻辑

### 1. **输入数据**

流程的起始输入数据仅包含一个核心字段：

* **text**：任何领域的纯文本文档内容。

这些数据通过 `FileStorage` 对象进行管理，您可以轻松配置输入文件路径、缓存路径和文件格式。

```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/AgenticRAGPipeline/pipeline_small_chunk.json",
    cache_path="./cache_local",
    file_name_prefix="dataflow_cache_step",
    cache_type="json",
)
```

### 2. **生成知识和推理密集型问题 (Doc2Query)**

流程的第一步是使用 **`Doc2Query`** 算子。它会根据输入的文档，利用大语言模型（LLM）生成需要复杂推理才能回答的问题和场景。这些问题被设计为独立于原始文档，但答案的推理过程需要文档中的知识作为支撑。

**功能：**

- 为每个文档生成一个自包含的、需要深度推理的问题和场景。
- 问题旨在考察高阶思维能力，如分析、评估和综合。
- 问题的回答需要依靠文档中的知识。

**输入**: 原始 `text` 内容。 **输出**: 新增 `question` 和 `scenario` 字段。

```
# 在 RAREPipeline 中的调用
self.doc2query_step1.run(
    storage = self.storage.step(),
    input_key = "text",
)
```

### 3. **挖掘困难负样本 (BM25HardNeg)**

流程的第二步是使用 **`BM25HardNeg`** 算子。在生成了问题之后，这一步利用 BM25 算法为每个问题从整个数据集中检索并筛选出“困难负样本”。这些负样本在文本上与“正确”的文档（正样本）相似，但在逻辑上无法用于回答问题，从而增加了模型在后续推理步骤中的挑战。

**功能：**

- 基于生成的问题，使用 BM25 算法检索相关文档作为干扰项。
- 筛选出与正样本相似但无关的困难负样本，用于增强模型的辨别能力。

**输入**: `question` (查询) 和 `text` (正样本)。 **输出**: 新增 `hard_negatives` 字段，包含一组困难负样本。

```
# 在 RAREPipeline 中的调用
self.bm25hardneg_step2.run(
    storage = self.storage.step(),
    input_question_key = "question",
    input_text_key = "text",
    output_negatives_key = "hard_negatives",
)
```

### 4. **蒸馏推理过程 (ReasonDistill)**

流程的最后一步是 **`ReasonDistill`** 算子。它将问题、场景、一个正样本和多个困难负样本组合在一起，构建一个复杂的提示（Prompt）。然后，它利用一个强大的“教师”LLM（如 GPT-4o）来生成一个详细的、分步的推理过程（Chain-of-Thought），展示如何利用提供的（真假混合的）信息来最终回答问题。

**功能：**

- 将正样本和困难负样本随机混合，模拟真实世界中信息检索的噪声环境。
- 提示一个强大的“教师”模型，生成一个详细的、可供“学生”模型学习的推理链。

**输入**: `text` (正样本), `question`, `scenario`, 和 `hard_negatives`。 

**输出**: 新增 `reasoning` 字段，包含由教师模型生成的详细推理过程。

```
# 在 RAREPipeline 中的调用
self.reasondistill_step3.run(
    storage= self.storage.step(),
    input_text_key = "text",
    input_question_key = "question",
    input_scenario_key = "scenario",
    input_hardneg_key = "hard_negatives",
    output_key= "reasoning",
)
```

## 3. 运行完整流程

以下是运行完整 `RAREPipeline` 的示例代码。它依次执行上述三个步骤，将原始文档逐步转化为包含问题、场景、困难负样本和详细推理过程的高质量训练数据。

```python
from dataflow.operators.rare import (
    Doc2Query,
    BM25HardNeg,
    ReasonDistill,
)
from dataflow.utils.storage import FileStorage
from dataflow.serving.api_llm_serving_request import APILLMServing_request
from dataflow.serving.local_model_llm_serving import LocalModelLLMServing_vllm

class RAREPipeline():
    def __init__(self):

        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/RAREPipeline/pipeline_small_chunk.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="json",
        )

        # 使用 API 服务器作为 LLM 服务，可以修改为LocalModelLLMServing_vllm以使用本地模型
        llm_serving = APILLMServing_request(
                api_url="https://api.openai.com/v1/chat/completions",
                key_name_of_api_key="OPENAI_API_KEY",
                model_name="gpt-4o",
                max_workers=1
        )

        self.doc2query_step1 = Doc2Query(llm_serving)
        self.bm25hardneg_step2 = BM25HardNeg()
        self.reasondistill_step3 = ReasonDistill(llm_serving)

    def forward(self):

        self.doc2query_step1.run(
            storage = self.storage.step(),
            input_key = "text",
        )

        self.bm25hardneg_step2.run(
            storage = self.storage.step(),
            input_question_key = "question",
            input_text_key = "text",
            output_negatives_key = "hard_negatives",
        )

        self.reasondistill_step3.run(
            storage= self.storage.step(),
            input_text_key = "text",
            input_question_key = "question",
            input_scenario_key = "scenario",
            input_hardneg_key = "hard_negatives",
            output_key= "reasoning",
        )

if __name__ == "__main__":
    model = RAREPipeline()
    model.forward()
```