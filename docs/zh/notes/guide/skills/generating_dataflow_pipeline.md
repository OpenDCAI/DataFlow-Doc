---
title: DataFlow Pipeline生成
icon: carbon:flow
createTime: 2026/04/08 22:45:39
permalink: /zh/guide/skills/generating_dataflow_pipeline/
---

# DataFlow Pipeline生成（Generating DataFlow Pipeline）

<video src="https://github.com/user-attachments/assets/ca1fefbf-9bf7-469f-b856-b201952fb99b" controls style="width:100%; max-width:800px;"></video>

## 功能说明

一款面向 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 的推理引导式 Pipeline 规划工具。给定**目标任务**（Pipeline 需实现的功能）和**样本 JSONL 文件**（1–5 条代表性数据），它会自动分析数据、选取算子、校验字段依赖，并生成一套完整可运行的 DataFlow Python Pipeline。

## 快速上手

### 1. 添加 Skill

克隆仓库，并将 Skill 目录复制到 Claude Code 的 skills 文件夹中：

```bash
git clone https://github.com/haolpku/DataFlow-Skills.git

# 项目级（仅当前项目可用）
cp -r DataFlow-Skills/generating-dataflow-pipeline .claude/skills/generating-dataflow-pipeline
cp -r DataFlow-Skills/core_text .claude/skills/core_text

# 或个人级（所有项目可用）
cp -r DataFlow-Skills/generating-dataflow-pipeline ~/.claude/skills/generating-dataflow-pipeline
cp -r DataFlow-Skills/core_text ~/.claude/skills/core_text
```

Claude Code 从 `.claude/skills/<skill-name>/SKILL.md` 自动发现 Skills。`SKILL.md` frontmatter 中的 `name` 字段即为 `/斜杠命令` 名称。更多详情请参阅[官方 Skills 文档](https://docs.anthropic.com/en/docs/claude-code/skills)。

### 2. 准备数据

创建 JSONL 文件（每行一个 JSON 对象），包含 1–5 条代表性数据：

```jsonl
{"product_name": "笔记本电脑", "category": "电子产品"}
{"product_name": "咖啡机", "category": "家用电器"}
```

### 3. 运行 Skill

在 Claude Code 中调用 `/generating-dataflow-pipeline` 并描述你的目标：

```
/generating-dataflow-pipeline
目标：生成商品描述并筛选优质内容
样本文件：./data/products.jsonl
预期输出字段：generated_description, quality_score
```

### 4. 查看输出

Skill 输出两阶段结果：

1. **中间算子决策** — 包含算子链路、字段流转逻辑与推理依据的 JSON 数据
2. **完整的 5 部分响应**：
   - 字段映射 — 区分已有字段与需生成字段
   - 有序算子列表 — 按执行顺序排列的算子及选用理由
   - 推理总结 — 说明该设计为何能满足目标任务
   - 完整 Pipeline 代码 — 遵循标准结构的可执行 Python 全量代码
   - 可调参数 / 注意事项 — 可配置参数与调试技巧

## 六大核心算子

| 算子名称 | 用途 | 是否依赖 LLM |
|----------|------|-------------|
| `PromptedGenerator` | 单字段大模型生成 | 是 |
| `FormatStrPromptedGenerator` | 多字段模板式生成 | 是 |
| `Text2MultiHopQAGenerator` | 从文本构建多跳问答对 | 是 |
| `PromptedFilter` | 基于大模型的质量评分与筛选 | 是 |
| `GeneralFilter` | 基于规则的确定性过滤 | 否 |
| **KBC 三算子组**（3 个算子，需按固定顺序组合使用） | 文件/链接 → Markdown → 分块 → 清洗文本 | 部分依赖 |

## 生成的 Pipeline 结构

所有生成的 Pipeline 均遵循统一标准结构：

```python
from dataflow.operators.core_text import PromptedGenerator, PromptedFilter
from dataflow.serving import APILLMServing_request
from dataflow.utils.storage import FileStorage

class MyPipeline:
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./data/input.jsonl",  # 用户提供的路径
            cache_path="./cache",
            file_name_prefix="step",
            cache_type="jsonl"
        )
        self.llm_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/chat/completions",
            model_name="gpt-4o",
            max_workers=10
        )
        # 算子实例化...

    def forward(self):
        # 按顺序执行 operator.run()，每步通过 storage.step() 做断点持久化
        ...

if __name__ == "__main__":
    pipeline = MyPipeline()
    pipeline.forward()
```

核心规则：

- `first_entry_file_name` 严格设置为用户提供的 JSONL 文件路径
- 每个 `operator.run()` 调用均使用 `storage=self.storage.step()` 实现断点持久化
- 字段向前传递：字段必须存在于样本数据中，或由前置步骤生成，方可被后续算子使用

## 扩展算子

除六大核心算子外，DataFlow 还提供更多 Generate、Filter、Refine 和 Eval 类扩展算子。详见 [Core Text 扩展算子参考](./core_text.md)。

## 新增算子

前置条件：新算子的 Skill 定义文件已完成（包含 `SKILL.md`、`examples/good.md`、`examples/bad.md` 等）。

### 作为扩展算子添加

需要两步：

**第 1 步.** 在合适目录下创建算子文件夹并编写 Skill 定义（如 `core_text/<分类>/`，或独立 Skill 包）：

```
<Skill 目录>/<自定义算子名称>/
├── SKILL.md          # 接口文档（构造函数、run() 方法签名、执行逻辑、约束条件）
├── SKILL_zh.md       # 中文翻译（可选）
└── examples/
    ├── good.md       # 最佳实践示例
    └── bad.md        # 常见错误示例
```

**第 2 步.** 在 `SKILL.md` 的 **Extended Operator Reference** 部分注册该算子。在对应类别表格（Generate / Filter / Refine / Eval）中添加一行，填写算子名、子目录路径和功能描述。不添加此条目，Pipeline 生成器无法感知该算子的存在。

### 升级为核心算子（可选）

若某算子使用频率极高，需纳入优先选用范围，可通过修改 `SKILL.md` 完成升级：

1. 添加至 **Preferred Operator Strategy** 核心算子列表
2. 在 **Operator Selection Priority Rule** 中新增决策表条目（明确适用 / 不适用场景）
3. 在 **Operator Parameter Signature Rule** 中补充完整构造函数与 `run()` 方法签名
4. 在 **Correct Import Paths** 中添加算子导入路径
5. 若支持新数据类型，在 **Input File Content Analysis Rule** 中补充输入模式匹配规则
6. 更新或移除 **Extended Operator Reference** 表中的对应条目，避免与核心算子重复
7. 在 `examples/` 目录添加完整示例（推荐）
