import react from '@woohm402/eslint-config-react';

export default [
  {
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
