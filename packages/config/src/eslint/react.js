import commonFileMatchers from './common/file-matchers.js'
import commonRules from './common/rules.js'

import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import { fixupConfigRules } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      ...commonFileMatchers.ignores,
      '.next/**/*',
      '.source/**/*',
      '.turbo/**/*',
      'out/**/*',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended'
    )
  ),
  {
    files: commonFileMatchers.files,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
    },
    rules: {
      ...commonRules,
      'react-hooks/exhaustive-deps': 'off',
    },
  },
]
