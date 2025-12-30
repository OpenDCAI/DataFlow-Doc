---
title: 内测：断点恢复resume
createTime: 2025/12/30 11:19:40
permalink: /zh/guide/resume/
---
# 内测：断点Resume
> 此功能处于内测阶段，可能有bug，发现问题请及时通过issue反馈，感谢理解

## 概述
当推理时，于某个算子断掉了，此时按照默认流程，想从前一个算子重新跑整个流程，要把整个pipeline前面的算子注释掉，并且修改中间缓存的step文件的名称作为入口，这很麻烦。所以我们提供了一个可以从算子step进行恢复推理的功能。

## 使用方法
请参考[框架设计-resume流水线](/zh/guide/basicinfo/framework/#断点恢复流水线-resume)章节。
