import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import polyfillNode from 'rollup-plugin-polyfill-node';

// Inline stub for Node's 'url' module (used only in string-manipulator's demo block)
const urlStubPlugin = {
  name: 'url-stub',
  resolveId(id) {
    if (id === 'url') return id;
  },
  load(id) {
    if (id === 'url') {
      return `export function pathToFileURL(path) { return { href: String(path) }; }`;
    }
  },
};

const isProduction = process.env.BUILD === 'production' || !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: [
    {
      // CommonJS bundle for require() / Node / older bundlers (.cjs -> always CJS)
      file: 'dist/tags-normalizer.cjs',
      format: 'cjs',
      exports: 'default',
      sourcemap: true,
    },
    {
      // ES Module bundle for import / modern browsers / Vite / Webpack (.mjs -> always ESM)
      file: 'dist/tags-normalizer.mjs',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    urlStubPlugin,
    polyfillNode(),
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    isProduction && terser(),
  ].filter(Boolean),
};
