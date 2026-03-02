import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    ...pluginVue.configs['flat/recommended'],
    ...vueTsEslintConfig(),
    skipFormatting,
]
