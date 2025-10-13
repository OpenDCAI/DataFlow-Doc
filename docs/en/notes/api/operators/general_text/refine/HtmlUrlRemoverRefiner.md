---
title: HtmlUrlRemoverRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/htmlurlremoverrefiner/
---

## 📘 Overview
[HtmlUrlRemoverRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refine/html_url_remover_refiner.py) is an operator designed to clean text data by removing URL links and HTML tags. It uses regular expressions to identify and eliminate these elements, resulting in purified text content. This is useful for preprocessing text data before further analysis or model training.

## __init__函数
```python
def __init__(self)
```
This operator does not require any parameters during initialization.

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
Executes the main logic of the operator. It reads a DataFrame from storage, cleans the specified text column by removing URLs and HTML tags, and writes the modified DataFrame back to storage.

#### 参数
| 名称          | 类型              | 默认值 | 说明                                                                   |
| :------------ | :---------------- | :----- | :--------------------------------------------------------------------- |
| **storage**   | DataFlowStorage   | 必需   | DataFlow storage instance, responsible for reading and writing data.   |
| **input_key** | str               | 必需   | The name of the column in the DataFrame that contains the text to be cleaned. |

## Prompt Template Descriptions
Not applicable for this operator.

## 🧠 Example Usage
```python
```

#### 🧾 默认输出格式（Output Format）
The operator modifies the input DataFrame in-place. The column specified by `input_key` will have its content cleaned.

示例输入：
```json
{
"text_data": "This is a test. Visit our website: <a href='https://example.com'>Click here</a> for more info."
}
```
示例输出：
```json
{
"text_data": "This is a test. Visit our website: Click here for more info."
}
```
