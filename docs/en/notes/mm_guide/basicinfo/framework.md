---
title: Framework Design
icon: material-symbols:auto-transmission-sharp
createTime: 2025/06/13 14:59:56
permalink: /en/mm_guide/basicinfo/framework/
---
![Dataflow-Framework](/dataflow_framework.jpg)
# Framework Design
The main data processing logic of Dataflow's framework is divided into the operator layer (`operator`) and the pipeline layer (`pipeline`). In addition, there are modules such as data management `storage` and large model backend `LLMServing` that provide joint support.

To utilize AI-assisted data processing, we have added an `Agent for Dataflow` module. The Agent can (1) automatically orchestrate operators, (2) automatically write data operators, and (3) automatically solve data analysis tasks.

## Data Management
DataFlow primarily focuses on the processing of large model text data. To enhance usability, the DataFlow kernel uses `pandas`'s `DataFrame` ([https://github.com/pandas-dev/pandas](https://github.com/pandas-dev/pandas))as a carrier to read and write data. Therefore, DataFlow supports common text dataset formats such as `json, jsonl, csv, parquet, pickle` as inputs and outputs. It also performs data cleaning, augmentation, and evaluation through **CRUD** operations on the `DataFrame` table.

In essence, the dataset management functionality is implemented by the `storage` class, with the source code located at [`https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/utils/storage.py`](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/utils/storage.py). Currently, the framework mainly relies on the **file system** as the carrier for data reading, writing, and caching. In the future, it will support **database systems** for read/write operations to handle extremely large amounts of data.

## Large Model Backend
For the augmentation, filtering, and scoring of large volumes of data with complex requirements, the powerful and flexible semantic understanding capabilities of large language models are essential. Therefore, DataFlow provides the `LLMServingABC` abstract class to manage online/local large models uniformly. The current derived classes include:

- `LocalModelLLMServing`: Uses [vLLM](https://github.com/vllm-project/vllm) as the inference backend, deploying large models on local GPUs as inference services.
- `APILLMServing_request`: Uses the `request` method to send requests to large model service providers' APIs on the network (e.g., ChatGPT, Deepseek), supporting concurrent requests in multiple processes.

## DataFlow Operators

![Reasoning-Pipeline](/Reasoning_Pipeline.png)

DataFlow operators are the basic processing units that execute on raw data, typically implemented based on rules, deep learning models, or large language models (LLMs). Taking the `Reasoning Pipeline` schematic diagram above as an example, each rectangular unit can be considered an independent DataFlow operator, used to complete specific data processing tasks (such as cleaning, transformation, validation, etc.).

The code style of each operator in DataFlow is very concise. Below is an example of calling the `ReasoningQuestionDifficultySampleEvaluator` operator, which uses the large model backend to evaluate the difficulty level of questions:

```python
from dataflow.operators.generate.Reasoning import ReasoningQuestionDifficultySampleEvaluator,
question_difficulty_classifier = ReasoningQuestionDifficultySampleEvaluator(
    llm_serving=llm_serving             # Pass in a large model LLMServing class as the backend
)
question_difficulty_classifier.run(
    storage = self.storage.step(),      # Storage class. Manages, reads, and caches datasets
    input_key = "instruction",          # The field name of the data to be read
    output_key = "question_difficulty"  # The field name of the data to be written
)
```

The design of the operators references the code style of `PyTorch`, which is easy to understand. The necessary settings are initialized in the `__init__` function, and the `run` function dynamically reads and writes based on the field names of the data table. Some parameters are also dynamically input here to reuse operators. DataFlow's code standards only require these two functions as interfaces for operators.

The `run` function of the operator must include a `storage` parameter for reading and writing data. In addition, the conventions for table fields are as follows:
- If an operator only needs to read/write **one** field, it generally specifies this through `input_key` and `output_key`.
- If an operator **does no**t need to write a field, there is no such `output_*` parameter at all.
- If multiple fields need to be read/written, they are generally specified through parameter names based on their functions, such as `input_question_key`, `input_answer_key`, `output_question_quality_key`.

The field names in the `run` function of the operator can be flexibly specified by the user to adapt to the variable field naming conventions of LLM datasets (for example, `question`, `instruction`, `human` are all used to represent human questions in multi-turn dialogues). Setting `input_key="question"`, `input_key="instruction"`, or `input_key="human"` allows for flexible reading of such datasets.

## DataFlow Pipeline

The DataFlow Pipeline is an ordered orchestration of multiple DataFlow operators, aimed at completing a complete data processing or analysis task. By serializing or parallelizing multiple steps such as data generation, cleaning, and validation, it forms the `Reasoning Pipeline` shown in the figure above, achieving full automation of the entire process from raw data to structured results.

The pipeline in DataFlow generally organizes operators in the following paradigm, with the overall code style still aligning with `PyTorch`:

```python
from dataflow.operators.generate.AgenticRAG import (
    AutoPromptGenerator,
    QAGenerator,
    QAScorer
)

from dataflow.operators.process.AgenticRAG import (
    ContentChooser
)

from dataflow.utils.storage import FileStorage
from dataflow.llmserving import APILLMServing_request, LocalModelLLMServing


class AgenticRAGPipeline():
    def __init__(self):

        self.storage = FileStorage(
            first_entry_file_name="../example_data/AgenticRAGPipeline/pipeline_small_chunk.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="json",
        )

        # use API server as LLM serving
        llm_serving = APILLMServing_request(
                api_url="https://api.openai.com/v1/chat/completions",
                model_name="gpt-4o",
                max_workers=1
        )

        self.content_chooser_step1 = ContentChooser(embedding_model_path="your embedding model path")

        self.prompt_generator_step2 = AutoPromptGenerator(llm_serving)

        self.qa_generator_step3 = QAGenerator(llm_serving)

        self.qa_scorer_step4 = QAScorer(llm_serving)
        
    def forward(self):

        self.content_chooser_step1.run(
            storage = self.storage.step(),
            input_key = "text",
            num_samples =5,
            method = "random"
        )

        self.prompt_generator_step2.run(
            storage = self.storage.step(),
            input_key = "text"
        )

        self.qa_generator_step3.run(
            storage = self.storage.step(),
            input_key="text",
            prompt_key="generated_prompt",
            output_quesion_key="generated_question",
            output_answer_key="generated_answer"
        )

        self.qa_scorer_step4.run(
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
    model = AgenticRAGPipeline()
    model.forward()
```

Currently, DataFlow provides a variety of preset `Pipeline` pipelines to accomplish predefined functions. Once you are familiar with the DataFlow framework, you can freely combine existing operators or design your own new operators to construct a `pipeline` suitable for your data processing.

## DataFlow Agent

The DataFlow Agent is an automated task processing system based on multi-agent collaboration, covering the entire process from **task decomposition → tool registration → scheduling execution → result verification → report generation**, dedicated to the intelligent management and execution of complex tasks. Its core modules include:

- **Planning Agent**: Understands user intentions and decomposes high-level requirements into specific executable task chains.
- **Tool Register**: Dynamically manages existing and newly generated tools (such as operators, models, or scripts).
- **Task Dispatcher**: Assigns tasks to the Execution Agent, supporting automatic code generation and debugging.
- **Execution Agent**: Executes specific tasks, including data processing and model invocation.
- **Evaluation Agent**: Assesses the quality and correctness of the execution results.
- **Analysis Agent**: Summarizes the process and results, generating structured reports.

The system supports short-term and long-term memory mechanisms, capable of maintaining multi-turn interaction states. While ensuring standardized processes, it possesses a high degree of dynamic adaptability, making it particularly suitable for complex scenarios requiring multi-stage collaboration, such as data governance and automated data analysis.

![Dataflow-Agent](/agent_en.png)