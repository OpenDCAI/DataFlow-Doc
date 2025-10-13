---
title: GeneralFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/filter/generalfilter/
---

## 📘 概述
该算子支持通过多个自定义函数对 DataFrame 进行灵活过滤。

每条过滤规则是一个函数（例如 lambda 表达式），接受一个 DataFrame 并返回一个布尔类型的 Series，用于指定保留哪些行。

输入参数：
- filter_rules：一个函数列表，每个函数形式为 lambda df: ...，需返回一个与 df 长度一致的布尔 Series。所有规则之间采用与（AND）关系组合。

示例：
  - lambda df: df['score'] > 0.5
  - lambda df: df['label'].isin(['A', 'B'])

## __init__函数
```python
def __init__(self, filter_rules: list):
```
### init参数说明
| 参数名          | 类型 | 默认值 | 说明                                                                                              |
| :-------------- | :--- | :----- | :------------------------------------------------------------------------------------------------ |
| **filter_rules** | list | 必需   | 一个函数列表，每个函数用于定义一条过滤规则（例如 `lambda df: df['score'] > 0.5`），所有规则之间为“与”关系。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :-------------- | :------- | :------- | :------- |
|                 |          |          |          |

## run函数
```python
def run(self, storage: DataFlowStorage):
```
#### 参数
| 名称      | 类型            | 默认值 | 说明                           |
| :-------- | :-------------- | :----- | :----------------------------- |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。 |

## 🧠 示例用法
```python

```
