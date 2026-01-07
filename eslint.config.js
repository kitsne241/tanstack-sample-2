import { defineConfig } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginSecurity from 'eslint-plugin-security'
import js from '@eslint/js'

// エディタ上の Lint と npx eslint . による Lint の両方に対応

function withFiles(files, ...configs) {
  return configs.flat().map((config) => ({ ...config, files }))
}

export default defineConfig([
  { ignores: ['dist'] },

  js.configs.recommended,

  ...withFiles(
    ['src/**/*.{ts,vue}'],
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked
  ), // TypeScript 用設定を適用。本来は map でかく

  ...pluginVue.configs['flat/recommended'],
  // Vue ファイルのパーサー設定を上書きし、全体が TypeScript として解釈されることを防ぐ

  pluginSecurity.configs.recommended,

  {
    files: ['src/**/*.{ts,vue}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
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
  {
    files: ['src/**/*.{ts,vue}'],
    rules: {
      'security/detect-object-injection': 'off', // フロントエンドの設定としては過剰
      '@typescript-eslint/consistent-type-definitions': 'off', // interface 推奨を無効化
      'no-undef': 'off', // TypeScript で型チェックされるので不要
    },
  },

  eslintConfigPrettier,
  // Prettier のルールと衝突する ESLint の設定を無効化するだけ。常に最後に置く
])
