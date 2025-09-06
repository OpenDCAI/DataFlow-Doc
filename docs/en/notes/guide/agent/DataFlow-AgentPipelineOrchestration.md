---
title: Agent-QuickStart
icon: carbon:ibm-consulting-advantage-agent
createTime: 2025/06/19 10:29:31
permalink: /en/guide/DataFlow-AgentPipelineOrchestration/
---

## Quick Start

### 1. Overview

DataFlow Agent is an automated task processing system based on multi-agent collaboration, covering the **full workflow from task decomposition → tool registration → scheduling and execution → result validation → report generation**. It is dedicated to intelligent management and execution of complex tasks. According to the user's data type and requirements, it supports:

1. `recommend`: Dedicated operator recommendation, orchestration, execution, and summary.
2. `write`: User-personalized operator generation in the Dataflow style.

Example scripts are located at `test/test_dataflow_agent.py`. Most configurations can be set via parameters of the `ChatAgentRequest` class, including:
- User request (`target`)
- Local data reading path (`json_file`)
- Model invocation method and model type (`model`)
- Path to store the generated code (`py_path`)

### 2. Data Preparation

- **Supported formats**: `json`, `jsonl`, `pdf`.
- In the current example script `test/test_dataflow_agent.py`, the default data is stored at `example/ReasoningPipeline/pipeline_math_short.json`. You can set the `json_file` parameter to your own data file path.

### 3. Model Preparation

DataFlow Agent requires environment variable configuration to support LLM API calls. On Linux systems:
```bash
export DF_API_KEY=your_api_key
export DF_API_URL=your_api_base_url
```
On Windows CMD:
```cmd
set DF_API_KEY=your_api_key
set DF_API_URL=your_api_base_url
```
On Windows PowerShell:
```powershell
$env:DF_API_KEY = "your_api_key"
$env:DF_API_URL = "your_api_base_url"
```

The model type can be specified via the `model` parameter when instantiating the `ChatAgentRequest` class.

### 4. `recommend`: Operator Recommendation, Orchestration, Execution, and Summary

Users can run the following commands to execute the example script. By passing in the `recommend` parameter, a simple data processing pipeline recommendation and generation for math-related data can be implemented. The generated pipeline code will be saved as `test/recommend_pipeline_2.py`.

```bash
cd DataFlow
# set API_KEY and API_URL
python test/test_dataflow_agent.py recommend
```

The generated pipeline code (results may vary depending on the chosen model type and version) looks roughly like this:
```python
import pytest
from dataflow.operators.generate.Reasoning.ReasoningQuestionGenerator import ReasoningQuestionGenerator
from dataflow.operators.process.Reasoning.ReasoningQuestionFilter import ReasoningQuestionFilter
from dataflow.operators.generate.Reasoning.ReasoningQuestionDifficultySampleEvaluator import ReasoningQuestionDifficultySampleEvaluator
from dataflow.operators.generate.Reasoning.ReasoningQuestionCategorySampleEvaluator import ReasoningQuestionCategorySampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request, LocalModelLLMServing_vllm, LocalModelLLMServing_sglang


class RecommendPipeline():
    def __init__(self):

        # -------- FileStorage (please modify parameters as needed) --------
        self.storage = FileStorage(
            first_entry_file_name="/mnt/public/data/lh/ygc/dataflow-agent/DataFlow/dataflow/example/ReasoningPipeline/pipeline_math_short.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )


        # -------- LLM Serving (Local) --------
        llm_serving = LocalModelLLMServing_vllm(
            hf_model_name_or_path="/mnt/public/model/huggingface/Qwen2.5-7B-Instruct",
            vllm_tensor_parallel_size=1,
            vllm_max_tokens=8192,
            hf_local_dir="local",
        )

        self.questiongenerator = ReasoningQuestionGenerator(num_prompts=1, llm_serving=llm_serving)
        self.questionfilter = ReasoningQuestionFilter(system_prompt="You are a helpful assistant.", llm_serving=llm_serving)
        self.questiondifficultyclassifier = ReasoningQuestionDifficultySampleEvaluator(llm_serving=llm_serving)
        self.questioncategoryclassifier = ReasoningQuestionCategorySampleEvaluator(llm_serving=llm_serving)

    def forward(self):
        self.questiongenerator.run(
            storage=self.storage.step(), input_key=""
        )
        self.questionfilter.run(
            storage=self.storage.step(), input_key="math_problem"
        )
        self.questiondifficultyclassifier.run(
            storage=self.storage.step(), input_key="", output_key="difficulty_score"
        )
        self.questioncategoryclassifier.run(
            storage=self.storage.step(), input_key="instruction", output_key="question_category"
        )


if __name__ == "__main__":
    pipeline = RecommendPipeline()
    pipeline.forward()
```

Users can personalize configuration by modifying the parameters in `ChatAgentRequest`.

### 5. `write`: User-Personalized Operator Generation

Users can run the following commands to execute the example script. By passing in the `write` parameter, a simple MinHash text deduplication operator for math-related data can be generated. The generated operator code will be saved as `test/operator.py`.

```shell
cd DataFlow
# set API_KEY and API_URL
python test/test_dataflow_agent.py write
```

The generated operator code (results may vary depending on the chosen model type and version) looks roughly like this:
```python
from tqdm import tqdm
from datasketch import MinHash, MinHashLSH
from dataflow import get_logger
from dataflow.core import OperatorABC
from dataflow.utils.storage import DataFlowStorage
from dataflow.utils.registry import OPERATOR_REGISTRY

@OPERATOR_REGISTRY.register()
class TextMinHashDeduplicator(OperatorABC):
    def __init__(self, num_perm: int = 128, threshold: float = 0.9, ngram: int = 5):
        self.logger = get_logger()
        self.num_perm = num_perm
        self.threshold = threshold
        self.ngram = ngram

    @staticmethod
    def get_desc(lang: str = "zh"):
        return "Deduplicate text with MinHash" if lang != "zh" else "使用 MinHash 算法对文本去重"

    def _build_minhash(self, text: str):
        m = MinHash(num_perm=self.num_perm)
        for i in range(max(len(text) - self.ngram + 1, 1)):
            m.update(text[i:i + self.ngram].encode("utf8"))
        return m

    def run(self, storage: DataFlowStorage, input_key: str = "text", output_key: str = "dedup_label"):
        df = storage.read("dataframe")
        lsh = MinHashLSH(threshold=self.threshold, num_perm=self.num_perm)
        labels = [0] * len(df)
        with lsh.insertion_session() as session:
            for idx, row in tqdm(df.iterrows(), total=len(df)):
                text = str(row[input_key])
                mh = self._build_minhash(text)
                if len(lsh.query(mh)) == 0:
                    labels[idx] = 1
                    session.insert(idx, mh)
        df[output_key] = labels
        storage.write(df[df[output_key] == 1])
        return [output_key]
```

Users can personalize configuration by modifying the parameters in `ChatAgentRequest`.


### 6. Experience DataFlow-Agent via Gradio

#### Startup Methods

##### Method 1: Direct Startup
After installing the `dataflow` package, directly start the Gradio frontend and backend using `dataflow webui agent`. The default port is 7862.

##### Method 2: Separate Frontend and Backend Startup

- Start the frontend:
```bash
python test/test_agent_fronted_gradio.py
```

- Start the backend:
```bash
python test/test_dataflow_agent_with_ui.py
```
### 7. Experience the Agent via Command Line After `dataflow init`

- Operator Development
```bash
python dataflow_agent/run_dataflow_agent_with_console.py write
```
- Operator Orchestration
```bash
python dataflow_agent/run_dataflow_agent_with_console.py recommend
```


