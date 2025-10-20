---
title: 模型评估流水线
icon: hugeicons:chart-evaluation
createTime: 2025/10/17 15:00:50
permalink: /zh/guide/enty5ksn/
---

# 📊 模型评估流水线使用指南

本指南介绍如何使用 **DataFlow** 的评估流水线，对模型生成答案与标准答案进行语义或精确匹配评估。
支持以下两种模式：

1. **直接对比模式**：对已有生成结果与标准答案进行比对。
2. **生成-评估模式**：先由模型生成答案，再与标准答案进行对比。

---

## 🧩 第一步：安装评估环境

```bash
cd DataFlow
pip install -e .
```

这将以可编辑模式安装 DataFlow，方便本地开发与调试。

---

## 📁 第二步：创建并进入工作目录

```bash
mkdir workspace
cd workspace
```

所有评估相关的配置文件与缓存数据都将在该目录下生成和保存。

---

## ⚙️ 第三步：初始化评估配置文件

使用以下命令初始化评估配置：

```bash
dataflow init
```

初始化后，项目目录结构如下：

```text
api_pipelines/
├── core_text_bencheval_semantic_pipeline.py                # 评估器：API模型
├── core_text_bencheval_semantic_pipeline_question.py        # 评估器：本地模型（需要question）
└── core_text_bencheval_semantic_pipeline_question_single_step.py # 评估器：本地模型（先生成再评估）
```

---

## 🚀 第四步：运行评估

进入 `api_pipelines` 文件夹：

```bash
cd api_pipelines
```

根据你的任务选择对应脚本运行：

<table>
  <thead>
    <tr>
      <th style="width: 22%">🧩 任务类型</th>
      <th style="width: 22%">❓ 是否需要 Question</th>
      <th style="width: 22%">🧠 是否需要生成答案</th>
      <th style="width: 34%">▶️ 运行脚本</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>对比已有答案（无需 Question）</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td><code>core_text_bencheval_semantic_pipeline.py</code></td>
    </tr>
    <tr>
      <td>对比已有答案（需要 Question）</td>
      <td align="center">✅</td>
      <td align="center">❌</td>
      <td><code>core_text_bencheval_semantic_pipeline_question.py</code></td>
    </tr>
    <tr>
      <td>先生成答案再对比（需要 Question）</td>
      <td align="center">✅</td>
      <td align="center">✅</td>
      <td><code>core_text_bencheval_semantic_pipeline_question_single_step.py</code></td>
    </tr>
  </tbody>
</table>

示例：

```bash
python core_text_bencheval_semantic_pipeline_question_single_step.py
```

---

## 🗂️ 数据存储与配置说明

评估数据路径由 `FileStorage` 管理，可在脚本中修改：

```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/chemistry/matched_sample_10.json",
    cache_path="./cache_all_17_24_gpt_5",
    file_name_prefix="math_QA",
    cache_type="json",
)
```

* **first_entry_file_name**：评估数据文件路径（如示例数据）
* **cache_path**：评估中间结果缓存路径
* **file_name_prefix**：缓存文件名前缀
* **cache_type**：缓存文件类型（通常为 `json`）

---

## 🧠 第五步：设置评估字段

定义模型输出与标准答案的对应字段：

```python
self.evaluator_step.run(
    storage=self.storage.step(),
    input_test_answer_key="model_answer",
    input_gt_answer_key="golden_label",
)
```

* **input_test_answer_key**：模型生成的答案字段名
* **input_gt_answer_key**：标准答案（golden label）字段名

请确保字段名与数据文件中的键名完全一致。
