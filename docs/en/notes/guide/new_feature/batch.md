---
title: Preview-Batched Inference
createTime: 2025/12/30 11:47:05
permalink: /en/guide/batch/
---


# Beta: Checkpoint Resume

> This feature is currently in beta and may contain bugs. If you encounter any issues, please report them via issues. Thank you for your understanding.

## Overview

During inference, if an operator holds a large amount of data—such as thousands of records—and an unexpected interruption occurs midway, the portion that has already been inferred will be lost, resulting in wasted API calls.

To address this problem, we designed a **batched inference** interface with the following workflow:

1. Start inference for the first operator
2. The first operator processes only one batch at a time
3. The output of the current step is stored in an appendable output step file (e.g., JSONL or CSV)
4. Once the entire dataset has been processed by the current operator, proceed to the next operator
5. The entire pipeline is completed using this approach

## Usage

This is similar to [Framework Design – Resume Pipeline](/en/guide/basicinfo/framework/#breakpoint-resume-pipelines-resume), except that the pipeline must inherit from another base class, `BatchedPipelineABC`. It also needs to be compiled, and the `forward` function requires additional parameters. In addition, `Storage` currently needs to inherit from a special `BatchedFileStorage` class.

```python
import re
from dataflow.pipeline import BatchedPipelineABC  # [!code highlight]
from dataflow.operators.general_text import (
    LLMLanguageFilter,
)
from dataflow.operators.text_pt import MetaSampleEvaluator
from dataflow.operators.core_text import PromptedGenerator
from dataflow.serving import APILLMServing_request
from dataflow.utils.storage import BatchedFileStorage  # [!code highlight]

class AutoOPPipeline(BatchedPipelineABC):  # [!code highlight]
    
    def __init__(self):
        super().__init__()
        self.storage = BatchedFileStorage(  # [!code highlight]
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/pt_input.jsonl",
            cache_path="./cache_autoop",
            file_name_prefix="dataflow_cache_auto_run",
            cache_type="jsonl",
        )
        self.llm_serving = APILLMServing_request(
            api_url="http://api.openai.com/v1/chat/completions",
            model_name="gpt-4o",
            max_workers=30
        )
        self.op1 = PromptedGenerator(
            llm_serving=self.llm_serving1,
            system_prompt="Please translate the following content into Chinese:",
        )
        self.op2 = PromptedGenerator(
            llm_serving=self.llm_serving1,
            system_prompt="Please translate the following content into Korean:",
        )
        self.op3 = PromptedGenerator(
            llm_serving=self.llm_serving1,
            system_prompt="Please translate the following content into Japanese:"
        )
        
    def forward(self):
        self.op1.run(
            self.storage.step(),
            input_key='raw_content',
            output_key='content_cn1'
        )
        self.op2.run(
            self.storage.step(),
            input_key='raw_content',
            output_key='content_cn2'
        )
        self.op3.run(
            self.storage.step(),
            input_key='raw_content',
            output_key='content_cn3'
        )
        
if __name__ == "__main__":
    pipeline = AutoOPPipeline()
    pipeline.compile()  # [!code highlight]
    pipeline.forward(
        batch_size=2,  # [!code highlight]
        resume_from_last=True
    )
```

`resume_from_last` allows the pipeline to automatically continue from the last step file found in the current cache path.

Alternatively, you can use `resume_step` to resume from a specific previous operator step. Note that **only one of these parameters can be set at a time** to avoid logical conflicts.

```python
    # The following invocation is also valid
    ...
    pipeline.compile()
    pipeline.forward(
        batch_size=2,
        resume_step=2  # Resume from the operator with index 2; the first operator has index 0
    )
```

---
