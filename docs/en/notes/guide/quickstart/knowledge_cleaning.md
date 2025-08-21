---
title: Case 7. Batch Knowledge Base Cleaning
createTime: 2025/07/18 17:31:06
permalink: /en/guide/j95zcdmj/
icon: basil:lightning-alt-outline
---

---


# Batch Knowledge Base Cleaning

## Step 1: Install the DataFlow environment

From source:

```shell
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .
pip install -e .[mineru]
mineru-models-download
````

From PyPi:

```shell
pip install open-dataflow
pip install open-dataflow[mineru]
mineru-models-download
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
cd gpu_pipelines/
```

## Step 4: One-click execution

```bash
python kbcleaning_pipeline_batch_sglang.py
```

During execution, this pipeline will sequentially call:

1. FileOrURLToMarkdownConverter  Converts original files/URLs into Markdown
2. CorpusTextSplitter  Segments the text into chunks
3. KnowledgeCleaner  Performs comprehensive cleaning on the segmented text
4. MultiHopQAGenerator  Synthesizes QA data based on the cleaned knowledge

For detailed descriptions of each operator, refer to the "Knowledge Base Cleaning and QA Generation" section. Once executed, a JSON file will be generated in the `.cache` directory with contents as shown below.

> The demo only provides two sources for functionality demonstration. In addition, Dataflow also offers users 1,000 Arxiv papers for testing the functionality. The topics of the papers include LLM, databases, and more. The dataset link is: [Open-Dataflow/1k\_arxiv · Datasets at Hugging Face](https://huggingface.co/datasets/Open-Dataflow/1k_arxiv). You can download the dataset and organize it into the following format:
>
> ```jsonl
> {"raw_content": "path/to/first.pdf"}
> {"raw_content": "path/to/second.pdf"}
> ...
> ```
>
>
> Or you can just put the URLs of the papers in the JSONL file. For example:
> ```jsonl
> {"raw_content": "https://arxiv.org/pdf/2505.07773"}
> {"raw_content": "https://arxiv.org/pdf/2503.09516"}
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

Each path represents a specific processing stage for the knowledge base referenced by "raw\_content". The final output of a file may look like this (snippet):

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


---

