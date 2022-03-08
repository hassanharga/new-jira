module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base', 'eslint:recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    semi: ['warn', 'always'],
    quotes: ['warn', 'single'],
    'import/extensions': [
      'warn',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'import/prefer-default-export': 0,
    'no-underscore-dangle': 0,
    'no-await-in-loop': 0,
    'no-restricted-syntax': 0,
    'no-return-await': 0,
    'func-names': 0,
    quotes: 0,
    'no-console': ['warn'],
    'no-unused-vars': ['warn', { args: 'none' }],
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
    'no-plusplus': ["warn", { "allowForLoopAfterthoughts": true }]
  },
  ignorePatterns: ['dist/*'],
};
