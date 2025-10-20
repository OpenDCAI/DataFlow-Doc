---
title: BenchDatasetEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/eval/benchdatasetevaluator/
---

## 📘 概述 [BenchDatasetEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluator/bench_dataset_evaluator.py)
该算子用于对比预测答案与标准答案的匹配度，支持两种评估模式：

1.  字符串匹配（match）：使用数学验证方法比较答案，适用于有明确答案的问题
2.  语义匹配（semantic）：使用LLM评估答案的语义相似度，适用于开放性问题

输入参数：
-   input\_test\_answer\_key：预测答案字段名
-   input\_gt\_answer\_key：标准答案字段名
-   input\_question\_key：问题字段名（语义匹配模式下必需）
-   compare\_method：比较方法（match/semantic）

输出参数：
-   answer\_match\_result：匹配结果（True/False）
-   统计结果将保存到指定的eval\_result\_path路径

## \_\_init\_\_函数

```python
def __init__(self,
            eval_result_path: str = None,
            compare_method: Literal["match", "semantic"] = "match",
            system_prompt: str = "You are a helpful assistant specialized in evaluating answer correctness.",
            llm_serving: LLMServingABC = None,
            prompt_template = None
            ):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **eval\_result\_path** | str | None | 评估结果的保存路径。若不指定，则自动生成带有时间戳的文件名。 |
| **compare\_method** | Literal["match", "semantic"] | "match" | 评估方法，'match'表示字符串精确匹配（适用于数学等），'semantic'表示使用LLM进行语义相似度匹配。 |
| **system\_prompt** | str | "You are a helpful assistant specialized in evaluating answer correctness." | 当使用'semantic'评估方法时，传递给LLM的系统提示词。 |
| **llm\_serving** | LLMServingABC | None | 大语言模型服务实例，当 `compare_method` 为 'semantic' 时必需。 |
| **prompt\_template** | PromptABC | None | 提示词模板对象，当 `compare_method` 为 'semantic' 时使用。若不指定，则默认为 `AnswerJudgePrompt`。 |

### Prompt模板说明

## run函数

```python
def run(
        self,
        storage:DataFlowStorage,
        input_test_answer_key: str = "generated_cot",
        input_gt_answer_key: str = "golden_answer",
        input_question_key: str = None,
        ) -> list:
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input\_test\_answer\_key** | str | "generated\_cot" | 输入列名，对应待评估的答案字段。 |
| **input\_gt\_answer\_key** | str | "golden\_answer" | 输入列名，对应标准答案（ground truth）字段。 |
| **input\_question\_key** | str | None | 输入列名，对应问题字段。当 `compare_method` 为'semantic'时必需。 |

## 🧠 示例用法
