import type { ThemeNote } from 'vuepress-theme-plume'
import { defineNoteConfig } from 'vuepress-theme-plume'

export const Guide: ThemeNote = defineNoteConfig({
    dir: 'guide',
    link: '/guide/',
    sidebar: [
        {
            text: 'Basic Info',
            collapsed: false,
            icon: 'carbon:idea',
            prefix: 'basicinfo',
            items: [
                'intro',
                'framework',
            ],
        },
        {
            text: 'Quick Start',
            collapsed: false,
            icon: 'carbon:idea',
            prefix: 'quickstart',
            items: [
                'install',
                `TextPipeline`,
                'ReasoningPipeline',
                'Text2SqlPipeline'
                // 'usage',
                // 'project-structure',
                // 'write',
                // 'blog',
                // 'document',
                // 'international',
                // 'deployment',
                // 'optimize-build',
            ],
        },
        {
            text: "DataFlow-Agent",
            collapsed: false,
            icon: '',
            prefix: 'agent',
            items: [
                "agent_for_data"
            ]
        },
        {
            text: 'Operators',
            collapsed: false,
            icon: '',
            prefix: 'operators',
            items: [
                "text_process",
                "image_process",
                "video_process",
            ]
        },
        {
            text: 'Evaluation Metrics',
            collapsed: false,
            icon: 'material-symbols:analytics-outline',
            prefix: 'metrics',
            items: [
                "text_metrics",
                // "text_process",
                "gen_text_metrics",
                "image_metrics",
                // "image_process",
                "video_metrics",
                // "video_process",
            ]
        },
    ],
})
