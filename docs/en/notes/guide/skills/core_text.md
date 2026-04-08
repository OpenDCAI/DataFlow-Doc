---
title: Core Text Operators
icon: material-symbols:extension
createTime: 2026/04/08 22:45:39
permalink: /en/guide/skills/core_text/
---

# Core Text Operator Reference

Extended operator reference for the [Generating DataFlow Pipeline](./generating_dataflow_pipeline.md) skill. When the 6 core primitives don't cover your task, consult the detailed per-operator documentation here.

## Available Operators

### Generate (`core_text/generate/`)

| Operator | Description |
|----------|-------------|
| `prompted-generator` | Basic single-field LLM generation |
| `format-str-prompted-generator` | Multi-field template-based generation |
| `chunked-prompted-generator` | Long document chunk-by-chunk processing |
| `embedding-generator` | Text vectorization using embedding APIs |
| `retrieval-generator` | Async RAG generation using LightRAG |
| `bench-answer-generator` | Benchmark answer generation with evaluation type variants |
| `text2multihopqa-generator` | Multi-hop QA pair construction from text |
| `random-domain-knowledge-row-generator` | Domain-specific row generation from seed data |

### Filter (`core_text/filter/`)

| Operator | Description |
|----------|-------------|
| `prompted-filter` | LLM-based quality scoring and filtering |
| `general-filter` | Rule-based deterministic filtering |
| `kcentergreedy-filter` | Diversity-based filtering using k-Center Greedy |

### Refine (`core_text/refine/`)

| Operator | Description |
|----------|-------------|
| `prompted-refiner` | LLM-based text rewriting and refinement |
| `pandas-operator` | Custom pandas DataFrame operations |

### Eval (`core_text/eval/`)

| Operator | Description |
|----------|-------------|
| `prompted-evaluator` | LLM-based scoring and evaluation |
| `bench-dataset-evaluator` | Benchmark dataset evaluation |
| `bench-dataset-evaluator-question` | Benchmark question-level evaluation |
| `text2qa-sample-evaluator` | QA sample quality evaluation |
| `unified-bench-dataset-evaluator` | Unified benchmark evaluation across formats |

## Directory Structure

Each operator folder follows the same layout:

```
<operator-name>/
├── SKILL.md          # English documentation: use cases, imports, parameters, run() examples
├── SKILL_zh.md       # Chinese documentation
└── examples/
    ├── good.md       # Correct usage with a simple single-operator pipeline, sample input and output
    └── bad.md        # Common mistakes and anti-patterns
```
