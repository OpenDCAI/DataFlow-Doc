---
title: Text2MultiHopQAGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/generate/text2multihopqagenerator/
---


## 📘 Overview

`Text2MultiHopQAGenerator` is a multi-hop question-answer pair generator operator designed to automatically produce questions and answers that require multi-step reasoning from a given text.
This operator leverages a Large Language Model (LLM) to transform input text into a structured set of reasoning-based QA pairs. It is suitable for building complex QA datasets or evaluating a model’s reasoning ability.

## **init** Function

`__init__(self, llm_serving, seed=0, lang="en", prompt_template=None, num_q=5)`

### init Parameter Description

| Parameter           | Type          | Default                          | Description                                                            |
| :------------------ | :------------ | :------------------------------- | :--------------------------------------------------------------------- |
| **llm_serving**     | LLMServingABC | Required                         | The LLM service instance used for inference and generation.            |
| **seed**            | int           | 0                                | Random seed to ensure reproducibility of results.                      |
| **lang**            | str           | "en"                             | Specifies the output language, e.g., 'en' (English) or 'zh' (Chinese). |
| **prompt_template** | PromptABC     | Text2MultiHopQAGeneratorPrompt() | Prompt template object for constructing model input.                   |
| **num_q**           | int           | 5                                | The maximum number of QA pairs to generate for each input text.        |

### Prompt Template Description

| Prompt Template Name               | Main Purpose                          | Application Scenario                                              | Feature Description                                                                                                                                                       |
| ---------------------------------- | ------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Text2MultiHopQAGeneratorPrompt** | Generate multi-hop QA pairs from text | Scenarios requiring complex reasoning questions from long context | Built-in specialized template that guides the model to generate questions, reasoning steps, final answers, and supporting facts to ensure structured and logical outputs. |

## run Function

`run(self, storage, input_key='cleaned_chunk', output_key='QA_pairs', output_meta_key='QA_metadata')`

#### Parameters

| Name                | Type            | Default         | Description                                                                      |
| :------------------ | :-------------- | :-------------- | :------------------------------------------------------------------------------- |
| **storage**         | DataFlowStorage | Required        | Data flow storage instance responsible for reading and writing data.             |
| **input_key**       | str             | "cleaned_chunk" | Input column name corresponding to the context text field.                       |
| **output_key**      | str             | "QA_pairs"      | Output column name corresponding to the generated multi-hop QA pairs list.       |
| **output_meta_key** | str             | "QA_metadata"   | Output metadata column name corresponding to the generated metadata information. |

## 🧠 Example Usage

```python
self.knowledge_cleaning_step4 = Text2MultiHopQAGenerator(
    llm_serving=self.llm_serving,
    lang="en",
    num_q = 5
)
self.knowledge_cleaning_step4.run(
    storage=self.storage.step(),
    # input_key=
    # output_key=
)
```

#### 🧾 Default Output Format

| Field    | Type       | Description                                                                                   |
| :------- | :--------- | :-------------------------------------------------------------------------------------------- |
| text     | str        | The processed original context text.                                                          |
| qa_pairs | List[Dict] | List of generated multi-hop QA pairs, each containing question, answer, reasoning steps, etc. |
| metadata | Dict       | Metadata containing source, timestamp, complexity, and other information.                     |

Example Input:

```json
{
"cleaned_chunk":"Mona Lisa was painted by Leonardo da Vinci. Leonardo da Vinci was born in the Republic of Florence. The Republic of Florence was a state in what is now Italy."
}
```

Example Output:

```json
{
    "cleaned_chunk": "Mona Lisa was painted by Leonardo da Vinci. Leonardo da Vinci was born in the Republic of Florence. The Republic of Florence was a state in what is now Italy.",
    "QA_pairs": [
        {
            "question": "In which modern country was the painter of the Mona Lisa born?",
            "reasoning_steps": [
                {
                    "step": "Identify the painter of the Mona Lisa, which is Leonardo da Vinci."
                },
                {
                    "step": "Find the birthplace of Leonardo da Vinci, which is the Republic of Florence."
                },
                {
                    "step": "Determine the modern-day location of the Republic of Florence, which is Italy."
                }
            ],
            "answer": "Italy",
            "supporting_facts": [
                "Mona Lisa was painted by Leonardo da Vinci.",
                "Leonardo da Vinci was born in the Republic of Florence.",
                "The Republic of Florence was a state in what is now Italy."
            ],
            "type": "History"
        }
    ],
    "QA_metadata": {
        "source": "default_source",
        "timestamp": "2023-10-27T10:00:00Z",
        "complexity": 3
    }
}
```
