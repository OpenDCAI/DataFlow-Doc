---
title: DataFlow-WebUI
createTime: 2026/02/01 13:05:10
permalink: /zh/guide/webui/
icon: solar:global-outline
---
# DataFlow 网页界面 WebUI

## 概述
为了方便不熟悉代码的用户直观体验DataFlow算子和流水线的设计，我们精心开发了前后端完备的DataFlow—WebUI，技术栈使用**Vue+FastAPI**作为前后端，后端包装了DataFlow Python库的算子和Pipeline并通过[Ray](https://docs.ray.io/en/latest/ray-overview/getting-started.html)运行具体任务。并且，DataFlow-WebUI可以作为开源项目，供您开发Workflow搭建类的框架借鉴与参考。

![](/webui_sample.png)

## 特点
1. 服务于DataFlow，内置DataFlow流水线的功能，且内置样例数据集，安装后可直接体验。
2. 可以通过拖拉拽等方式在画布上直观编排DataFlow算子，组织成流水线并运行。并随时观察执行状态与下载运行后的数据。
3. 目前只支持API部署的大模型后端，如果本地模型可以先通过[vLLM](https://github.com/vllm-project/vllm)或者[SGLang](https://github.com/sgl-project/sglang)部署服务后，配置调用API访问。
4. 作为科研开源项目，为保证简洁性与便于维护，没有设置用户管理、多并发队列等面向业务的功能，主要服务于本地部署和体验。


## 使用方式
首先你需要按照[安装教程](/zh/guide/install/)安装DataFlow主仓库，安装好后，直接执行如下命令即可启动DataFlow网页界面：
```shell
dataflow webui
```
也可以手动修改端口和url等配置，也可以手动使用本地zip或者解压后的路径来避免网络下载WebUI组件，具体指令可通过`-h`来查看
```shell
dataflow webui -h
```

随后，就会自动从github release中下载最新发行版的DataFlow-Webui并在本地解压部署启动。当部署完成后，应该会自动打开浏览器。如果没有打开的话，可以手动访问`http://localhost:<port>/`来体验网页。

关于如何使用，我们提供了教程文档，具体请参考：
- 中文教程：[https://wcny4qa9krto.feishu.cn/wiki/F4PDw76uDiOG42k76gGc6FaBnod](https://wcny4qa9krto.feishu.cn/wiki/F4PDw76uDiOG42k76gGc6FaBnod)
- English Document：[https://wcny4qa9krto.feishu.cn/wiki/SYELwZhh9ixcNwkNRnhcLGmWnEg](https://wcny4qa9krto.feishu.cn/wiki/SYELwZhh9ixcNwkNRnhcLGmWnEg)


> 特别的，如果你对具体的前后端实现，于自动化release的Github Action配置感兴趣的话，想要看源码，请参考：[https://github.com/OpenDCAI/DataFlow-webui](https://github.com/OpenDCAI/DataFlow-webui)

## 结合DataFlow-Ecosystem扩展WebUI算子库
上一节中实现的DataFlow-Extension算子库，可以通过注册的方式将其引入到WebUI中使用。

首先在下载并解压后的DataFlow-WebUI路径下找到`backend/app/core/config.py`文件，在其中的`_DATAFLOW_EXTENSIONS`添加DataFlow-Extension的**Python包名字符串**，并确保你已经在当前的python环境中安装了该包。比如我自定义的包名为`df_sunnyhaze`，则应该改为：
```python
    # Please input your custom DataFlow extensions here, the system will try to dynamically load them at runtime
    _DATAFLOW_EXTENSIONS = [
        "df_sunnyhaze"
    ]
```
可以导入多种依赖包，添加后重启WebUI服务，就可以在WebUI的算子库中看到DataFlow-Extension中的算子了。

## 使用 AI 智能体搭建流水线

除了在画布上拖拉拽编排，DataFlow-WebUI 现在还内置了 **AI 智能体（Agent）**，让你可以用自然语言搭建流水线。你只需用中文（或英文）描述目标，智能体就会通过 MCP 查询 DataFlow 算子库、规划算子链，并把可运行的流水线直接渲染到画布上。

智能体层支持多种 code-agent 后端 —— **Claude Code**、**Codex** 和 **Cursor** —— 并提供两种不同的使用模式。

> **注意：** 智能体功能依赖于位于**源码仓库**中的配置脚本与 MCP/skill 配置（`.mcp.json`、`.claude/skills/`、`.cursor/`、`scripts/`）。这些文件**不包含**在 `dataflow webui` 下载的发行版 zip 包中。因此使用智能体功能时，请克隆源码仓库并执行下文的一键配置，而不是走上面的发行版流程。

### 两种使用模式

**模式 A —— WebUI 调度（在浏览器中对话）。**
当你在浏览器的对话面板里聊天时，WebUI 后端会以无头（headless）方式拉起 code-agent CLI。对话标题旁有一个 **agent 下拉框**，可以按会话选择后端。此模式下的智能体：**Claude Code** 与 **Codex**。

**模式 B —— IDE / 终端（用户主导）。**
智能体运行在你自己的 IDE 或终端中，连接到 WebUI 的 MCP server（`http://localhost:8000/mcp`），并把它搭建好的流水线同步回 WebUI 画布。此模式下的智能体：**Cursor IDE** 与 **Claude Code（终端）**。

> **为什么下拉框里没有 Cursor。** Cursor **不**由 WebUI 后端调度。它的使用方式是在 Cursor IDE 中打开本项目，由你已有的 Cursor 会话自动发现 `dataflow` MCP server（`.cursor/mcp.json`），并把流水线渲染回 WebUI 画布。从 Cursor 工作时，无需在 WebUI 中选择 agent。

| 智能体 | 模式 | 使用方式 | MCP 配置位置 | 认证 |
|---|---|---|---|---|
| **Claude Code** | WebUI 调度 | 在对话下拉框中选择 "Claude Code" | `--mcp-config .mcp.json`（由后端传入） | `ANTHROPIC_API_KEY`（使用中转/网关时用 `ANTHROPIC_BASE_URL`） |
| **Codex** | WebUI 调度 | 在对话下拉框中选择 "Codex" | `~/.codex/config.toml` 的 `[mcp_servers.dataflow]` | `OPENAI_API_KEY`（可选 `OPENAI_BASE_URL`），**或** `codex login` OAuth（ChatGPT Plus/Pro，无需 API key） |
| **Cursor IDE** | IDE / 终端 | 在 Cursor 中打开本项目，Agent 面板自动发现 MCP | `.cursor/mcp.json`（项目级） | Cursor 内置认证 |
| **Claude Code（终端）** | IDE / 终端 | 在本仓库目录下运行 `claude`，自动读取 `.mcp.json` | 仓库根目录的 `.mcp.json` | `ANTHROPIC_API_KEY` |

### 前置条件

* **Python 3.10+**，含 pip
* **Node.js 20+**，含 npm
* **Git**
* 至少一个 code-agent CLI：
  - **Claude Code：** `curl -fsSL https://claude.ai/code/install.sh | sh`
  - **Codex：** `npm i -g @openai/codex`
  - **Cursor：** [下载 Cursor IDE](https://cursor.com)

### 一键配置

克隆源码仓库并运行安装脚本：

```shell
git clone https://github.com/OpenDCAI/DataFlow-WebUI.git
cd DataFlow-WebUI
./scripts/setup_all.sh
./scripts/start.sh
```

`setup_all.sh` 是幂等的（可安全重复运行）。它会检查前置条件、安装 DataFlow 与后端依赖、构建前端、初始化 DataFlow 数据目录，并为所有智能体配置 MCP（内部委托给 `./scripts/setup_agent.sh all`）。如果只想（重新）配置某一个智能体：

```shell
./scripts/setup_agent.sh claude   # 或：cursor / codex / all
```

它会写入各智能体对应的配置文件：

| 智能体 | 写入的文件 |
|---|---|
| Claude Code | `.mcp.json`（仓库根目录） |
| Cursor IDE | `.cursor/mcp.json` + `.cursor/rules/*.mdc` |
| Codex | `~/.codex/config.toml`（追加 `[mcp_servers.dataflow]`）+ `AGENTS.md` |

### 认证配置

在启动后端的同一个终端里，导出你所使用智能体的凭据：

```shell
# Claude Code
export ANTHROPIC_API_KEY=sk-ant-...
export ANTHROPIC_BASE_URL=https://your-gateway/v1   # 仅在使用中转/网关时需要

# Codex —— 方式一：API key
export OPENAI_API_KEY=sk-...
export OPENAI_BASE_URL=https://your-gateway/v1      # 仅在使用中转/网关时需要

# Codex —— 方式二：ChatGPT Plus/Pro OAuth（无需 API key）
codex login
```

Cursor IDE 使用其自带的内置认证，无需任何环境变量。

### 开始使用智能体

**在浏览器中（Claude Code / Codex）。** 用 `./scripts/start.sh` 启动后端，打开 `http://localhost:8000/`。在对话面板标题处的 agent 下拉框中选择 **Claude Code** 或 **Codex**，然后描述你想搭建的内容。切换下拉框会开启一段全新对话（不同智能体之间不共享 session id）；你上次的选择会在刷新后被记住。智能体会通过 MCP 查询算子、规划算子链，并把生成的流水线同步到画布上。除非你明确要求，否则它不会自动执行流水线。

**在 Cursor IDE 中。** 在 Cursor 中打开本项目。`.cursor/mcp.json` 已定义好 `dataflow` MCP server，但 Cursor 需要你手动启用一次：

1. 打开 **Cursor Settings**（Cmd/Ctrl + Shift + J → Settings）
2. 进入 **Features → MCP Servers**（或搜索 "MCP"）
3. 找到 `dataflow` 并切换为 **ON**
4. 如果显示 "failed"，确认后端正在运行：`./scripts/start.sh --status`
5. 点击 "Refresh" 或重启 Cursor 以重新连接

随后在 Cursor 的 Agent 面板中正常对话即可 —— 流水线会通过 MCP 同步回 WebUI 画布，无需在 WebUI 中选择 agent。

**在 Claude Code 终端中。** 在克隆好的仓库目录下运行 `claude`，它会自动读取 `.mcp.json` 并连接到正在运行的后端。

### 验证智能体连接

| 智能体 | 验证命令 |
|---|---|
| Claude Code | `claude --print --mcp-config .mcp.json --output-format text "call mcp__dataflow__list_operator_categories and report the result"` |
| Codex | `codex exec --json --sandbox workspace-write "call the dataflow MCP tool list_operator_categories and report the result"` |
| Cursor IDE | 在 Agent 面板中："call the dataflow MCP tool list_operator_categories and report the result" |

配置正确时，会返回一组算子类别，例如 `core_text`、`general_text`、`reasoning` 等。如果失败，可能是后端未启动（`./scripts/start.sh`）、MCP 未激活（参考上面的 Cursor 步骤），或缺少认证。

### 常见问题排查

| 现象 | 可能原因 | 解决方法 |
|---|---|---|
| 后端日志出现 `<cli>: command not found` | CLI 可执行文件不在后端能看到的 PATH 上 | 重新安装，或在启动后端前设置 `DATAFLOW_CLAUDE_CLI` / `DATAFLOW_CODEX_CLI=/abs/path/to/cli` |
| 对话回复为空，或立即返回 `done` | 智能体认证失败 | 确认相应的 API key 已在启动后端的终端中导出；Codex 若无 API key，先运行 `codex login` |
| 工具调用报 "MCP server not reachable" | 智能体的 MCP 配置没有指向本后端 | 重新运行 `./scripts/setup_agent.sh <kind>`，并确认后端在 `localhost:8000` 上 |
| 智能体编造不存在的算子 | 构建用的 skill 没有加载 | Cursor 重新运行 `./scripts/setup_agent.sh cursor` 重新生成 `.cursor/rules/`；Codex 重新生成 `AGENTS.md` |
| Cursor IDE 中看不到 `dataflow` MCP 工具 | `.cursor/mcp.json` 缺失，或后端未启动 | 运行 `./scripts/setup_agent.sh cursor`，并确保后端在 `localhost:8000` 上运行 |

> 完整的智能体配置参考（含授权范围与行为规范），请见 DataFlow-WebUI 仓库中的 [`AGENT_SETUP.md`](https://github.com/OpenDCAI/DataFlow-WebUI/blob/main/AGENT_SETUP.md)。
