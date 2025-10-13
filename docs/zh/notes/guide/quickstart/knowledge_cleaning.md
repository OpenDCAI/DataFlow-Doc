---
title: 案例7. 私有化异构知识库清洗&一键定制训练集
createTime: 2025/07/18 17:31:15
permalink: /zh/guide/7s1yn8u5/
icon: basil:lightning-alt-outline
---


---

# 私有化异构知识库清洗&一键定制训练集

## 第一步:安装dataflow环境

​	从源码安装：

```shell
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .
pip install 'mineru[all]'
mineru-models-download
```

​	从PyPi安装：

```shell
pip install open-dataflow
pip install 'mineru[all]'
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
cd api_pipelines
export HF_ENDPOINT=https://hf-mirror.com
export DF_API_KEY=xxx
```

## 第四步:一键运行

```bash
python kbcleaning_pipeline.py 
```
[code](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/statics/pipelines/api_pipelines/kbcleaning_pipeline.py)

运行时，该流水线会先后调用：

1. FileOrURLToMarkdownConverterBatch  把原始文件/URL提取成Markdown
2. KBCChunkGenerator  将文本分段
3. KBCTextCleaner  针对分段文本做全面清洗
4. Text2MultiHopQAGenerator  基于清洗后知识合成QA数据

对于算子的具体功能介绍可以参考"知识库清洗和QA合成"部分，此处调用后会在`.cache 目录下`中生成一个json文件，文件内容如下文所示。

> Demo中只提供了两个Source用于功能展示。除此之外，Dataflow还为用户提供了一千篇Arxiv论文供用户测试功能。论文的主题包括LLM，数据库等。数据集链接：[Open-Dataflow/1k_arxiv · Datasets at Hugging Face](https://huggingface.co/datasets/Open-Dataflow/1k_arxiv) 您可以下载后将数据集整理成如下格式：
>
> ```jsonl
> {"source": "path/to/first.pdf"}
> {"source": "path/to/second.pdf"}
> ...
> ```
>
> 或者您可以直接把**论文对应的URL**整理成如下格式：
> ```jsonl
> {"source": "https://arxiv.org/pdf/2505.07773"}
> {"source": "https://arxiv.org/pdf/2503.09516"}
> ...
> ```
>
> 并通过下面方式配置您的路径文件/path/to/all_pdf.jsonl，即可实现大批量清洗知识库。
>
>
> ```python
> self.storage = FileStorage(
>     first_entry_file_name="/path/to/all_pdf.jsonl",
>     cache_path="./.cache/api",
>     file_name_prefix="batch_cleaning_step",
>     cache_type="json"
> )
> ```

## 合成数据示例

```json
[
  {
    "source":"..\/example_data\/KBCleaningPipeline\/bitter_lesson.pdf",
    "text_path":"..\/example_data\/KBCleaningPipeline\/raw\/mineru\/bitter_lesson\/vlm\/bitter_lesson.md",
    "raw_chunk":"# The Bitter Lesson\n\n# Rich Sutton\n\nMarch 13, 2019\n\nThe biggest lesson that can be read from 70 years of AI research is that general methods that leverage computation are ultimately the most effective, and by a large margin. The ultimate reason for this is Moore's law, or rather its generalization of continued exponentially falling cost per unit of computation. Most AI research has been conducted as if the computation available to the agent were constant (in which case leveraging human knowledge would be one of the only ways to improve performance) but, over a slightly longer time than a typical research project, massively more computation inevitably becomes available. Seeking an improvement that makes a difference in the shorter term, researchers seek to leverage their human knowledge of the domain, but the only thing that matters in the long run is the leveraging of computation. These two need not run counter to each other, but in practice they tend to. Time spent on one is time not spent on the other. There are psychological commitments to investment in one approach or the other. And the human-knowledge approach tends to complicate methods in ways that make them less suited to taking advantage of general methods leveraging computation. There were many examples of AI researchers' belated learning of this bitter lesson, and it is instructive to review some of the most prominent.\n\nIn computer chess, the methods that defeated the world champion, Kasparov, in 1997, were based on massive, deep search. At the time, this was looked upon with dismay by the majority of computer- chess researchers who had pursued methods that leveraged human understanding of the special structure of chess. When a simpler, search-based approach with special hardware and software proved vastly more effective, these human-knowledge-based chess researchers were not good losers. They said that `brute force\" search may have won this time, but it was not a general strategy, and anyway it was not how people played chess. These researchers wanted methods based on human input to win and were disappointed when they did not.\n\nA similar pattern of research progress was seen in computer Go, only delayed by a further 20 years. Enormous initial efforts went into avoiding search by taking advantage of human knowledge, or of the special features of the game, but all those efforts proved irrelevant, or worse, once search was applied effectively at scale. Also important was the use of learning by self play to learn a value function (as it was in many other games and even in chess, although learning did",
    "cleaned_chunk":"# The Bitter Lesson\n\n# Rich Sutton\n\nMarch 13, 2019\n\nThe biggest lesson that can be read from 70 years of AI research is that general methods that leverage computation are ultimately the most effective, and by a large margin. The ultimate reason for this is Moore's law, or rather its generalization of continued exponentially falling cost per unit of computation. Most AI research has been conducted as if the computation available to the agent were constant (in which case leveraging human knowledge would be one of the only ways to improve performance) but, over a slightly longer time than a typical research project, massively more computation inevitably becomes available. Seeking an improvement that makes a difference in the shorter term, researchers seek to leverage their human knowledge of the domain, but the only thing that matters in the long run is the leveraging of computation. These two need not run counter to each other, but in practice they tend to. Time spent on one is time not spent on the other. There are psychological commitments to investment in one approach or the other. And the human-knowledge approach tends to complicate methods in ways that make them less suited to taking advantage of general methods leveraging computation. There were many examples of AI researchers' belated learning of this bitter lesson, and it is instructive to review some of the most prominent.\n\nIn computer chess, the methods that defeated the world champion, Kasparov, in 1997, were based on massive, deep search. At the time, this was looked upon with dismay by the majority of computer-chess researchers who had pursued methods that leveraged human understanding of the special structure of chess. When a simpler, search-based approach with special hardware and software proved vastly more effective, these human-knowledge-based chess researchers were not good losers. They said that \"brute force\" search may have won this time, but it was not a general strategy, and anyway it was not how people played chess. These researchers wanted methods based on human input to win and were disappointed when they did not.\n\nA similar pattern of research progress was seen in computer Go, only delayed by a further 20 years. Enormous initial efforts went into avoiding search by taking advantage of human knowledge, or of the special features of the game, but all those efforts proved irrelevant, or worse, once search was applied effectively at scale. Also important was the use of learning by self play to learn a value function (as it was in many other games and even in chess, although learning did",
    "QA_pairs":[
      {
        "question":"Why are general methods leveraging computation considered most effective in AI according to Sutton?",
        "reasoning_steps":[
          {
            "step":"General methods leveraging computation are seen as most effective due to exponentially falling cost per unit of computation"
          },
          {
            "step":"AI research has typically assumed constant computation availability, making human knowledge a factor, but more computation becomes available over time"
          }
        ],
        "answer":"General methods are favored because exponentially increasing computational resources reduce costs, enabling greater efficiency than static human-knowledge-based approaches.",
        "supporting_facts":[
          "The biggest lesson that can be read from 70 years of AI research is that general methods that leverage computation are ultimately the most effective, and by a large margin.",
          "The ultimate reason for this is Moore's law, or rather its generalization of continued exponentially falling cost per unit of computation."
        ],
        "type":"AI_research"
      },
      {
        "question":"Why is leveraging computation more significant than leveraging human knowledge in AI research over time?",
        "reasoning_steps":[
          {
            "step":"Initially, leveraging human knowledge is pursued in AI research for short-term improvements when computation appears constant."
          },
          {
            "step":"Over the longer term, massively more computation becomes available, meaning leveraging computation is what ultimately impacts AI research performance."
          }
        ],
        "answer":"In the long run, the increase in available computation resources outpaces the benefits of leveraging human knowledge, making computation the crucial factor for AI research prowess.",
        "supporting_facts":[
          "Most AI research has been conducted as if the computation available to the agent were constant (in which case leveraging human knowledge would be one of the only ways to improve performance)",
          "over a slightly longer time than a typical research project, massively more computation inevitably becomes available"
        ],
        "type":"technology"
      },
      {
        "question":"Why does AI research focus differently on human knowledge and computation over time?",
        "reasoning_steps":[
          {
            "step":"Researchers initially focus on leveraging human knowledge due to constant computation availability."
          },
          {
            "step":"Over a longer time, massively more computation becomes available, shifting focus from human knowledge to computational leveraging."
          }
        ],
        "answer":"Initially, researchers rely on human knowledge due to constant computation, but as computation massively increases over time, leveraging computation becomes more significant.",
        "supporting_facts":[
          "Most AI research has been conducted as if the computation available to the agent were constant (in which case leveraging human knowledge would be one of the only ways to improve performance)",
          "massively more computation inevitably becomes available"
        ],
        "type":"AI research"
      },
      {
        "question":"How do human knowledge and computation create tensions in research strategies?",
        "reasoning_steps":[
          {
            "step":"Researchers seek to leverage human knowledge for short-term improvements."
          },
          {
            "step":"Only the leveraging of computation matters in the long run, creating a conflict with human knowledge focus."
          }
        ],
        "answer":"Focusing on human knowledge for short-term gains often conflicts with the long-term necessity to leverage computation.",
        "supporting_facts":[
          "Seeking an improvement that makes a difference in the shorter term, researchers seek to leverage their human knowledge of the domain.",
          "The only thing that matters in the long run is the leveraging of computation."
        ],
        "type":"research_strategy"
      },
      {
        "question":"Why might investing in one approach affect the other?",
        "reasoning_steps":[
          {
            "step":"Time spent on one is time not spent on the other"
          },
          {
            "step":"There are psychological commitments to investment in one approach or the other"
          }
        ],
        "answer":"Time limitations and psychological commitments mean focusing on one approach detracts from the other.",
        "supporting_facts":[
          "Time spent on one is time not spent on the other",
          "There are psychological commitments to investment in one approach or the other"
        ],
        "type":"psychology"
      }
    ],
    "QA_metadata":{
      "source":"default_source",
      "timestamp":"",
      "complexity":0.6173666667
    }
  }
]
```

