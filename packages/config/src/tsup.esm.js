export default {
  entry: ['./src/index.ts'],
  format: 'esm',
  tsconfig: './tsconfig.json',
  target: 'esnext',
  minify: true,
  sourcemap: true,
  clean: false,
}
