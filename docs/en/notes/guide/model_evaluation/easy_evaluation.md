---
title: easy_evaluation
icon: hugeicons:chart-evaluation
createTime: 2025/10/17 15:20:10
permalink: /en/guide/97wq40d9/
---

# 📊 Model Evaluation Pipeline Guide

This guide explains how to use the **DataFlow** evaluation pipeline to assess model-generated answers against ground-truth answers using either **semantic** or **exact match** comparison.  
Two evaluation modes are supported:

1. **Direct Comparison Mode**: Compare existing model outputs with ground truth answers.  
2. **Generate-and-Evaluate Mode**: First generate model answers, then compare them with ground truth answers.

---

## 🧩 Step 1: Install the Evaluation Environment

```bash
cd DataFlow
pip install -e .
````

This installs DataFlow in editable mode, making it easier for local development and debugging.

---

## 📁 Step 2: Create and Enter the Workspace

```bash
mkdir workspace
cd workspace
```

All configuration files and cached evaluation data will be stored in this workspace directory.

---

## ⚙️ Step 3: Initialize the Evaluation Configuration

Run the following command to initialize the evaluation configuration:

```bash
dataflow init
```

After initialization, the directory structure will look like this:

```text
api_pipelines/
├── core_text_bencheval_semantic_pipeline.py                # Evaluator for API models
├── core_text_bencheval_semantic_pipeline_question.py        # Evaluator for local models (requires question)
└── core_text_bencheval_semantic_pipeline_question_single_step.py # Evaluator for local models (generate + evaluate)
```

---

## 🚀 Step 4: Run the Evaluation

Navigate to the `api_pipelines` folder:

```bash
cd api_pipelines
```

Select the corresponding script based on your evaluation mode:

<table>
  <thead>
    <tr>
      <th style="width: 22%">🧩 Task Type</th>
      <th style="width: 22%">❓ Requires Question</th>
      <th style="width: 22%">🧠 Generates Answers</th>
      <th style="width: 34%">▶️ Script to Run</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Compare existing answers (no Question required)</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td><code>core_text_bencheval_semantic_pipeline.py</code></td>
    </tr>
    <tr>
      <td>Compare existing answers (requires Question)</td>
      <td align="center">✅</td>
      <td align="center">❌</td>
      <td><code>core_text_bencheval_semantic_pipeline_question.py</code></td>
    </tr>
    <tr>
      <td>Generate answers then compare (requires Question)</td>
      <td align="center">✅</td>
      <td align="center">✅</td>
      <td><code>core_text_bencheval_semantic_pipeline_question_single_step.py</code></td>
    </tr>
  </tbody>
</table>

Example:

```bash
python core_text_bencheval_semantic_pipeline_question_single_step.py
```

---

## 🗂️ Data Storage Configuration

Evaluation data paths are managed by `FileStorage`, which can be customized in the script:

```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/chemistry/matched_sample_10.json",
    cache_path="./cache_all_17_24_gpt_5",
    file_name_prefix="math_QA",
    cache_type="json",
)
```

* **first_entry_file_name** — Path to the evaluation dataset (e.g., example data)
* **cache_path** — Directory for caching intermediate evaluation results
* **file_name_prefix** — Prefix for cached files
* **cache_type** — File type for cache (typically `json`)

---

## 🧠 Step 5: Define Evaluation Keys

Specify the field mappings between model outputs and ground-truth labels:

```python
self.evaluator_step.run(
    storage=self.storage.step(),
    input_test_answer_key="model_answer",
    input_gt_answer_key="golden_label",
)
```

* **input_test_answer_key** — Key name for model-generated answers
* **input_gt_answer_key** — Key name for ground-truth answers

Make sure the field names match the corresponding keys in your dataset.
