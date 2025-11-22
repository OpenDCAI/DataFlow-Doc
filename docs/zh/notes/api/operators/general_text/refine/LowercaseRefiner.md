---
title: LowercaseRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/lowercaserefiner/
---

## 📘 概述
`LowercaseRefiner` 是一个文本处理算子，其主要功能是将指定文本字段中的所有大写字母转换为小写字母，从而实现文本格式的统一。

## `__init__`函数
该算子在初始化时无需传入任何参数。

```python
def __init__(self)
```

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称          | 类型              | 默认值 | 说明                                     |
| :------------ | :---------------- | :----- | :--------------------------------------- |
| **storage**   | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str               | 必需   | 输入列名，指定需要转换为小写的文本字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import LowercaseRefiner
from dataflow.utils.storage import FileStorage

class LowercaseRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/lowercase_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = LowercaseRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = LowercaseRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 转换为小写后的文本 |

### 📋 示例输入

```json
{"text":"Hello World! This Is A Test."}
{"text":"SHOUTING IN ALL CAPS"}
{"text":"MiXeD CaSe TeXt"}
{"text":"already lowercase text"}
{"text":"123 Numbers DON'T CHANGE 456"}
```

### 📤 示例输出

```json
{"text":"hello world! this is a test."}
{"text":"shouting in all caps"}
{"text":"mixed case text"}
{"text":"already lowercase text"}
{"text":"123 numbers don't change 456"}
```

### 📊 结果分析

在本测试中，5条输入数据中有4条被修改：

**样本1（标题大小写）**：
- 原文："Hello World! This Is A Test."
- 所有大写字母转换为小写
- 结果："hello world! this is a test."
- **已修改**

**样本2（全大写）**：
- 原文："SHOUTING IN ALL CAPS"
- 所有字母转换为小写
- 结果："shouting in all caps"
- **已修改**

**样本3（混合大小写）**：
- 原文："MiXeD CaSe TeXt"
- 所有大写字母转换为小写
- 结果："mixed case text"
- **已修改**

**样本4（已是小写）**：
- 原文："already lowercase text"
- 文本已经全部小写
- **未修改**（保持原样）

**样本5（数字和缩写）**：
- 原文："123 Numbers DON'T CHANGE 456"
- 字母转换为小写，数字保持不变
- 结果："123 numbers don't change 456"
- **已修改**

**应用场景**：
- 文本标准化和规范化处理
- 为不区分大小写的文本匹配做准备
- 数据去重前的预处理
- NLP 任务中的文本归一化

**注意事项**：
- 该算子使用 Python 的 `lower()` 方法
- 数字和标点符号保持不变
- 建议在文本分析和匹配前使用
- 可能影响专有名词的识别
