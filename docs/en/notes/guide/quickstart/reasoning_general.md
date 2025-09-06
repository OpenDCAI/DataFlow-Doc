---
title: Case 4. Synthesis and Processing of General Reasoning Data
createTime: 2025/07/16 20:10:28
permalink: /en/guide/reasoning_general/
icon: basil:lightning-alt-outline

---

# Synthesizing Reasoning QA Data for Various Domains from Scratch

## Step 1: Install dataflow environment

```shell
pip install open-dataflow
```

## Step 2: Create new dataflow working folder

```shell
mkdir run_dataflow
cd run_dataflow
```

## Step 3: Initialize Dataflow

```shell
dataflow init
```

At this point you will see

```shell
run_dataflow/pipelines/api_pipelines/reasoning_general_pipeline.py  
```

## Step 4: Fill in your api key and api_url

For Linux and Mac OS

```shell
export DF_API_KEY="sk-xxxxx"
```

For Windows

```powershell
$env:DF_API_KEY = "sk-xxxxx"
```

The api_url filling method in `text_sft_synthesis_pipeline.py` is as follows:

```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=100
)
```

## Step 5: One-click execution

```bash
python pipelines/api_pipelines/reasoning_general_pipeline.py
```

During execution, this pipeline will sequentially call:

1. ReasoningQuestionFilter, for question quality checking and filtering
2. ReasoningQuestionGenerator for synthesizing new questions
3. ReasoningAnswerGenerator for synthesizing answers
4. ReasoningAnswerNgramFilter for deduplication

For specific functional descriptions of the operators, please refer to the [Strong Reasoning Operators](/en/guide/Reasoning_operators/) section. After calling, a json file will be generated in `run_dataflow/cache_local`, with file content as shown below.

## Synthesized Data Example

```json
{
    "instruction":"In the last quarter, a commercial bank reported a rise in its non-performing loan ratio from 2.1% to 3.4%. What might this indicate about the bank's loan portfolio?",
    "output":"This increase suggests that more borrowers are struggling to repay their loans, potentially due to economic slowdowns or tighter household finances. It indicates a deterioration in the quality of the bank's loan assets and may lead to increased provisions.",
    "golden_answer":"Higher credit risk due to more troubled loans.",
    "source":"Finance_banking",
    "Synth_or_Input":"input",
    "generated_cot":"Solution:\n1. Identify key components and premises of the task:\n→ Non-performing loan (NPL) ratio increase from 2.1% to 3.4%\n→ Quarter timeframe for observation\n\n2. Apply relevant principles, theorems, or methods with step-by-step derivation or argument:\n→ NPL ratio is a measure of loan repayment risk and indicates the proportion of non-paying loans in total loans\n→ An increase suggests a deterioration in the quality of the loan portfolio\n→ Possible causes for this deterioration might be economic downturn, poor underwriting practices, or increased credit risk exposure\n\n3. Perform any necessary calculations or logical checks with intermediate verification:\n→ Change in NPL ratio: 3.4\\% - 2.1\\% = 1.3\\%\n→ Verify impact: A rise of 1.3 percentage points in a single quarter is significant, indicating substantial risk factors affecting loan performance\n\n4. Present the final answer or conclusion in a clear, unambiguous notation:\n→ The increase in the non-performing loan ratio suggests that the bank's loan portfolio may be facing heightened credit risks, potential defaults, or poor economic conditions affecting borrowers."
}
```

