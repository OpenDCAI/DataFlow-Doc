---
title: Generating DataFlow Pipeline
icon: carbon:flow
createTime: 2026/04/08 22:45:39
permalink: /en/guide/skills/generating_dataflow_pipeline/
---

# Generating DataFlow Pipeline

<video src="https://github.com/user-attachments/assets/ca1fefbf-9bf7-469f-b856-b201952fb99b" controls style="width:100%; max-width:800px;"></video>

## What It Does

A reasoning-guided pipeline planner for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Given a **target** (what the pipeline should achieve) and a **sample JSONL file** (1–5 representative rows), it analyzes the data, selects operators, validates field dependencies, and generates a complete, runnable DataFlow pipeline in Python.

## Quick Start

### 1. Add the Skill

Clone the repository and copy the skill directories into your Claude Code skills folder:

```bash
git clone https://github.com/haolpku/DataFlow-Skills.git

# Project-level (this project only)
cp -r DataFlow-Skills/generating-dataflow-pipeline .claude/skills/generating-dataflow-pipeline
cp -r DataFlow-Skills/core_text .claude/skills/core_text

# Or personal-level (all your projects)
cp -r DataFlow-Skills/generating-dataflow-pipeline ~/.claude/skills/generating-dataflow-pipeline
cp -r DataFlow-Skills/core_text ~/.claude/skills/core_text
```

Claude Code discovers skills from `.claude/skills/<skill-name>/SKILL.md`. The `name` field in `SKILL.md` frontmatter becomes the `/slash-command`. For more details, see the [official skills documentation](https://docs.anthropic.com/en/docs/claude-code/skills).

### 2. Prepare Your Data

Create a JSONL file (one JSON object per line) with 1–5 representative rows:

```jsonl
{"product_name": "Laptop", "category": "Electronics"}
{"product_name": "Coffee Maker", "category": "Appliances"}
```

### 3. Run the Skill

In Claude Code, invoke `/generating-dataflow-pipeline` and describe your target:

```
/generating-dataflow-pipeline
Target: Generate product descriptions and filter high-quality ones
Sample file: ./data/products.jsonl
Expected outputs: generated_description, quality_score
```

### 4. Review the Output

The skill returns a two-stage result:

1. **Intermediate Operator Decision** — JSON with operator chain, field flow, and reasoning
2. **Complete 5-Section Response**:
   - Field Mapping — which fields exist vs. need to be generated
   - Ordered Operator List — operators in execution order with justification
   - Reasoning Summary — why this design satisfies the target
   - Complete Pipeline Code — full executable Python following standard structure
   - Adjustable Parameters / Caveats — tunable knobs and debugging tips

## Six Core Operators

| Operator | Purpose | LLM? |
|----------|---------|------|
| `PromptedGenerator` | Single-field LLM generation | Yes |
| `FormatStrPromptedGenerator` | Multi-field template-based generation | Yes |
| `Text2MultiHopQAGenerator` | Multi-hop QA pair construction from text | Yes |
| `PromptedFilter` | LLM-based quality scoring & filtering | Yes |
| `GeneralFilter` | Rule-based deterministic filtering | No |
| **KBC Trio** (3 operators, always together in order) | File/URL → Markdown → chunks → clean text | Partial |

## Generated Pipeline Structure

All generated pipelines follow the same standard structure:

```python
from dataflow.operators.core_text import PromptedGenerator, PromptedFilter
from dataflow.serving import APILLMServing_request
from dataflow.utils.storage import FileStorage

class MyPipeline:
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./data/input.jsonl",  # User-provided path
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

## Extended Operators

Beyond the 6 core primitives, DataFlow provides additional operators for generation, filtering, refinement, and evaluation. See the [Core Text Operator Reference](./core_text.md) for the full list.

## Adding a New Operator

Prerequisite: the new operator's skill definition already exists (with `SKILL.md`, `examples/good.md`, `examples/bad.md`, etc.).

### As an Extended Operator

Two steps are required:

**Step 1.** Create an operator directory with its skill definition under any appropriate location (e.g., `core_text/<category>/`, or a separate skill package):

```
<skill-directory>/<your-operator-name>/
├── SKILL.md          # API reference (constructor, run() signature, execution logic, constraints)
├── SKILL_zh.md       # Chinese translation (optional)
└── examples/
    ├── good.md       # Best-practice example
    └── bad.md        # Common mistakes
```

**Step 2.** Register the operator in `SKILL.md`'s **Extended Operator Reference** section. Add a row to the corresponding category table (Generate / Filter / Refine / Eval) with the operator name, subdirectory path, and description. Without this entry, the pipeline generator will not know the operator exists.

### Promoting to a Core Primitive (Optional)

If the operator is used frequently enough to warrant priority selection, promote it by modifying `SKILL.md`:

1. Add to the **Preferred Operator Strategy** core primitives list
2. Add a decision table row in **Operator Selection Priority Rule** (when to use / when not to use)
3. Add full constructor and `run()` signatures in **Operator Parameter Signature Rule**
4. Add the import path in **Correct Import Paths**
5. Add input pattern matching in **Input File Content Analysis Rule** if it handles a new data type
6. Update or remove the entry from the **Extended Operator Reference** table to avoid duplication
7. Add a complete example in `examples/` (recommended)
