---
title: 案例7. 批量知识库清洗
createTime: 2025/07/18 17:31:15
permalink: /zh/guide/7s1yn8u5/
icon: basil:lightning-alt-outline
---


---

# 批量知识库清洗

## 第一步:安装dataflow环境

​	从源码安装：

```shell
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .
pip install -e .[mineru]
mineru-models-download
```

​	从PyPi安装：

```shell
pip install open-dataflow
pip install open-dataflow[mineru]
mineru-models-download
```



## 第二步:创建新的dataflow工作文件夹

```shell
mkdir run_dataflow
cd run_dataflow
```

## 第三步:初始化Dataflow

```shell
dataflow init
```

​	进入脚本目录：

```shell
cd gpu_pipelines/
```

## 第四步:一键运行

```bash
python kbcleaning_pipeline_batch_sglang.py
```

运行时，该流水线会先后调用：

1. FileOrURLToMarkdownConverter  把原始文件/URL提取成Markdown
2. CorpusTextSplitter  将文本分段
3. KnowledgeCleaner  针对分段文本做全面清洗
4. MultiHopQAGenerator  基于清洗后知识合成QA数据

对于算子的具体功能介绍可以参考"知识库清洗和QA合成"部分，此处调用后会在`.cache 目录下`中生成一个json文件，文件内容如下文所示。

> Demo中只提供了两个Source用于功能展示。除此之外，Dataflow还为用户提供了一千篇Arxiv论文供用户测试功能。论文的主题包括LLM，数据库等。数据集链接：[Open-Dataflow/1k_arxiv · Datasets at Hugging Face](https://huggingface.co/datasets/Open-Dataflow/1k_arxiv) 您可以下载后将数据集整理成如下格式：
>
> ```jsonl
> {"raw_content": "path/to/first.pdf"}
> {"raw_content": "path/to/second.pdf"}
> ...
> ```
>
> 或者您可以直接把**论文对应的URL**整理成如下格式：
> ```jsonl
> {"raw_content": "https://arxiv.org/pdf/2505.07773"}
> {"raw_content": "https://arxiv.org/pdf/2503.09516"}
> ...
> ```
>
> 并通过下面方式配置您的路径文件/path/to/all_pdf.jsonl，即可实现大批量清洗知识库。
>
>
> ```python
> self.storage = FileStorage(
>     first_entry_file_name="/path/to/all_pdf.jsonl",
>     cache_path="./.cache/gpu",
>     file_name_prefix="batch_cleaning_step",
>     cache_type="json"
> )
> ```

## 合成数据示例

```json
[
  {
    "raw_content":"..\/example_data\/KBCleaningPipeline\/bitter_lesson.pdf",
    "text_path":"..\/example_data\/KBCleaningPipeline\/raw\/mineru\/bitter_lesson\/auto\/bitter_lesson.md",
    "chunk_path":"..\/example_data\/KBCleaningPipeline\/raw\/mineru\/bitter_lesson\/auto\/extract\/bitter_lesson_chunk.json",
    "cleaned_chunk_path":"..\/example_data\/KBCleaningPipeline\/raw\/mineru\/bitter_lesson\/auto\/extract\/bitter_lesson_chunk.json",
    "enhanced_chunk_path":"..\/example_data\/KBCleaningPipeline\/raw\/mineru\/bitter_lesson\/auto\/extract\/bitter_lesson_chunk.json"
  },
  {
    "raw_content":"https:\/\/trafilatura.readthedocs.io\/en\/latest\/quickstart.html",
    "text_path":"..\/example_data\/KBCleaningPipeline\/raw\/crawled\/crawled_2.md",
    "chunk_path":"..\/example_data\/KBCleaningPipeline\/raw\/crawled\/extract\/crawled_2_chunk.json",
    "cleaned_chunk_path":"..\/example_data\/KBCleaningPipeline\/raw\/crawled\/extract\/crawled_2_chunk.json",
    "enhanced_chunk_path":"..\/example_data\/KBCleaningPipeline\/raw\/crawled\/extract\/crawled_2_chunk.json"
  }
]
```

每个路径代表某个阶段，对"raw_content"指代的知识库清洗的结果。某个文件最终呈现的状态如下所示（片段）：

```json
{
    "raw_chunk": "# The Bitter Lesson 🧠\n\nRich Sutton\n\nMarch 13, 2019\n\nThe biggest lesson that can be read from 70 years of AI research is that general methods that leverage computation are ultimately the *most effective*, and by a large margin… The ultimate reason is Moore's law &mdash; or rather its generalization: continued exponentially falling cost per unit of computation. Most AI research has been conducted as if computation were constant (in which case 'leveraging human knowledge' would be one of the only ways to improve performance); but—over a slightly longer time than a typical research project—massively more computation inevitably becomes available.\n\n“Seeking an improvement” that makes a difference in the shorter term, researchers seek to leverage their human knowledge of the domain, but the only thing that matters in the long run is the leveraging of computation. These two need not run counter to each other, but in practice, they tend to. Time spent on one is time — not spent on the other.\n\nThere are psychological commitments to investment in one approach or the other. And the human‑knowledge approach tends to complicate methods in ways that make them less suited to taking advantage of general methods leveraging computation.\n\n> Note: This paragraph ends abruptly & wasn’t cleaned.\n\nAlso, some HTML entities like &ldquo; &rdquo; remain. 😊\n\nAnd some weird line breaks:\nLine one.\nLine two.    \n\nEnd.",
    "cleaned_chunk": "# The Bitter Lesson\n\nRich Sutton\n\nMarch 13, 2019\n\nThe biggest lesson that can be read from 70 years of AI research is that general methods that leverage computation are ultimately the most effective, and by a large margin. The ultimate reason for this is Moore's law, or rather its generalization of continued exponentially falling cost per unit of computation. Most AI research has been conducted as if the computation available to the agent were constant (in which case leveraging human knowledge would be one of the only ways to improve performance) but, over a slightly longer time than a typical research project, massively more computation inevitably becomes available. Seeking an improvement that makes a difference in the shorter term, researchers seek to leverage their human knowledge of the domain, but the only thing that matters in the long run is the leveraging of computation. These two need not run counter to each other, but in practice they tend to. Time spent on one is time not spent on the other. There are psychological commitments to investment in one approach or the other. And the human-knowledge approach tends to complicate methods in ways that make them less suited to taking advantage of general methods leveraging computation.  There were many examples of AI researchers' belated learning of this bitter",
    "qa_pairs": {
        "qa_pairs": [
            {
                "question": "Why do general methods leveraging computation play a greater role in improving AI performance over time?",
                "reasoning_steps": [
                    {
                        "step": "According to Moore's law or its generalization, the cost of computation decreases exponentially."
                    },
                    {
                        "step": "Most AI research assumes that computational resources are constant over the duration of a typical research project, so knowledge leverage is necessary."
                    }
                ],
                "answer": "The exponential fall in the cost of computation over time allows for the use of more powerful and general methods that can better harness computational resources, ultimately leading to improved AI performance.",
                "supporting_facts": [
                    "But, over a slightly longer time than a typical research project, massively more computation inevitably becomes available",
                    "Most AI research has been conducted as if the computation available to the agent were constant (in which case leveraging human knowledge would be one of the only ways to improve performance)"
                ],
                "type": "machine_learning_algorithms"
            },
            ...
            {
                "question": "Why does the psychological commitment to a specific approach hinder the investment in more general AI methods?",
                "reasoning_steps": [
                    {
                        "step": "The human-knowledge approach complicates methods"
                    },
                    {
                        "step": "These complicated methods reduce the ability to leverage general computational methods"
                    }
                ],
                "answer": "Psychological commitments to a specific approach, such as the human-knowledge approach, hinder the investment in more general AI methods by making them less adaptable and leveraging general computational advantages.",
                "supporting_facts": [
                    "\"And the human-knowledge approach tends to complicate methods in ways that make them less suited to taking advantage of general methods leveraging computation\"",
                    "\"There were many examples of AI researchers' warranted skepticism of shifting abruptly to more optimistic views after learning these complications\""
                ],
                "type": "AI(px)"
            }
        ],
        "metadata": {
            "source": "default_source",
            "timestamp": "",
            "complexity": 0.7137777777777776
        }
    }
}
```