---
title: CodeTextCompositionSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/eval/codetextcompositionsampleevaluator/
---

好的，这是根据您提供的代码和模板生成的 `CodeTextCompositionSampleEvaluator` 算子的教程 Markdown。

---

## 📘 概述

`CodeTextCompositionSampleEvaluator` 是一个代码文本组成样本评估算子，它基于字符组成来评估代码样本，旨在过滤掉二进制文件、加密内容或其他不可读的文本。该算子通过分析字母字符和字母数字字符的比例来确保内容的可读性。

## __init__函数

```python
def __init__(self)
```

### init参数说明

该函数在初始化时无需传入参数。

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称        | 类型            | 默认值 | 说明                                                                      |
| :---------- | :-------------- | :----- | :------------------------------------------------------------------------ |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。                                      |
| **input_key** | str             | 必需   | 输入列名，该列数据应为包含代码的文本字符串或包含 'text' 和 'language' 键的字典。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

该算子会向原始数据中添加以下三个评分字段：

| 字段                          | 类型  | 说明                                        |
| :---------------------------- | :---- | :------------------------------------------ |
| CodeTextCompositionAlphaRatio | float | 文本中字母字符的比例。                      |
| CodeTextCompositionAlnumRatio | float | 文本中字母和数字字符的总比例。              |
| CodeTextCompositionScore      | float | 综合字符组成得分 (0.0 或 1.0)，1.0 表示通过检查。 |
