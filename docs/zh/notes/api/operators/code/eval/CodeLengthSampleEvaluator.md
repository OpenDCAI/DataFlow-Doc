---
title: CodeLengthSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/eval/codelengthsampleevaluator/
---

## 📘 概述
`CodeLengthSampleEvaluator` 算子基于代码的长度特征来评估代码样本，旨在为过滤掉过大文件和格式不佳的代码提供评分依据。它会分析代码的总行数、平均行长和最大行长，并针对不同编程语言应用不同的阈值。

## `__init__`函数
```python
def __init__(self)
```
### init参数说明
该函数在初始化时无需传入参数。

### Prompt模板说明

## `run`函数
```python
def run(storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，该列包含需要评估的代码样本。 |

## 🧠 示例用法


#### 🧾 默认输出格式（Output Format）
该算子会在原始数据的基础上，添加以下字段：
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| CodeLengthTotalLines | int | 代码的总行数。 |
| CodeLengthAvgLineLength | float | 代码的平均行长。 |
| CodeLengthMaxLineLength | int | 代码的最大行长。 |
| CodeLengthScore | float | 综合长度得分 (0.0-1.0)，1.0表示通过所有长度检查，0.0表示未通过。 |
