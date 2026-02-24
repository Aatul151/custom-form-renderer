import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/fields.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@mui/x-date-pickers',
      'react-hook-form',
      '@tanstack/react-query',
      'dayjs',
      '@ckeditor/ckeditor5-react',
    ],
    treeshake: true,
  },
  {
    entry: ['src/vite-plugin.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    outDir: 'dist',
    external: ['vite'],
    treeshake: true,
  },
]);
