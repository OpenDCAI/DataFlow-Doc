---
title: CodeEncodedDataSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/eval/codeencodeddatasampleevaluator/
---

## 📘 概述 [CodeEncodedDataSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluator/code/code_encoded_data_sample_evaluator.py)
CodeEncodedDataSampleEvaluator 是一个基于编码数据模式评估代码样本的算子。它通过检测代码中的 Base64、十六进制和 Unicode 转义序列，为过滤二进制内容和自动生成的代码提供分数。

## __init__函数
```python
def __init__(self)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| 无   | -    | -    | 该算子在初始化时无需传入参数。 |

### Prompt模板说明

## run函数
```python
def run(self, storage, input_key)
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要评估的代码文本字段。 |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
该算子会向 DataFrame 中添加以下新列：

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| CodeEncodedDataBase64Ratio | float | Base64编码数据的比例。 |
| CodeEncodedDataHexRatio | float | 十六进制数据的比例。 |
| CodeEncodedDataUnicodeRatio | float | Unicode转义序列的比例。 |
| CodeEncodedDataScore | float | 综合编码数据得分（0-1），1表示通过编码数据检查。 |
