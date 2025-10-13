---
title: RemoveExtraSpacesRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removeextraspacesrefiner/
---

## 📘 概述

[RemoveExtraSpacesRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refine/remove_extra_spaces_refiner.py) 是一个文本优化算子，用于移除指定文本字段中的多余空格。它会将连续的多个空格替换为单个空格，并移除文本开头和结尾的空白字符，以实现文本格式的标准化。

## \_\_init\_\_函数

```python
def __init__(self)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :----- | :--- | :----- | :--- |
| **-**  | -    | -      | 无初始化参数 |

## run函数

```python
def run(self, storage, input_key)
```

#### 参数

| 名称        | 类型            | 默认值 | 说明                                     |
| :---------- | :-------------- | :----- | :--------------------------------------- |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | str             | 必需   | 输入列名，对应需要进行空格标准化的文本字段。 |

## Prompt模板说明

## 🧠 示例用法

## 🧾 默认输出格式（Output Format）

该算子会就地修改 `input_key` 指定的列，输出的 DataFrame 结构与输入相同，但目标列的文本内容经过了空格标准化处理。

| 字段        | 类型 | 说明                   |
| :---------- | :--- | :--------------------- |
| [input\_key] | str  | 经过空格标准化处理后的文本。 |

#### 示例输入：

```json
{
  "text": "  Hello   world,  this is   an example.  "
}
```

#### 示例输出 (当 `input_key="text"`):

```json
{
  "text": "Hello world, this is an example."
}
```
