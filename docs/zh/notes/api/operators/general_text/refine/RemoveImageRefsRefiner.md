---
title: RemoveImageRefsRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removeimagerefsrefiner/
---

## 📘 概述
`RemoveImageRefsRefiner` 算子用于去除文本中的图片引用格式，包括Markdown图片链接、图片编号、特殊符号组合等图像引用模式。通过多模式正则表达式匹配，该算子能有效识别并移除多种图片引用格式，净化文本数据。

## __init__函数
```python
def __init__(self)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **无** | - | - | 该算子在初始化时无需传入任何参数。 |

## run函数
```python
def run(self, storage, input_key)
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要处理的文本字段。 |

### Prompt模板说明


## 🧠 示例用法


#### 🧾 默认输出格式（Output Format）
该算子会直接修改输入 `DataFrame` 中 `input_key` 指定的列，将清理后的文本写回原位。输出的数据格式与输入保持一致，但指定列的文本内容已移除了图片引用。

示例输入 `DataFrame` 中的一行：
```json
{
"text_column": "这是一个示例句子 
![](/images/example.jpg)
 包含了图片引用。",
"other_column": 123
}
```
当 `input_key="text_column"` 时，处理后的输出 `DataFrame` 中的对应行：
```json
{
"text_column": "这是一个示例句子  包含了图片引用。",
"other_column": 123
}
```
