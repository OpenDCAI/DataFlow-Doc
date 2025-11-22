import type { ThemeNoteListOptions } from 'vuepress-theme-plume'
import { defineNotesConfig } from 'vuepress-theme-plume'
// import { plugins } from './plugins'
// import { themeConfig } from './theme-config'
import { Guide } from './guide'
import { DevGuide } from './dev_guide'
import { APIGuide } from './api'


export const zhNotes: ThemeNoteListOptions = defineNotesConfig({
    dir: 'zh/notes',
    link: '/zh/',
    notes: [
        Guide,
        DevGuide,
        APIGuide,
        // themeConfig,
        // plugins,
        // tools,
    ],
})
