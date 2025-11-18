import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import testingLibrary from 'eslint-plugin-testing-library';
import vitest from 'eslint-plugin-vitest';
import github from 'eslint-plugin-github';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist',
      'dist-ssr',
      'build',
      'coverage',
      'node_modules',
      'public',
      '.cache',
      '*.html',
    ],
  },
  // GitHub plugin recommended and browser configs
  // These provide security and best practice rules
  github.getFlatConfigs().browser,
  github.getFlatConfigs().recommended,
  github.getFlatConfigs().react,
  // Main configuration
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node globals for build files
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'testing-library': testingLibrary,
      vitest,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // Base ESLint rules
      'no-console': 'off', // Allow console for debugging
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^React$', // Allow unused React (JSX transform)
        },
      ],
      camelcase: 'off', // Some APIs use snake_case
      'prefer-template': 'off', // Allow string concatenation

      // React plugin rules
      'react/jsx-no-target-blank': 'off', // Disable conflicting or overly strict rules for this codebase
      'react/prop-types': 'off', // Not using prop-types in this project

      // React Refresh configuration
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // GitHub plugin rules - relax for existing codebase
      'github/array-foreach': 'off', // Allow forEach for readability
      'github/no-then': 'off', // Allow .then() for existing promise chains
      'github/async-preventdefault': 'warn',
      'github/no-blur': 'warn',
      'github/unescaped-html-literal': 'off', // Allow JSX literals
      'github/filenames-match-regex': 'off', // Don't enforce filename conventions

      // Import plugin rules (via GitHub plugin)
      'import/no-unresolved': 'off', // Disabled due to Vite path aliases
      'import/no-commonjs': 'off', // Allow CommonJS for config files
      'import/no-nodejs-modules': 'off', // Allow Node.js modules in config
      'import/no-namespace': 'off', // Allow namespace imports
      'import/named': 'off', // Disabled due to false positives with PnP
      'import/namespace': 'off', // Disabled due to false positives
      'import/no-deprecated': 'off', // Disabled due to false positives
      
      // Other plugin rules
      'i18n-text/no-en': 'off', // Allow English text in this project
      'eslint-comments/no-use': 'off', // Allow eslint directive comments
    },
    settings: {
      react: { version: '18.3' },
    },
  },
  // Prettier config must be last to disable conflicting formatting rules
  prettierConfig,
];
