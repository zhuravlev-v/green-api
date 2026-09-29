import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['dist/**', '.kilo/**', '**/src/shared/api/generated'],
  },
  // базовые рекомендации ESLint
  js.configs.recommended,
  // рекомендации для TypeScript
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // запрещаем console.log, но разрешаем warn и error
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // неиспользуемые переменные с префиксом _ игнорируем
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['src/shared/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // отключаем правила, конфликтующие с Prettier (всегда последним)
  prettier,
];
