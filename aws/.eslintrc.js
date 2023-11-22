module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts'] },
    'import/resolver': {
      typescript: { alwaysTryTypes: true, directory: './tsconfig.json' },
    },
  },
  ignorePatterns: [
    'dist/*',
    '.next/*',
    'node_modules/*',
    '.eslintrc.js',
    '*.json',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
