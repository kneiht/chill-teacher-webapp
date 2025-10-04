import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.js',
      '.reference/**/*',
    ],
  },
  {
    rules: {
      'import/order': 'off',
      'sort-imports': 'off',
    },
  },
]
