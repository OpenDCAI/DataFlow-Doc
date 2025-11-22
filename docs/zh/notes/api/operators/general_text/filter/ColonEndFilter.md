---
title: ColonEndFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/colonendfilter/
---

## 📘 概述
`ColonEndFilter` 是一个过滤算子，用于检查输入文本是否以冒号（`:`）结尾。该算子通常用于数据清洗阶段，过滤掉可能不完整的句子或问题。

## `__init__`函数
```python
def __init__(self)
```
### init参数说明
该算子在初始化时无需任何参数。

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = None)
```
执行算子主逻辑，从存储中读取输入 DataFrame，检查指定列的文本是否以冒号结尾，并将不以冒号结尾的数据行写回存储。

#### 参数
| 名称         | 类型              | 默认值 | 说明                                                         |
| :------------- | :---------------- | :------- | :----------------------------------------------------------- |
| **storage**    | DataFlowStorage   | 必需     | 数据流存储实例，负责读取与写入数据。                         |
| **input_key**  | str               | 必需     | 输入列名，指定要检查的文本字段。                             |
| **output_key** | str               | None     | 输出列名，用于存储过滤标签（1代表保留，0代表过滤）。若不指定，将自动生成为"colonendfilter_label"。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import ColonEndFilter
from dataflow.utils.storage import FileStorage

class ColonEndFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/colon_end_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = ColonEndFilter()
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = ColonEndFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
算子会向DataFrame中添加一个新的`output_key`列，其值为1（不以冒号结尾，保留）或0（以冒号结尾，过滤），然后过滤掉值为0的行。最终输出的DataFrame只包含通过过滤的行。

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 原始输入文本 |
| colonendfilter_label | int | 过滤标签（1表示保留，0表示过滤） |

### 📋 示例输入

```json
{"text": "This is a complete sentence without a colon."}
{"text": "This sentence ends with a colon:"}
{"text": "Question: What is this?"}
{"text": "Another incomplete question:"}
{"text": "A proper statement with punctuation."}
```

### 📤 示例输出

```json
{"text": "This is a complete sentence without a colon.", "colonendfilter_label": 1}
{"text": "Question: What is this?", "colonendfilter_label": 1}
{"text": "A proper statement with punctuation.", "colonendfilter_label": 1}
```

### 📊 结果分析

**样本1（完整句子）**：
- 文本："This is a complete sentence without a colon."
- 不以冒号结尾
- **保留**（colonendfilter_label=1）

**样本2（以冒号结尾）**：
- 文本："This sentence ends with a colon:"
- 以冒号结尾
- **过滤**（colonendfilter_label=0，不在输出中）

**样本3（冒号在中间）**：
- 文本："Question: What is this?"
- 冒号在中间，以问号结尾
- **保留**（colonendfilter_label=1）

**样本4（以冒号结尾）**：
- 文本："Another incomplete question:"
- 以冒号结尾
- **过滤**（colonendfilter_label=0，不在输出中）

**样本5（正常标点）**：
- 文本："A proper statement with punctuation."
- 以句号结尾
- **保留**（colonendfilter_label=1）

**应用场景**：
- 过滤不完整的问题或标题
- 清除可能被截断的文本
- 识别和移除待补充的内容提示
- 提高对话或问答数据集的质量

**典型被过滤的文本模式**：
- "请解释以下概念："
- "问题："
- "标题："
- "主要内容："

**注意事项**：
- 只检查文本是否以冒号字符`:`结尾
- 不会检查中文冒号`：`（如需要请修改源码）
- 会保留冒号出现在文本中间的情况
