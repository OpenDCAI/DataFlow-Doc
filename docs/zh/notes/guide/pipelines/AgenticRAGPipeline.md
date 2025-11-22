---
title: AgenticRAG数据合成流水线
icon: solar:palette-round-linear
createTime: 2025/07/14 16:37:14  
permalink: /zh/guide/agenticrag_pipeline/  
---

# AgenticRAG数据合成流水线

## 1. 概述

**AgenticRAG数据合成流水线**旨在基于原始文本上下文，自动生成高质量、可验证的问答对，并对其进行质量评估，为后续的Agentic RAG训练（含强化学习奖励）提供高质量数据。

我们支持以下应用场景：

- 支持基于强化学习的 Agentic RAG 训练
- 从原始文本内容自动构建高质量的问题与答案对

流水线的主要流程包括：

1. **原子问答生成**：从文本内容中抽取并生成问题、答案、精炼答案与可替代答案等。
2. **质量评估**：对生成答案与黄金文档答案进行打分（如F1），以便下游训练使用。

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
run_dataflow/pipelines/api_pipelines/agentic_rag_pipeline.py  
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
`agentic_rag_pipeline.py`中的api_url填写方式如下：
```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o-mini",
        max_workers=500
)
```

### 第五步：一键运行
```bash
python pipelines/api_pipelines/agentic_rag_pipeline.py
```
此外，你可以根据自己的需求选择任意其他的Pipeline代码运行，其运行方式都是类似的。接下来，我们会介绍在Pipeline中使用到的算子以及如何进行参数配置。

## 3. 数据流与流程逻辑

### 1. **输入数据**

流水线的输入数据通常包含以下字段：

* *contents**：原始文本内容

这些输入数据可以存储在指定的文件（如`json`、`jsonl`）中，并通过`FileStorage`对象进行管理和读取。示例中会载入默认的数据路径，实际使用场景下可以根据需求修改路径以载入自定义的数据和缓存路径：

```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/AgenticRAGPipeline/eval_test_data.jsonl",
    cache_path="./agenticRAG_eval_cache",
    file_name_prefix="agentic_rag_eval",
    cache_type="jsonl",
)
```

### 2. **原子问答生成（AgenticRAGAtomicTaskGenerator）**

流程的第一步是使用**原子任务生成器**（`AgenticRAGAtomicTaskGenerator`）从文本中生成：问题、初始答案、精炼答案、可替代答案、在文档上下文与无上下文条件下的答案等。

**功能：**

* 从文本上下文生成问题与多种形式的答案
* 输出可用于评测与训练的结构化字段（问题、答案、精炼答案、可替代答案、LLM答案、黄金文档答案等）

**输入**：原始文本内容（`prompts`或示例中的`contents`）

**输出**：`question`、`answer`、`refined_answer`、`optional_answer`、`llm_answer`、`golden_doc_answer`、`identifier`、`candidate_tasks_str`、`llm_score`、`golden_doc_score`

```python
self.llm_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/chat/completions",
            model_name="gpt-4o-mini",
            max_workers=500
        )

atomic_task_generator = AgenticRAGAtomicTaskGenerator(
            llm_serving=self.llm_serving
        )

result = atomic_task_generator.run(
            storage = self.storage.step(),
            input_key = "contents",
        )
```

### 3. **问答生成质量评估（AgenticRAGQAF1SampleEvaluator）**

流程的第二步是使用**F1打分器**（`AgenticRAGQAF1SampleEvaluator`）为精炼答案与黄金文档答案之间的F1分数进行评估。这一步用于构建强化学习的奖励信号，保障训练质量。

**功能：**

* 对`refined_answer`与`golden_doc_answer`之间的重叠程度进行F1评估

**输入**：`refined_answer`、`golden_doc_answer`
**输出**：`F1Score`

```python
evaluator = AgenticRAGQAF1SampleEvaluator()
evaluator.run(
    storage=self.storage.step(),
    output_key="F1Score",
    input_prediction_key="refined_answer",
    input_ground_truth_key="golden_doc_answer"
)
```

### 4. **输出数据**

最终，流水线生成的输出数据将包含以下内容：

* **question**：模型生成的原子化问题
* **answer**：初始答案
* **refined_answer**：经过清洗优化的最终答案
* **optional_answer**：可接受的备选答案集合
* **llm_answer**：LLM在无上下文下的答案（用于评估）
* **golden_doc_answer**：基于原始文档抽取/生成的黄金标准答案
* **identifier**：从输入文本中提取的内容标识符
* **candidate_tasks_str**：候选任务与结论的JSON字符串
* **llm_score/golden_doc_score**：质量分数
* **F1Score**：基于`refined_answer`与`golden_doc_answer`计算得到的F1分数

## 4. 流水线示例

以下给出示例流水线，演示如何使用多个算子进行AgenticRAG数据处理。该示例展示了如何初始化一个AgenticRAG数据处理流水线，并顺序执行生成与评估步骤。

```python
import pandas as pd
from dataflow.operators.agentic_rag import AgenticRAGQAF1SampleEvaluator

from dataflow.operators.agentic_rag import (
    AgenticRAGAtomicTaskGenerator,
    AgenticRAGDepthQAGenerator,
    AgenticRAGWidthQAGenerator
)

from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class AgenticRAGEval_APIPipeline():

    def __init__(self, llm_serving=None):

        self.storage = FileStorage(
            first_entry_file_name="../example_data/AgenticRAGPipeline/eval_test_data.jsonl",
            cache_path="./agenticRAG_eval_cache",
            file_name_prefix="agentic_rag_eval",
            cache_type="jsonl",
        )

        self.llm_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/chat/completions",
            model_name="gpt-4o-mini",
            max_workers=500
        )

        self.task_step1 = AgenticRAGAtomicTaskGenerator(
            llm_serving=self.llm_serving
        )

        self.task_step2 = AgenticRAGQAF1SampleEvaluator()
        
    def forward(self):

        self.task_step1.run(
            storage = self.storage.step(),
            input_key = "contents",
        )

        self.task_step2.run(
            storage=self.storage.step(),
            output_key="F1Score",
            input_prediction_key="refined_answer",
            input_ground_truth_key="golden_doc_answer"
        )

if __name__ == "__main__":
    model = AgenticRAGEval_APIPipeline()
    model.forward()
```