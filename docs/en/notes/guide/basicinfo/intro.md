---
title: Introduction
icon: mdi:tooltip-text-outline
createTime: 2025/06/13 14:36:47
permalink: /en/guide/intro/
---
# Introduction

In recent years, the development of large models has been primarily driven by major tech companies. A key factor behind their success lies in access to massive, high-quality datasets. However, these companies typically do not release their raw data or data processing tools, making it difficult for the academic community to keep pace in building and optimizing training data for large models.

Although initiatives such as Open-DataLab have open-sourced a wide range of datasets in recent years, significant challenges remain for academia in preparing data for large models. Currently, the cleaning and construction of large model training data often rely on individual research teams working in isolation, without access to systematic or efficient toolchains. Existing data processing tools, such as Spark and Data-Juicer, mainly support traditional operations and lack effective integration of the latest intelligent operators powered by large language models (LLMs), limiting their support for building advanced training data.

To address these challenges, we propose **DataFlow** — a high-efficiency data preparation system composed of advanced operators and multi-stage data processing pipelines. DataFlow integrates rule-based methods, deep learning models, and LLMs to offer a modular, scalable, and reconfigurable design. It aims to improve the quality and efficiency of data cleaning, augmentation, and construction, thereby supporting the development of next-generation large models.

## DataFlow: A High-Quality Data Preparation System

**DataFlow** is a data evaluation and processing system designed to **clean, enhance, and assess** noisy data sources (e.g., PDFs, plain text, low-quality QA pairs) to produce high-quality training data. This curated data can then be used to improve large language model performance through targeted training approaches, including pre-training, supervised fine-tuning, and reinforcement learning, across both general domains (e.g., reasoning and retrieval) and specialized fields (e.g., healthcare, finance, and law).

Specifically, we have developed a diverse set of **operators**, built on rule-based methods, deep learning models, large language models (LLMs), and LLM APIs. These operators are systematically integrated into six independent data processing pipelines, collectively forming the complete **DataFlow system**.

In addition, we have developed an intelligent **DataFlow-Agent** capable of dynamically composing existing operators into new data processing workflows based on user requirements. This enables more flexible and efficient data construction and processing capabilities.
