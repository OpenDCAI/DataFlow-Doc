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
            text: 'Start with Dataflow',
            collapsed: false,
            icon: 'carbon:idea',
            prefix: 'quickstart',
            items: [
                'install',
                'first_pipeline',
                'second_pipeline',
                'dataflow_init',
                'df_ecosystem',
                'dataflow_webui'


            ],
        },
        {
            text: "Start Case",
            collapsed: false,
            icon: 'carbon:idea',
            prefix: 'quickstart',
            items: [
                'translation',
                'sft_synthesis',
                'conversation_synthesis',
                'reasoning_general',
                'prompted_vqa',
                'mathquestion_extract',
                'knowledge_cleaning',
                'speech_transcription',
            ],

        },
        {
            text: 'Preview Features',
            collapsed: false,
            icon: 'carbon:idea',
            prefix: 'new_feature',
            items: [
                "resume",
                "batch"
            ],
        },

        // {
        //     text: 'Dataflow Agent',
        //     collapsed: false,
        //     icon: 'ri:robot-2-line',
        //     prefix: 'agent',
        //     items: [
        //         'DataFlow-AgentPipelineOrchestration'
        //     ],
        // },
        {
            text: "Guide for Pipelines",
            collapsed: false,
            icon: 'carbon:flow',
            prefix: 'pipelines',
            items: [
                "TextPipeline",
                "ReasoningPipeline",
                "Text2SqlPipeline",
                "Text2QAPipeline",
                "CodePipeline",
                "AgenticRAGPipeline",
                "KnowledgeBaseCleaningPipeline",
                "FuncCallPipeline",
                "Pdf2ModelPipeline",
                "PDFVQAExtractPipeline",
            ]
        },
        {
            text: "Model Evaluation",
            collapsed: false,
            icon: 'carbon:flow',
            prefix: 'model_evaluation',
            items: [
                "command_eval",
                "easy_evaluation",
            ]
        },
        {
            text: "Domain-Specific Operators",
            collapsed: false,
            icon: 'material-symbols:analytics-outline',
            prefix: 'domain_specific_operators',
            items: [
                "reasoning_operators",
                "text2sql_operators",
                "rare_operators",
                "knowledgebase_QA_operators",
                "agenticrag_operators",
                "funccall_operators"
            ]
        },
        {
            text: "Agent for Dataflow",
            collapsed: false,
            icon: 'mdi:face-agent',
            prefix: 'agent',
            items: [
                "agent_for_data",
                "DataFlow-AgentPipelineOrchestration"
            ]
        },
    ],
})
