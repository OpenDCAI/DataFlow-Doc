---
title: DataFlow Skills
icon: material-symbols:auto-awesome
createTime: 2026/05/22 12:45:39
permalink: /en/guide/quickstart/dataflow_skills/
---

# DataFlow Skills

Reusable [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code/skills) for working with [DataFlow](https://github.com/OpenDCAI/DataFlow). Three skills are available:

| Skill | What it does | Invoke with |
|---|---|---|
| **`generating-dataflow-pipeline`** | From a target description + a sample JSONL file, plan the operator chain and emit a runnable DataFlow pipeline. | `/generating-dataflow-pipeline` |
| **`dataflow-dev`** | DataFlow developer assistant. Routes intents (new operator / new pipeline / new prompt / diagnose error / code review / KB sync) into the right workflow. Run inside a DataFlow repo. | `/dataflow-dev` |
| **`core_text`** | Per-operator API reference (8 generators, 3 filters, 2 refiners, 5 evaluators). Consulted by the pipeline skill when it needs operators beyond the 6 core primitives. | _(not directly invoked)_ |


## Install

**Prerequisite:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI on your `PATH`.

```bash
git clone https://github.com/haolpku/DataFlow-Skills.git
cd DataFlow-Skills
./install.sh
```

That copies all three skills into `~/.claude/skills/` (user-level — available in every project). Then in any Claude Code session:

```
/generating-dataflow-pipeline
```

If the slash command shows up in completion, you're done.

### Install options

```bash
./install.sh --project                       # install into ./.claude/skills/ instead
./install.sh dataflow-dev                    # install only the named skill(s)
./install.sh --force                         # overwrite existing skills (default: skip)
```

### Update

```bash
cd DataFlow-Skills
git pull
./install.sh --force
```

## Generating DataFlow Pipeline

> [Video Tutorial: Generate DataFlow Pipeline](https://github.com/user-attachments/assets/ca1fefbf-9bf7-469f-b856-b201952fb99b)

A reasoning-guided pipeline planner. Given a **target** (what the pipeline should achieve) and a **sample JSONL file** (1–5 representative rows), it analyzes the data, selects operators, validates field dependencies, and generates a complete, runnable DataFlow pipeline in Python.

### Quick Start

#### 1. Prepare Your Data

Create a JSONL file (one JSON object per line) with 1–5 representative rows:

```jsonl
{"product_name": "Laptop", "category": "Electronics"}
{"product_name": "Coffee Maker", "category": "Appliances"}
```

#### 2. Run the Skill

In Claude Code, invoke `/generating-dataflow-pipeline` and describe your target:

```
/generating-dataflow-pipeline
Target: Generate product descriptions and filter high-quality ones
Sample file: ./data/products.jsonl
Expected outputs: generated_description, quality_score
```

#### 3. Review the Output

The skill returns a two-stage result:

1. **Intermediate Operator Decision** — JSON with operator chain, field flow, and reasoning
2. **Complete 5-Section Response**:
   - Field Mapping — which fields exist vs. need to be generated
   - Ordered Operator List — operators in execution order with justification
   - Reasoning Summary — why this design satisfies the target
   - Complete Pipeline Code — full executable Python following standard structure
   - Adjustable Parameters / Caveats — tunable knobs and debugging tips

### Six Core Operators

| Operator | Purpose | LLM? |
|----------|---------|------|
| `PromptedGenerator` | Single-field LLM generation | Yes |
| `FormatStrPromptedGenerator` | Multi-field template-based generation | Yes |
| `Text2MultiHopQAGenerator` | Multi-hop QA pair construction from text | Yes |
| `PromptedFilter` | LLM-based quality scoring & filtering | Yes |
| `GeneralFilter` | Rule-based deterministic filtering | No |
| **KBC Trio** (3 operators, always together in order) | File/URL → Markdown → chunks → clean text | Partial |

### Generated Pipeline Structure

All generated pipelines follow the same standard structure:

```python
from dataflow.operators.core_text import PromptedGenerator, PromptedFilter
from dataflow.serving import APILLMServing_request
from dataflow.utils.storage import FileStorage

class MyPipeline:
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./data/input.jsonl",
            cache_path="./cache",
            file_name_prefix="step",
            cache_type="jsonl"
        )
        self.llm_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/chat/completions",
            model_name="gpt-4o",
            max_workers=10
        )
        # Operator instances ...

    def forward(self):
        # Sequential operator.run() calls, each with storage.step()
        ...

if __name__ == "__main__":
    pipeline = MyPipeline()
    pipeline.forward()
```

Key rules:
- `first_entry_file_name` is set to the exact user-provided JSONL path
- Each `operator.run()` call uses `storage=self.storage.step()` for checkpointing
- Fields propagate forward: a field must exist in the sample or be output by a prior step before it can be consumed

## DataFlow Dev

A developer assistant skill for the DataFlow repo. It loads architecture knowledge, probes git state, and routes by intent:

| Say something like… | Workflow |
|---|---|
| "new filter operator that…" | Operator creation (duplicate check → spec → code + registration reminder) |
| "new pipeline that…" | Pipeline creation with the standard `storage.step()` pattern |
| "new prompt for X" | Prompt creation (`PromptABC` / `DIYPromptABC`, `@prompt_restrict` placement) |
| "I'm getting `KeyError: …`" | Diagnose against known issues (#001–#008) |
| "review this operator" | 14-point checklist (registry, `run()` signature, `get_desc`, etc.) |
| "the upstream repo has new operators" | Compare local files to knowledge base, emit update steps |

### Operator Creation

The skill runs a duplicate check first, then confirms the spec with you:
- Operator type (filter / generate / refine / eval)
- Module (general_text / text_sft / reasoning / code / other)
- Whether it depends on LLM
- Input/output column names

Generated code follows a mandatory checklist:
- Inherits `OperatorABC`, calls `super().__init__()`
- `@OPERATOR_REGISTRY.register()` decorator
- `run()` parameters: `input_*` prefix, `output_*` prefix, `storage: DataFlowStorage` first
- `run()` returns list of output key names
- LLM-driven operators use `self.llm_serving`
- Includes `get_desc(lang)` supporting zh/en

### Pipeline Creation

Generated pipelines follow these rules:
- `storage` declared in `__init__`, not in `forward()`
- Each operator call passes `storage=self.storage.step()`
- `max_workers` set according to API capacity
- API keys via environment variables, never hardcoded
- Includes `if __name__ == "__main__":` entry point

### Error Diagnosis

Quick match table for common errors:

| Error keyword | Root cause |
|---|---|
| `Unexpected key 'xxx' in operator` | Config param naming (warning only) |
| `No object named 'Xxx' found in 'operators' registry` | Missing `__init__.py` registration |
| `Key Matching Error` | Pipeline key inconsistency |
| `You must call storage.step() before` | Missing `storage.step()` |
| `DummyStorage` + `AttributeError` | DummyStorage doesn't support `get_keys_from_dataframe` |
| `ModuleNotFoundError` + `dataflow.operators.reasoning.refine` | LazyLoader path — import from parent module |


## Core Text Operator Reference

Extended operator reference consulted by the pipeline skill. When the 6 core primitives don't cover your task, these operators are available:

### Generate

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

### Filter

| Operator | Description |
|----------|-------------|
| `prompted-filter` | LLM-based quality scoring and filtering |
| `general-filter` | Rule-based deterministic filtering |
| `kcentergreedy-filter` | Diversity-based filtering using k-Center Greedy |

### Refine

| Operator | Description |
|----------|-------------|
| `prompted-refiner` | LLM-based text rewriting and refinement |
| `pandas-operator` | Custom pandas DataFrame operations |

### Eval

| Operator | Description |
|----------|-------------|
| `prompted-evaluator` | LLM-based scoring and evaluation |
| `bench-dataset-evaluator` | Benchmark dataset evaluation |
| `bench-dataset-evaluator-question` | Benchmark question-level evaluation |
| `text2qa-sample-evaluator` | QA sample quality evaluation |
| `unified-bench-dataset-evaluator` | Unified benchmark evaluation across formats |

Each operator folder follows the same layout:

```
<operator-name>/
├── SKILL.md          # English documentation
├── SKILL_zh.md       # Chinese documentation
└── examples/
    ├── good.md       # Correct usage examples
    └── bad.md        # Common mistakes
```


## Adding a New Operator

### As an Extended Operator

1. Create an operator directory with skill definition:

```
core_text/<category>/<your-operator>/
├── SKILL.md
├── SKILL_zh.md
└── examples/
    ├── good.md
    └── bad.md
```

2. Register the operator in `generating-dataflow-pipeline/SKILL.md`'s **Extended Operator Reference** section. Without this entry, the pipeline generator won't discover your operator.

### Promoting to a Core Primitive

If the operator is used frequently enough:

1. Add to the core primitives list in Preferred Operator Strategy
2. Add a decision table row in Operator Selection Priority Rule
3. Add full constructor and `run()` signatures in Operator Parameter Signature Rule
4. Add the import path in Correct Import Paths
5. Add input pattern matching in Input File Content Analysis Rule (if new data type)


## Repository

GitHub: [https://github.com/OpenDCAI/DataFlow-Skills](https://github.com/OpenDCAI/DataFlow-Skills)