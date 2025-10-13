---
title: RemoveEmoticonsRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removeemoticonsrefiner/
---

## 📘 概述 [RemoveEmoticonsRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refiners/remove_emoticons_refiner.py)
该算子用于移除文本中的文本型表情符号，例如':-)'、':D'、':('等字符组合表情。基于预定义的表情符号字典进行匹配替换，支持多种常见文本表情模式。

## __init__函数
```python
def __init__(self)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| - | - | - | 该算子在初始化时无需传入任何参数。 |

### Prompt模板说明


## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待处理的文本字段。 |

## 🧠 示例用法
