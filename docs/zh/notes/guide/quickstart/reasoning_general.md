---
title: 案例4. 通用推理数据的合成与处理
createTime: 2025/07/16 20:10:28
permalink: /zh/guide/reasoning_general/
icon: basil:lightning-alt-outline
---

# 从0开始合成各领域推理QA数据

## 第一步:安装dataflow环境
```shell
pip install open-dataflow
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
这时你会看见
```shell
run_dataflow/pipelines/api_pipelines/reasoning_general_pipeline.py  
```
## 第四步:填入你的api key以及api_url
对于Linux和Mac OS
```shell
export DF_API_KEY="sk-xxxxx"
```

对于Windows
```powershell
$env:DF_API_KEY = "sk-xxxxx"
```
`text_sft_synthesis_pipeline.py`中的api_url填写方式如下：
```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=100
)
```

## 第五步:一键运行
```bash
python pipelines/api_pipelines/reasoning_general_pipeline.py
```

运行时，该流水线会先后调用：
1. ReasoningQuestionFilter, 做问题质量检查过滤
2. ReasoningQuestionGenerator 做新问题的合成
3. ReasoningAnswerGenerator 做答案的合成
4. ReasoningAnswerNgramFilter 做去重

对于算子的具体功能介绍可以参考[强推理算子](/zh/guide/Reasoning_operators/)部分，此处调用后会在`run_dataflow/cache_local`中生成一个json文件，文件内容如下文所示。
## 合成数据示例
```json
{
    "instruction":"In the last quarter, a commercial bank reported a rise in its non-performing loan ratio from 2.1% to 3.4%. What might this indicate about the bank's loan portfolio?",
    "output":"This increase suggests that more borrowers are struggling to repay their loans, potentially due to economic slowdowns or tighter household finances. It indicates a deterioration in the quality of the bank’s loan assets and may lead to increased provisions.",
    "golden_answer":"Higher credit risk due to more troubled loans.",
    "source":"Finance_banking",
    "Synth_or_Input":"input",
    "generated_cot":"Solution:\n1. Identify key components and premises of the task:\n→ Non-performing loan (NPL) ratio increase from 2.1% to 3.4%\n→ Quarter timeframe for observation\n\n2. Apply relevant principles, theorems, or methods with step-by-step derivation or argument:\n→ NPL ratio is a measure of loan repayment risk and indicates the proportion of non-paying loans in total loans\n→ An increase suggests a deterioration in the quality of the loan portfolio\n→ Possible causes for this deterioration might be economic downturn, poor underwriting practices, or increased credit risk exposure\n\n3. Perform any necessary calculations or logical checks with intermediate verification:\n→ Change in NPL ratio: 3.4\\% - 2.1\\% = 1.3\\%\n→ Verify impact: A rise of 1.3 percentage points in a single quarter is significant, indicating substantial risk factors affecting loan performance\n\n4. Present the final answer or conclusion in a clear, unambiguous notation:\n→ The increase in the non-performing loan ratio suggests that the bank's loan portfolio may be facing heightened credit risks, potential defaults, or poor economic conditions affecting borrowers."
}
```