---
title: 模型评估（科研完整版）
icon: hugeicons:chart-evaluation
createTime: 2026/03/04 16:41:11
permalink: /zh/guide/41y6wer6/
---

# 模型评估（Unified Bench Eval）

DataFlow-Eval (Models) 是 DataFlow 自研的模型评估框架：它将常见 benchmark 的评测范式抽象为若干互斥的评测类型（`eval_type`），并提供开箱即用的评测流水线脚本，帮助用户以最少配置完成评测、写回逐样本结果并输出汇总统计。

统一评测脚本目录：`dataflow/statics/pipelines/gpu_pipelines/benchmark_eval` 

>*init 方式启动 DataFlow 则直接找到`gpu_pipelines`目录即可*

## ✅ 使用流程

对指定模型进行评测时，按以下顺序操作：

1. **确定评测类型**：根据数据结构选择 `eval_type`（必要时开启语义评测开关）
2. **选择评测流水线**：进入脚本目录，找到对应 type 的 pipeline 文件
3. **填写评测参数**：配置数据路径、缓存目录、模型 serving、字段名映射
4. **运行并查看结果**：运行 pipeline，查看逐样本结果列与汇总统计文件

## 🧰 环境准备

在本地运行评测流水线前，安装 DataFlow：

```bash
cd DataFlow
pip install -e .
```

如使用本地模型 serving（例如 vLLM），请确保运行环境具备对应 GPU/驱动与依赖。


## 🧩 评测类型

`eval_type` 定义了每条样本必须包含的字段（keys），以及默认的评测指标/逻辑。

**字段约定：**
- keys 不包含 prompt 本身的字符串，仅包含需要嵌入 prompt 的变量字段（如 `question` / `choices` / `context`）。
- `context` 为统一可选字段：存在即使用；不传或不存在即视为 `None`（无需再拆分“有/无上下文”的 bench）。

### 类型总览

| eval_type | <span style="white-space:nowrap;">类型范式</span> | 必要 keys | 默认 metric/逻辑 | 示例 Bench | 脚本文件 |
|---|---|---|---|---|---|
| `key1_text_score` | <span style="white-space:nowrap;">文本打分</span> | `text` | `ppl` | WikiText / PTB | `unified_bench_eval_type1.py` |
| `key2_qa` | <span style="white-space:nowrap;">生成式：单参考答案</span> | `question`<br>`target` | `math_verify`（可选语义评测） | GSM8K / MATH | `unified_bench_eval_type2.py` |
| `key2_q_ma` | <span style="white-space:nowrap;">生成式：多参考答案</span> | `question`<br>`targets[]` | `any_math_verify` | SQuAD（多 gold） | `unified_bench_eval_type3.py` |
| `key3_q_choices_a` | <span style="white-space:nowrap;">选择题：单正确</span> | `question`<br>`choices[]`<br>`label` | `ll_choice_acc`（loglikelihood 选项打分） | PIQA / ARC / MMLU | `unified_bench_eval_type4.py` |
| `key3_q_choices_as` | <span style="white-space:nowrap;">选择题：多正确</span> | `question`<br>`choices[]`<br>`labels[]` | `micro_f1` | 多选题 / 多标签 | `unified_bench_eval_type5.py` |
| `key3_q_a_rejected` | <span style="white-space:nowrap;">偏好/排序：成对比较</span> | `question`<br>`better`<br>`rejected` | `pairwise_ll_winrate` | DPO/偏好数据 | `unified_bench_eval_type6.py` |

### 语义评测开关（仅适用于 key2_qa）

语义评测不是独立类型，而是 `key2_qa` 的评测开关：

- `use_semantic_judge=False`：默认 `math_verify`（适合可验证答案）
- `use_semantic_judge=True`：使用 LLM judge 的 `semantic_judge`（适合开放式答案）

对应示例脚本（同目录下）：`unified_bench_eval_type_semantic.py`

## 📦 数据准备

统一评测默认支持 `jsonl`或`json` 作为输入格式。你可以保留任意额外字段（如 `id`、`eval_type`），评测只依赖你在 pipeline 中显式填写的列名。

## 🧱 各类型说明与示例（可折叠）

<details>
<summary><b>Type1：key1_text_score（文本打分 / PPL）</b></summary>

**必要 keys：**
- `text`

**数据示例（jsonl）：**

```json
{"id":"t_0001","text":"The capital of France is Paris."}
{"id":"t_0002","text":"Perplexity is a common metric for language modeling."}
```

**对应 pipeline：**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type1.py`

**说明：**
- 该类型不需要生成答案，评测直接对 `text` 计算 `ppl`。

</details>

<details>
<summary><b>Type2：key2_qa（生成式：单参考答案）</b></summary>

**必要 keys：**
- `question`
- `target`（列名可自定义，只要在 pipeline 中用 `input_target_key` 映射即可）

**数据示例（jsonl）：**

```json
{"id":"qa_0001","question":"Solve for x: 2x + 3 = 11.","target":"x = 4","context":null}
{"id":"qa_0002","question":"What is the capital of France?","target":"Paris","context":"Answer in one word."}
```

**对应 pipeline：**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type2.py`

**说明：**
- 默认评测逻辑为 `math_verify`（偏严格、可验证）。
- 如需语义评测，使用 `use_semantic_judge=True`，参考脚本 `.../unified_bench_eval_type_semantic.py`。

</details>

<details>
<summary><b>Type3：key2_q_ma（生成式：多参考答案）</b></summary>

**必要 keys：**
- `question`
- `targets`（list；也可为 JSON 字符串形式的 list）

**数据示例（jsonl）：**

```json
{"id":"ma_0001","question":"What is the chemical formula for water?","targets":["H2O","h2o"],"context":"Use chemical symbols."}
{"id":"ma_0002","question":"Who created Python?","targets":["Guido van Rossum","Guido"],"context":null}
```

**对应 pipeline：**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type3.py`

**说明：**
- 默认评测逻辑为 `any_math_verify`：多参考答案中任意一个命中即视为正确。

</details>

<details>
<summary><b>Type4：key3_q_choices_a（选择题：单正确）</b></summary>

**必要 keys：**
- `question`
- `choices`（list）
- `label`（0-based 下标）

**数据示例（jsonl）：**

```json
{"id":"mc_0001","question":"What is the capital of France?","choices":["Paris","London","Berlin","Rome"],"label":0,"context":null}
{"id":"mc_0002","question":"In Python, what does len([1, 2, 3]) return?","choices":["2","3","4","An error"],"label":1,"context":"Choose exactly one option."}
```

**对应 pipeline：**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type4.py`

**说明：**
- 默认使用 `ll_choice_acc`：对每个 choice 计算 loglikelihood，取 argmax 与 `label` 比较。
- 该类型通常不需要生成 `generated_ans`（pipeline 中会默认跳过生成步骤）。

</details>

<details>
<summary><b>Type5：key3_q_choices_as（选择题：多正确）</b></summary>

**必要 keys：**
- `question`
- `choices`（list）
- `labels`（0-based 下标列表）

**数据示例（jsonl）：**

```json
{"id":"ms_0001","question":"Which of the following are prime numbers?","choices":["2","9","11","15"],"labels":[0,2],"context":null}
{"id":"ms_0002","question":"Which of the following are HTTP methods?","choices":["GET","FETCH","POST","PUSH"],"labels":[0,2],"context":"Select all that apply."}
```

**对应 pipeline：**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type5.py`

**说明：**
- 默认 metric 为 `micro_f1`（将模型输出解析为多选集合后计算）。
- 该类型默认需要生成 `generated_ans`（也可直接提供预测列并将 `input_pred_key` 指向该列）。

</details>

<details>
<summary><b>Type6：key3_q_a_rejected（偏好/排序：成对比较）</b></summary>

**必要 keys：**
- `question`
- `better`
- `rejected`

**数据示例（jsonl）：**

```json
{"id":"pw_0001","question":"Explain what overfitting is in machine learning.","better":"Overfitting is when a model learns the training data too closely, including noise, and performs poorly on unseen data.","rejected":"Overfitting means the model is always perfect.","context":null}
{"id":"pw_0002","question":"What is the derivative of x^2?","better":"The derivative of x^2 with respect to x is 2x.","rejected":"The derivative of x^2 is x.","context":"Answer with a direct statement."}
```

**对应 pipeline：**
- `dataflow/statics/pipelines/gpu_pipelines/benchmark_eval/unified_bench_eval_type6.py`

**说明：**
- 默认 metric 为 `pairwise_ll_winrate`：比较 `P(better|prompt)` 与 `P(rejected|prompt)` 的 loglikelihood，统计 win rate。
- 该类型不需要生成答案（pipeline 中会默认跳过生成步骤）。

</details>

## ⚙️ 参数配置（参考写法）

Unified Bench Eval 的 pipeline 文件已经写好评测流程。对大多数用户来说，只需要在流水线代码里修改两处配置即可：

1. **数据与缓存（FileStorage）**
2. **模型服务（Serving：本地模型 / API judge）**

下面给出一个最小“需要改哪里”的示例（按注释替换为你的路径与模型参数即可）：

```python
from dataflow.utils.storage import FileStorage
from dataflow.serving import LocalModelLLMServing_vllm, APILLMServing_request

# 1) 数据与缓存（FileStorage）：把你的评测数据路径与缓存目录填在这里
storage = FileStorage(
    first_entry_file_name="path/to/your_eval_data.jsonl",  # TODO: 你的 jsonl/json 数据文件
    cache_path="./cache_local",                            # TODO: 缓存目录（会写入中间结果与评测结果）
    file_name_prefix="your_bench_name",                    # TODO: 结果/缓存前缀（用于区分不同评测）
    cache_type="jsonl",                                    # TODO: 与输入文件一致（jsonl/json）
)

# 2) 模型服务（Serving）：按需求选择本地模型或 API
# 2.1 本地模型 serving（常用于生成、PPL/LL 等）
llm_serving_local = LocalModelLLMServing_vllm(
    hf_model_name_or_path="Qwen/Qwen2.5-7B-Instruct",      # TODO: 替换为你的模型路径或 HF 名称
    vllm_tensor_parallel_size=1,                           # TODO: 多卡并行配置
    vllm_max_tokens=2048,                                  # TODO: 生成长度上限
)

# 2.2 API judge serving（仅在 key2_qa 语义评测 use_semantic_judge=True 时需要）
llm_serving_judge = APILLMServing_request(
    api_url="https://api.openai.com/v1/chat/completions",   # TODO: 替换为你的 API 地址
    model_name="gpt-4o",                                   # TODO: 替换为你的 judge 模型
    max_workers=5,                                         # TODO: 并发数
)

# 之后在对应 pipeline 里，把 FileStorage 与 Serving 对象替换为上面的配置即可
# 例如：
#   self.storage = storage
#   self.llm_serving_generator = llm_serving_local
#   self.llm_serving_judger = llm_serving_judge
```

## ▶️ 运行评测

```bash
python unified_bench_eval_type2.py
```

## 📊 结果产物与字段含义

评测结束后，结果会写回缓存 DataFrame，并包含以下列（可在 evaluator 参数中自定义列名）：

- `eval_score`：数值评分（accuracy 类任务为 0/1；PPL 为浮点数）
- `eval_pred`：解析后的预测信息（如选项解析、loglikelihood 等）
- `eval_valid`：该样本评测是否有效
- `eval_error`：错误信息（例如 `ll_unavailable` / `ppl_unavailable`）

此外，汇总统计会写入 `eval_result_path`（由各 pipeline 脚本配置），用于快速查看整体指标。

## 🔎 参考实现

如需深度自定义（prompt、metric、解析逻辑等），建议阅读算子实现：

- `dataflow/operators/core_text/generate/bench_answer_generator.py`
- `dataflow/operators/core_text/eval/unified_bench_dataset_evaluator.py`
