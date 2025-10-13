---
title: ReasoningAnswerTokenLengthFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/filter/reasoninganswertokenlengthfilter/
---

## 📘 概述
`ReasoningAnswerTokenLengthFilter` 是一个答案过滤算子，用于根据答案文本的 token 数量来筛选数据。它会移除那些 token 长度超过预设最大值的答案，确保下游处理的数据符合长度要求。该算子使用指定的 tokenizer 来计算 token 数量。

## `__init__`函数
```python
def __init__(self,
            max_answer_token_length: int = 8192,
            tokenizer_dir: str = "Qwen/Qwen2.5-0.5B-Instruct")
```
### init参数说明
| 参数名                      | 类型 | 默认值                         | 说明                               |
| :------------------------ | :--- | :----------------------------- | :--------------------------------- |
| **max_answer_token_length** | int  | 8192                           | 答案所允许的最大 token 长度。      |
| **tokenizer_dir**         | str  | "Qwen/Qwen2.5-0.5B-Instruct"   | 用于计算 token 数量的分词器模型目录或名称。 |

## `run`函数
```python
def run(self,
        storage: DataFlowStorage,
        input_key: str = "generated_cot")
```
#### 参数
| 名称        | 类型            | 默认值          | 说明                                     |
| :---------- | :-------------- | :-------------- | :--------------------------------------- |
| **storage** | DataFlowStorage | 必需            | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | str             | "generated_cot" | 输入列名，对应需要检查 token 长度的答案字段。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
该算子是一个过滤器，它不会改变数据的列结构。输出的数据格式与输入完全相同，但只包含那些在 `input_key` 列中 token 长度符合 `max_answer_token_length` 限制的行。

| 字段                      | 类型 | 说明                                       |
| :------------------------ | :--- | :----------------------------------------- |
| ... (输入数据原有字段) | ...  | 输入数据中的所有原始字段都将被保留。       |
| `input_key`指定的列      | str  | 经过长度校验且符合条件的答案文本。         |
