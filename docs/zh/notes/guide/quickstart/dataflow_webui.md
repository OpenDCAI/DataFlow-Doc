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
也可以手动修改端口和url等配置，具体指令可通过`-h`来查看
```shell
dataflow webui -h
```

随后，就会自动从github release中下载最新发行版的DataFlow-Webui并在本地解压部署启动。当部署完成后，应该会自动打开浏览器。如果没有打开的话，可以手动访问`http://localhost:<port>/`来体验网页。

关于如何使用，我们提供了教程文档，具体请参考：
- 中文教程：[https://wcny4qa9krto.feishu.cn/wiki/F4PDw76uDiOG42k76gGc6FaBnod](https://wcny4qa9krto.feishu.cn/wiki/F4PDw76uDiOG42k76gGc6FaBnod)
- English Document：[https://wcny4qa9krto.feishu.cn/wiki/SYELwZhh9ixcNwkNRnhcLGmWnEg](https://wcny4qa9krto.feishu.cn/wiki/SYELwZhh9ixcNwkNRnhcLGmWnEg)


> 特别的，如果你对具体的前后端实现，于自动化release的Github Action配置感兴趣的话，想要看源码，请参考：[https://github.com/OpenDCAI/DataFlow-webui](https://github.com/OpenDCAI/DataFlow-webui)