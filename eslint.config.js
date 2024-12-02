import js from '@eslint/js';
import react from '@woohm402/eslint-config-react';

export default [
  js.configs.recommended,
  ...react({
    tsconfigRootDir: import.meta.dirname,
  }),
  {
    files: ['src/*.test.ts'],
    languageOptions: {
      globals: {
        jest: 'readonly',
      },
    },
  },
  {
    ignores: [
      'eslint.config.js',
      '.yarn',
      'tailwind.config.js',
      'postcss.config.cjs',
    ],
  },
];
