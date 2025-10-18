import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.js',
      '.reference/**/*',
      'convert-images.js',
      'demo/**/*',
      '*script.js*',
    ],
  },
  {
    rules: {
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
]
