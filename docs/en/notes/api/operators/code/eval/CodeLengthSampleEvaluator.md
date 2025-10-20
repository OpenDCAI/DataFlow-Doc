---
title: CodeLengthSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/eval/codelengthsampleevaluator/
---

## 📘 Overview
`CodeLengthSampleEvaluator` evaluates code samples based on length characteristics to provide scores for filtering oversized files and poorly formatted code. It analyzes total lines, average line length, and maximum line length, applying different thresholds for different programming languages.

## __init__函数
```python
def __init__(self)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :----- | :--- | :----- | :--- |

## Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称          | 类型              | 默认值 | 说明                                                          |
| :------------ | :---------------- | :----- | :------------------------------------------------------------ |
| **storage**   | DataFlowStorage   | 必需   | Data storage object for reading and writing data.             |
| **input_key** | str               | 必需   | Key name for the input data containing the code to be evaluated. |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
| 字段                      | 类型    | 说明                                     |
| :------------------------ | :------ | :--------------------------------------- |
| **CodeLengthTotalLines**  | int     | Total number of lines in the code sample. |
| **CodeLengthAvgLineLength** | float   | Average length of lines in the code sample. |
| **CodeLengthMaxLineLength** | int     | Maximum length of a single line in the code sample. |
| **CodeLengthScore**       | float   | Comprehensive score from 0.0 to 1.0, where 1.0 indicates the sample passes all length checks. |

示例输入：
```json
{
  "code_sample": {
    "lines": [
      "def calculate_sum(a, b):",
      "    # This is a simple function to add two numbers",
      "    return a + b"
    ],
    "language": "Python"
  }
}
```
示例输出：
```json
{
  "code_sample": {
    "lines": [
      "def calculate_sum(a, b):",
      "    # This is a simple function to add two numbers",
      "    return a + b"
    ],
    "language": "Python"
  },
  "CodeLengthTotalLines": 3,
  "CodeLengthAvgLineLength": 32.666666666666664,
  "CodeLengthMaxLineLength": 52,
  "CodeLengthScore": 1.0
}
```
