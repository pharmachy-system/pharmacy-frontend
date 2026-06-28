import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Context files and UI utilities export both components and hooks — this is standard
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // React 19 / react-hooks v7 experimental compiler rules — the pattern of calling
      // async fetchers inside useEffect is correct and intentional in this codebase
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',

      // Downgrade unused-vars to warn — unused icon imports are common in large UI
      // files and are eliminated by tree-shaking at build time; they are not bugs
      'no-unused-vars': ['warn', {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],

      // Missing effect deps: navigate and stable callbacks from context don't need
      // to be in deps arrays — adding them causes infinite re-renders
      'react-hooks/exhaustive-deps': ['warn', {
        additionalHooks: '(useDeepCompareEffect|useUpdateEffect)',
      }],

      // preserve-caught-error is overly strict for this codebase
      'preserve-caught-error': 'off',
    },
  },
])
