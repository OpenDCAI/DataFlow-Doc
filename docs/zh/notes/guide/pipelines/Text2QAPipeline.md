---
title: Text-to-QA数据合成流水线
icon: solar:palette-round-linear
createTime: 2025/06/16 13:08:42  
permalink: /zh/guide/textqa_pipeline/  
---

# Text-to-QA 数据合成流程

## 1. 概述

**Text-to-QA数据合成流水线**用于从原始文本内容中自动生成高质量的问答对，并对问答质量进行评估，可直接用于文档问答训练数据的构建。

我们支持以下应用场景：

- 基于文档问答的训练数据合成
- 从提供文本中自动构建高质量的问题与答案对

流水线的主要流程包括：

1. **内容选择**：从海量文本中选择代表性内容作为问答生成的依据。
2. **问答生成**：基于文本内容生成问题与答案。
3. **质量评估**：从多个维度对问答对进行质量评分与反馈。

## 2. 快速开始

### 第一步：安装dataflow环境
```shell
pip install open-dataflow
```

### 第二步：创建新的dataflow工作文件夹
```shell
mkdir run_dataflow
cd run_dataflow
```

### 第三步：初始化Dataflow
```shell
dataflow init
```
这时你会看见
```shell
run_dataflow/pipelines/api_pipelines/text2qa_pipeline.py  
```

### 第四步：填入你的api key以及api_url
对于Linux和Mac OS
```shell
export DF_API_KEY="sk-xxxxx"
```

对于Windows
```powershell
$env:DF_API_KEY = "sk-xxxxx"
```
`text2qa_pipeline.py`中的api_url填写方式如下：
```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=1
)
```

### 第五步：一键运行
```bash
python pipelines/api_pipelines/text2qa_pipeline.py
```
此外，你可以根据自己的需求选择任意其他的Pipeline代码运行，其运行方式都是类似的。接下来，我们会介绍在Pipeline中使用到的算子以及如何进行参数配置。

## 3. 数据流与流水线逻辑

### 1. **输入数据**

该流程的输入数据包括以下字段：

* **text**：原始文本内容

这些输入数据可以存储在指定的文件中（如 `json` 或 `jsonl`），并通过 `FileStorage` 对象进行管理和读取。在提供的示例中，默认数据路径被加载。在实际使用中，你可以修改路径以加载自定义数据和缓存路径：

```python
self.storage = FileStorage(
            first_entry_file_name="../example_data/core_text_data/pipeline_small_chunk.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="json",
        )
```

### 2. **内容选择（KCenterGreedyFilter）**

#### 2.1 **样本采样**

流程的第一步是使用 **采样器** 算子（`KCenterGreedyFilter`）从大型数据集中采样一部分文本内容。这一步至关重要，因为它决定了哪些文本内容将用于后续的生成流程。

**功能：**

* 从一组文本上下文中识别并选择具有代表性的文本内容。

**输入**：原始文本内容

**输出**：已选择的文本内容

```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=1
)

embedding_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/embeddings",
            model_name="text-embedding-ada-002",
            max_workers=100
)

self.content_chooser_step1 = KCenterGreedyFilter(embedding_serving=embedding_serving, num_samples=5)

result = self.content_chooser_step1.run(
            storage = self.storage.step(),
            input_key = "text"
        )
```

### 3. **问答生成（Text2QAGenerator）**

流程的第二步是使用**问答生成器**（`Text2QAGenerator`）为每个文本内容生成多个问题与答案。

**功能：**

* 根据文本内容直接生成问题与答案；可配置问题数量

**输入**：已选择的文本内容  
**输出**：生成的提示、问题与答案

```python
self.text2qa_generator_step3 = Text2QAGenerator(self.llm_serving)
result = self.text2qa_generator_step3.run(
            storage = self.storage.step(),
            input_key="text",
            input_question_num=3,
            output_prompt_key="generated_prompt",
            output_quesion_key="generated_question",
            output_answer_key="generated_answer"
        )
```

### 4. **问答质量评估（Text2QASampleEvaluator）**

流程的第三步是使用**问答评分器**（`Text2QASampleEvaluator`）对生成的问答对进行质量评估，为每个问答对提供多维度评分与反馈。

**功能：**

* 从问题质量、答案契合度、答案可验证性等维度评估问答对并产出反馈

**输入**：生成的问答对  
**输出**：每个问答对的评估分数和反馈

```python
self.text2qa_scorer_step4 = Text2QASampleEvaluator(self.llm_serving)
result = self.text2qa_scorer_step4.run(
            storage = self.storage.step(),
            input_question_key="generated_question",
            input_answer_key="generated_answer",
            output_question_quality_key="question_quality_grades",
            output_question_quality_feedback_key="question_quality_feedbacks",
            output_answer_alignment_key="answer_alignment_grades",
            output_answer_alignment_feedback_key="answer_alignment_feedbacks",
            output_answer_verifiability_key="answer_verifiability_grades",
        )
```

### 5. **输出数据**

最终，流水线生成的输出数据将包含以下内容：

* **generated_prompt**：生成的提示语
* **generated_question**：生成的问题
* **generated_answer**：生成的答案
* **question_quality_grades**：问题质量评分
* **question_quality_feedbacks**：问题质量反馈
* **answer_alignment_grades**：答案契合度评分
* **answer_alignment_feedbacks**：答案契合度反馈
* **answer_verifiability_grades**：答案可验证性评分

## 4. 流水线示例

以下给出示例流水线，展示如何串联内容选择、问答生成与质量评估。

```python
from dataflow.operators.core_text import (
    Text2QASampleEvaluator,
    Text2QAGenerator,
    KCenterGreedyFilter
)

from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.serving import LocalModelLLMServing_vllm

class AgenticRAG_APIPipeline():
    def __init__(self):

        self.storage = FileStorage(
            first_entry_file_name="../example_data/core_text_data/pipeline_small_chunk.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="json",
        )

        # use API server as LLM serving
        self.llm_serving = APILLMServing_request(
                api_url="https://api.openai.com/v1/chat/completions",
                model_name="gpt-4o",
                max_workers=1
        )

        embedding_serving = APILLMServing_request(
                    api_url="https://api.openai.com/v1/embeddings",
                    model_name="text-embedding-ada-002",
                    max_workers=100
        )

        self.content_chooser_step1 = KCenterGreedyFilter(embedding_serving=embedding_serving, num_samples=5)

        self.text2qa_generator_step3 = Text2QAGenerator(self.llm_serving)

        self.text2qa_scorer_step4 = Text2QASampleEvaluator(self.llm_serving)
        
    def forward(self):

        self.content_chooser_step1.run(
            storage = self.storage.step(),
            input_key = "text"
        )

        self.text2qa_generator_step3.run(
            storage = self.storage.step(),
            input_key="text",
            input_question_num= 3,
            output_prompt_key="generated_prompt",
            output_quesion_key="generated_question",
            output_answer_key="generated_answer"
        )

        self.text2qa_scorer_step4.run(
            storage = self.storage.step(),
            input_question_key="generated_question",
            input_answer_key="generated_answer",
            output_question_quality_key="question_quality_grades",
            output_question_quality_feedback_key="question_quality_feedbacks",
            output_answer_alignment_key="answer_alignment_grades",
            output_answer_alignment_feedback_key="answer_alignment_feedbacks",
            output_answer_verifiability_key="answer_verifiability_grades",
        )
        
if __name__ == "__main__":
    model = AgenticRAG_APIPipeline()
    model.forward()
```