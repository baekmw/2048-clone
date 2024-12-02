import react from '@woohm402/eslint-config-react';

export default [
  {
    overrides: [
      {
        files: ['src/*.test.ts'],
        env: {
          jest: true,
        },
      },
    ],
    ignores: [
      'eslint.config.js',
      '.yarn',
      'tailwind.config.js',
      'postcss.config.cjs',
    ],
  },
  ...react({
    tsconfigRootDir: import.meta.dirname,
  }),
];
