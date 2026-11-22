# tags-normalizer

Single source file (`src/index.js`) that Rollup builds into two formats:
* `dist/tags-normalizer.cjs` — CommonJS (`require`)
* `dist/tags-normalizer.mjs` — ES Module (`import`)

Depends on [@eugeniouglov/string-manipulator](https://cdn.jsdelivr.net/npm/@eugeniouglov/string-manipulator) for string splitting and cleaning.

## Installation

```bash
npm i tags-normalizer
# or locally from this folder:
npm install .
```

## Build

```bash
npm run build     # build once
npm run dev       # watch — rebuilds on every change to src/index.js
```

## Usage

### 1. CommonJS / `require` (Node, older bundlers)

```js
const TagsNormalizer = require('tags-normalizer');
const tn = new TagsNormalizer();
console.log(tn.getHandledTags(['javascript,js', 'TypeScript']));
// ["javascript","js","TypeScript","Type","Script"]
```

### 2. ES Module / `import` (modern browsers, Vite, Webpack, Node ESM)

```js
import TagsNormalizer from 'tags-normalizer';
const tn = new TagsNormalizer();
console.log(tn.getHandledTags(['javascript,js', 'TypeScript']));
// ["javascript","js","TypeScript","Type","Script"]
```

### 3. In the browser via `<script>`

```html
<script type="module">
  import TagsNormalizer from './dist/tags-normalizer.mjs';
  const tn = new TagsNormalizer();
  console.log(tn.getHandledTags(['javascript,js', 'TypeScript']));
</script>
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build both CJS and ESM bundles once |
| `npm run dev` | Watch mode — rebuilds automatically when `src/index.js` changes |
| `npm run watch` | Same as `dev` |

## HTML Test

Open `test/index.html` in your browser to run the test suite directly against `dist/tags-normalizer.mjs`:

```bash
# Option 1: open directly
start test/index.html    # Windows
open test/index.html     # macOS

# Option 2: serve with a local server (recommended for ES modules)
npx serve .
# then visit http://localhost:3000/test/index.html
```

## Support ☕🤗

If you find this package useful, you can
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/eugeniouglb)