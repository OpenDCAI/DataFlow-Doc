---
title: Case 8. Converting Massive PDFs to QAs 
createTime: 2025/07/18 17:31:06
permalink: /en/guide/j95zcdmj/
icon: basil:lightning-alt-outline
---

---


# Converting Massive PDFs to QAs

## Step 1: Install the DataFlow environment

From source:

```shell
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .
````

From PyPi:

```shell
pip install open-dataflow
```

## Step 2: Create a new DataFlow working folder

```shell
mkdir run_dataflow
cd run_dataflow
```

## Step 3: Initialize DataFlow

```shell
dataflow init
```

&#x9;Enter the script directory:

```shell
cd api_pipelines
export HF_ENDPOINT=https://hf-mirror.com
export DF_API_KEY=xxx
export MINERU_API_KEY=your MINERU API KEY
```

## Step 4: One-click execution

```bash
python kbcleaning_pipeline.py 
```
[code](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/statics/pipelines/api_pipelines/kbcleaning_pipeline.py)

During execution, this pipeline will sequentially call:

1. FileOrURLToMarkdownConverterAPI  Converts original files/URLs into Markdown
2. KBCChunkGenerator  Segments the text into chunks
3. KBCTextCleaner  Performs comprehensive cleaning on the segmented text
4. KBCMultiHopQAGenerator  Synthesizes QA data based on the cleaned knowledge

For detailed descriptions of each operator, refer to the "Knowledge Base Cleaning and QA Generation" section. Once executed, a JSON file will be generated in the `.cache` directory with contents as shown below.

> The demo only provides two sources for functionality demonstration. In addition, Dataflow also offers users 1,000 Arxiv papers for testing the functionality. The topics of the papers include LLM, databases, and more. The dataset link is: [Open-Dataflow/1k\_arxiv · Datasets at Hugging Face](https://huggingface.co/datasets/Open-Dataflow/1k_arxiv). You can download the dataset and organize it into the following format:
>
> ```jsonl
> {"source": "path/to/first.pdf"}
> {"source": "path/to/second.pdf"}
> ...
> ```
>
>
> Or you can just put the URLs of the papers in the JSONL file. For example:
> ```jsonl
> {"source": "https://arxiv.org/pdf/2505.07773"}
> {"source": "https://arxiv.org/pdf/2503.09516"}
> ...
> ```
>
> Then, configure your path file `/path/to/all_pdf.jsonl` as shown below to enable batch cleaning of the knowledge base.
>
> ```python
> self.storage = FileStorage(
>     first_entry_file_name="/path/to/all_pdf.jsonl",
>     cache_path="./.cache/gpu",
>     file_name_prefix="batch_cleaning_step",
>     cache_type="json"
> )
> ```

## Example of Synthesized Data

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

