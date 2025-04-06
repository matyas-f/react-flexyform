export default {
  entry: ['./src/index.ts'],
  dts: { only: true },
  clean: false,
  format: 'esm',
  tsconfig: './tsconfig.json',
  target: 'esnext',
}
