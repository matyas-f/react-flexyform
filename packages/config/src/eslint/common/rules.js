export default {
  '@typescript-eslint/no-require-imports': 'off',
  curly: 'error',
  'object-shorthand': 'error',
  'no-console': 'warn',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  'no-prototype-builtins': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
}
