import { defineConfig } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import js from '@eslint/js'

export default defineConfig([
  { ignores: ['dist'] },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['src/**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'no-undef': 'off', // 型チェックは TSC に任せる
    },
  },

  {
    files: ['src/**/*.vue'],
    rules: {
      'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
      // 基本的には PascalCase を推奨。ただし Vuetify を採用するなら kebab-case に切り替えるとよい

      'vue/no-template-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'vue/no-v-html': 'error',
      'vue/multi-word-component-names': 'off',
    },
  },

  eslintConfigPrettier, // 常に最後に置く
])
