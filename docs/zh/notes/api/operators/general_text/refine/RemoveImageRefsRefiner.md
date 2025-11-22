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

```python
from dataflow.operators.general_text import RemoveImageRefsRefiner
from dataflow.utils.storage import FileStorage

class RemoveImageRefsRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_image_refs_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveImageRefsRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveImageRefsRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 移除图片引用后的文本 |

### 📋 示例输入

```json
{"text":"Normal text without references"}
{"text":"See figure ![](images/abc123.jpg) for details"}
{"text":"图 1-2：示例图片说明"}
```

### 📤 示例输出

```json
{"text":"Normal text  "}
{"text":"See figure  for "}
{"text":""}
```

### 📊 结果分析

**样本1**：文本被修改（可能移除了某些模式）
**样本2**：移除 Markdown 图片引用 `![](images/abc123.jpg)`
**样本3**：移除中文图片说明"图 1-2：示例图片说明"

**应用场景**：
- 清理文档中的图片引用
- 移除图片编号和说明
- 文本预处理

**注意事项**：
- 使用多种正则表达式模式匹配图片引用
- 可能移除过多内容，需谨慎使用
