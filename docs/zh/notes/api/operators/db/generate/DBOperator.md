---
title: DBOperator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/db/generate/dboperator/
---

## 📘 概述
`DBOperator` 是一个数据库操作算子，用于在指定的数据库存储上执行 SQL 表达式。

## `__init__`函数
```python
def __init__(self, expr)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **expr** | str | 必需 | 要执行的 SQL 表达式。 |

## `run`函数
```python
def run(self, storage:MyScaleDBStorage, input_key:str)
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | MyScaleDBStorage | 必需 | 要使用的数据库存储实例。 |
| **input_key** | str | 必需 | 输入数据的键。 |

#### 返回值
| 类型 | 说明 |
| :---- | :---------- |
| list | SQL 查询执行的结果。 |

## 🧠 示例用法
```python
```
