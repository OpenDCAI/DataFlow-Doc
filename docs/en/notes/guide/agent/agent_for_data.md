---
title: Agent-Data Governance
icon: material-symbols:robot-2-outline
createTime: 2025/06/17 15:56:00
permalink: /en/guide/agent/agent_for_data/
---

# DataFlow-Agent Project Introduction

## 1. Project Overview

**DataFlow-Agent** is an intelligent Agent framework built around "data flow / workflow", with the following goals:

- Decompose complex natural language tasks into a series of composable **Node / Tool / Workflow** components;
- Through a unified `BaseAgent` abstraction and multiple execution modes (Simple / ReAct / Graph / VLM), enable Agents to execute tasks stably in different scenarios;
- Support upper-layer Gradio frontend, pipeline orchestration, graph-based workflows, and other usage methods.

The overall architecture is organized around the following core layers:

- **Agent Layer (`dataflow_agent.agentroles`)**: Specific intelligent roles, such as `Classifier`, `PipelineBuilder`, `Writer`, **`Recommender`**, etc. Each role is a subclass of `BaseAgent`.
- **Execution Core Layer (`dataflow_agent.agentroles.cores`)**: Unified Agent configuration and execution strategies (`configs.py` + `strategies.py`), providing Simple / ReAct / Graph / VLM execution modes for Agents.
- **LLM & Parser Layer (`dataflow_agent.llm_callers`, `dataflow_agent.parsers`)**: Abstracts differences in specific models and return formats, supports text and multimodal (vision-language) calls, and parses LLM outputs through unified parsers.
- **Tool & Workflow Layer (`dataflow_agent.toolkits`, `dataflow_agent.workflow`)**: Defines various tools and pipeline workflows, decomposing complex tasks into reusable components.
- **State & Prompt Layer (`dataflow_agent.state`, `dataflow_agent.promptstemplates`)**: Unified request/intermediate state representation, generates system prompts and task prompts through templated prompts, and manages conversation history.

## 2. Architecture Design Principles

### 1. Modular Design
- **Separation of Concerns**: Each component focuses on a single responsibility, such as Agent for task execution and State for state management
- **Plugin Architecture**: Supports plugin-style registration and dynamic loading of Agents, Workflows, and Tools
- **Interface Abstraction**: Defines standard interfaces through abstract base classes to ensure loose coupling between components

### 2. State-Driven
- **Unified State Management**: All processes are based on state objects for data transfer and state maintenance
- **Type Safety**: Uses dataclass and type annotations to ensure type safety of state data
- **Task-Specific States**: Provides specialized state class extensions for different task types

### 3. Strategy Pattern
- **Execution Strategy Abstraction**: Supports multiple execution modes (Simple, ReAct, Graph, VLM)
- **Strategy Factory**: Dynamically creates and switches execution strategies
- **Configuration-Driven**: Controls strategy behavior through configuration objects

### 4. Extensibility
- **Decorator Registration**: Simplifies component registration process using decorators
- **Auto-Discovery**: Implements automatic component registration through `__init_subclass__`
- **Template System**: Provides code generation templates to simplify new component development

## 3. Agent System (`agentroles/`)

#### BaseAgent Core Architecture
```python
class BaseAgent(ABC):
    # Automatic registration mechanism
    def __init_subclass__(cls, **kwargs):
        # Automatically register to AgentRegistry
        pass
    
    # Strategy pattern support
    def __init__(self, execution_config: Optional[Any] = None):
        if execution_config:
            self._execution_strategy = StrategyFactory.create(
                execution_config.mode.value, self, execution_config
            )
```

#### Execution Mode Support
1. **Simple Mode**: Single LLM call, simple and direct
2. **ReAct Mode**: Loop execution with validation, ensures output quality
3. **Graph Mode**: Subgraph + tool calls, supports complex interactions
4. **VLM Mode**: Specialized processing for vision-language models

#### Agent-as-Tool Functionality
- **Tool Wrapping**: Wraps Agent as callable tool
- **Parameter Mapping**: Automatically handles mapping from tool parameters to Agent parameters
- **Result Extraction**: Extracts tool execution results from state
