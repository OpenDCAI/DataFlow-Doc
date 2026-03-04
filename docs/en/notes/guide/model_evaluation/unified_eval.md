---
title: Model Evaluation (Research Edition)
icon: hugeicons:chart-evaluation
createTime: 2026/03/04 16:41:11
permalink: /en/guide/41y6wer6/
---

# Model Evaluation (Unified Bench Eval)

DataFlow-Eval (Models) is DataFlow’s in-house model evaluation framework. It abstracts common benchmark evaluation paradigms into a set of mutually exclusive evaluation types (`eval_type`) and provides ready-to-run pipeline scripts, enabling users to evaluate with minimal configuration, write per-sample results back to the dataframe, and export aggregated statistics.

Unified evaluation scripts directory: `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval` 

>*If you start DataFlow via the `init` workflow, you can directly locate the `gpu_pipelines` directory.*

## ✅ Workflow

To evaluate a specific model, follow these steps:

1. **Choose the evaluation type**: select `eval_type` based on your dataset schema (enable semantic judging when needed)
2. **Pick the pipeline script**: open the corresponding pipeline file under the scripts directory
3. **Edit evaluation parameters**: configure data path, cache directory, model serving, and field mapping
4. **Run and inspect results**: run the pipeline, then inspect per-sample result columns and aggregated statistics

## 🧰 Environment Setup

Before running the evaluation pipelines locally, install DataFlow:

```bash
cd DataFlow
pip install -e .
```

If you use local model serving (e.g., vLLM), make sure your environment has the required GPU/driver and dependencies.


## 🧩 Evaluation Types

`eval_type` defines the required fields (keys) per sample, as well as the default metric/logic.

**Field conventions:**
- Keys do not include the prompt string itself; they only include variables that will be injected into the prompt (e.g., `question` / `choices` / `context`).
- `context` is an optional field across all types: if present it will be used; otherwise it is treated as `None` (so you do not need separate benches for “with/without context”).

### Type Overview

| eval_type | <span style="white-space:nowrap;">Paradigm</span> | Required keys | Default metric/logic | Example benches | Script |
|---|---|---|---|---|---|
| `key1_text_score` | <span style="white-space:nowrap;">Text scoring</span> | `text` | `ppl` | WikiText / PTB | `unified_bench_eval_type1.py` |
| `key2_qa` | <span style="white-space:nowrap;">Generative: single reference</span> | `question`<br>`target` | `math_verify` (optional semantic judge) | GSM8K / MATH | `unified_bench_eval_type2.py` |
| `key2_q_ma` | <span style="white-space:nowrap;">Generative: multiple references</span> | `question`<br>`targets[]` | `any_math_verify` | SQuAD (multiple golds) | `unified_bench_eval_type3.py` |
| `key3_q_choices_a` | <span style="white-space:nowrap;">Multiple choice: single correct</span> | `question`<br>`choices[]`<br>`label` | `ll_choice_acc` (choice loglikelihood) | PIQA / ARC / MMLU | `unified_bench_eval_type4.py` |
| `key3_q_choices_as` | <span style="white-space:nowrap;">Multiple choice: multiple correct</span> | `question`<br>`choices[]`<br>`labels[]` | `micro_f1` | Multi-select / multi-label | `unified_bench_eval_type5.py` |
| `key3_q_a_rejected` | <span style="white-space:nowrap;">Preference: pairwise comparison</span> | `question`<br>`better`<br>`rejected` | `pairwise_ll_winrate` | DPO / preference data | `unified_bench_eval_type6.py` |

### Semantic Judging Toggle (key2_qa only)

Semantic judging is not a standalone type; it is a toggle for `key2_qa`:

- `use_semantic_judge=False`: default `math_verify` (best for verifiable answers)
- `use_semantic_judge=True`: LLM-based `semantic_judge` (best for open-ended answers)

Reference script (in the same directory): `unified_bench_eval_type_semantic.py`

## 📦 Data Preparation

Unified evaluation supports `jsonl` or `json` as input formats by default. You may keep any additional fields (e.g., `id`, `eval_type`). The evaluation only depends on the column names you explicitly set in the pipeline.

## 🧱 Type Details and Examples (Collapsible)

<details>
<summary><b>Type1: key1_text_score (Text scoring / PPL)</b></summary>

**Required keys:**
- `text`

**Example data (jsonl):**

```json
{"id":"t_0001","text":"The capital of France is Paris."}
{"id":"t_0002","text":"Perplexity is a common metric for language modeling."}
```

**Pipeline:**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type1.py`

**Notes:**
- This type does not require answer generation; it computes `ppl` directly from `text`.

</details>

<details>
<summary><b>Type2: key2_qa (Generative: single reference)</b></summary>

**Required keys:**
- `question`
- `target` (the column name can be customized; map it via `input_target_key` in the pipeline)

**Example data (jsonl):**

```json
{"id":"qa_0001","question":"Solve for x: 2x + 3 = 11.","target":"x = 4","context":null}
{"id":"qa_0002","question":"What is the capital of France?","target":"Paris","context":"Answer in one word."}
```

**Pipeline:**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type2.py`

**Notes:**
- The default evaluation logic is `math_verify` (strict and verifiable).
- For semantic judging, set `use_semantic_judge=True` and refer to `.../unified_bench_eval_type_semantic.py`.

</details>

<details>
<summary><b>Type3: key2_q_ma (Generative: multiple references)</b></summary>

**Required keys:**
- `question`
- `targets` (list; JSON-stringified list is also supported)

**Example data (jsonl):**

```json
{"id":"ma_0001","question":"What is the chemical formula for water?","targets":["H2O","h2o"],"context":"Use chemical symbols."}
{"id":"ma_0002","question":"Who created Python?","targets":["Guido van Rossum","Guido"],"context":null}
```

**Pipeline:**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type3.py`

**Notes:**
- Default logic is `any_math_verify`: any match among references counts as correct.

</details>

<details>
<summary><b>Type4: key3_q_choices_a (Multiple choice: single correct)</b></summary>

**Required keys:**
- `question`
- `choices` (list)
- `label` (0-based index)

**Example data (jsonl):**

```json
{"id":"mc_0001","question":"What is the capital of France?","choices":["Paris","London","Berlin","Rome"],"label":0,"context":null}
{"id":"mc_0002","question":"In Python, what does len([1, 2, 3]) return?","choices":["2","3","4","An error"],"label":1,"context":"Choose exactly one option."}
```

**Pipeline:**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type4.py`

**Notes:**
- Default metric is `ll_choice_acc`: compute loglikelihood for each choice, take argmax, compare with `label`.
- This type usually does not need `generated_ans` (the pipeline typically skips generation by default).

</details>

<details>
<summary><b>Type5: key3_q_choices_as (Multiple choice: multiple correct)</b></summary>

**Required keys:**
- `question`
- `choices` (list)
- `labels` (0-based index list)

**Example data (jsonl):**

```json
{"id":"ms_0001","question":"Which of the following are prime numbers?","choices":["2","9","11","15"],"labels":[0,2],"context":null}
{"id":"ms_0002","question":"Which of the following are HTTP methods?","choices":["GET","FETCH","POST","PUSH"],"labels":[0,2],"context":"Select all that apply."}
```

**Pipeline:**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type5.py`

**Notes:**
- Default metric is `micro_f1` (parse the model output as a multi-select set and compute micro-F1).
- This type requires generating `generated_ans` by default (or provide your own prediction column and point `input_pred_key` to it).

</details>

<details>
<summary><b>Type6: key3_q_a_rejected (Preference: pairwise comparison)</b></summary>

**Required keys:**
- `question`
- `better`
- `rejected`

**Example data (jsonl):**

```json
{"id":"pw_0001","question":"Explain what overfitting is in machine learning.","better":"Overfitting is when a model learns the training data too closely, including noise, and performs poorly on unseen data.","rejected":"Overfitting means the model is always perfect.","context":null}
{"id":"pw_0002","question":"What is the derivative of x^2?","better":"The derivative of x^2 with respect to x is 2x.","rejected":"The derivative of x^2 is x.","context":"Answer with a direct statement."}
```

**Pipeline:**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type6.py`

**Notes:**
- Default metric is `pairwise_ll_winrate`: compare the loglikelihood of `P(better|prompt)` vs `P(rejected|prompt)` and compute win rate.
- This type does not require answer generation (the pipeline typically skips generation by default).

</details>

## ⚙️ Parameter Configuration (What to Edit)

Unified Bench Eval pipeline files already implement the evaluation flow. For most users, you only need to edit two parts in the pipeline code:

1. **Data and cache (FileStorage)**
2. **Model serving (Serving: local model / API judge)**

Below is a minimal “what to change” example (replace paths and model parameters according to the comments):

```python
from dataflow.utils.storage import FileStorage
from dataflow.serving import LocalModelLLMServing_vllm, APILLMServing_request

# 1) Data & cache (FileStorage): set your evaluation data path and cache directory here
storage = FileStorage(
    first_entry_file_name="path/to/your_eval_data.jsonl",  # TODO: your jsonl/json dataset file
    cache_path="./cache_local",                            # TODO: cache directory (stores intermediate & final results)
    file_name_prefix="your_bench_name",                    # TODO: cache/result prefix (to distinguish runs)
    cache_type="jsonl",                                    # TODO: match your input type (jsonl/json)
)

# 2) Model serving: choose local serving or API based on your needs
# 2.1 Local model serving (commonly used for generation, PPL/LL, etc.)
llm_serving_local = LocalModelLLMServing_vllm(
    hf_model_name_or_path="Qwen/Qwen2.5-7B-Instruct",      # TODO: replace with your local path or HF model id
    vllm_tensor_parallel_size=1,                           # TODO: tensor parallel config (multi-GPU)
    vllm_max_tokens=2048,                                  # TODO: max generation tokens
)

# 2.2 API judge serving (only needed when key2_qa uses semantic judging: use_semantic_judge=True)
llm_serving_judge = APILLMServing_request(
    api_url="https://api.openai.com/v1/chat/completions",   # TODO: replace with your API endpoint
    model_name="gpt-4o",                                   # TODO: replace with your judge model
    max_workers=5,                                         # TODO: concurrency
)

# Then, in the target pipeline, replace FileStorage and Serving objects with the configs above.
# For example:
#   self.storage = storage
#   self.llm_serving_generator = llm_serving_local
#   self.llm_serving_judger = llm_serving_judge
```

## ▶️ Run Evaluation

```bash
python unified_bench_eval_type2.py
```

## 📊 Outputs and Field Meanings

After evaluation, results are written back to the cached dataframe with the following columns (column names can be customized via evaluator parameters):

- `eval_score`: numeric score (0/1 for accuracy-style tasks; float for PPL)
- `eval_pred`: parsed prediction information (e.g., choice parsing, loglikelihood info)
- `eval_valid`: whether the sample evaluation is valid
- `eval_error`: error message (e.g., `ll_unavailable` / `ppl_unavailable`)

Additionally, aggregated statistics are saved to `eval_result_path` (configured in the pipeline scripts) for quick overall inspection.

## 🔎 Reference Implementation

For deeper customization (prompts, metrics, parsing logic), refer to the operator implementations:

- `dataflow/operators/core_text/generate/bench_answer_generator.py`
- `dataflow/operators/core_text/eval/unified_bench_dataset_evaluator.py`
