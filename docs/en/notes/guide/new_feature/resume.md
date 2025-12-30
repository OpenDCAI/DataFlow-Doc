---
title: Preview-Checkpoint Resume
createTime: 2025/12/30 11:19:40
permalink: /en/guide/resume/
---


# Beta: Checkpoint Resume

> This feature is currently in beta and may contain bugs. If you encounter any issues, please report them via issues. Thank you for your understanding.

## Overview

During inference, if the process is interrupted at a certain operator, the default workflow requires rerunning the entire pipeline from the previous operator. This typically involves commenting out all preceding operators in the pipeline and manually renaming intermediate cached step files as the new entry point, which is cumbersome and error-prone.

To address this, we provide a feature that allows inference to be resumed directly from a specific operator step.

## Usage

Please refer to the section
[Framework Design – Resume Pipelines](/en/guide/basicinfo/framework/#breakpoint-resume-pipelines-resume) for details.
