# malinajs-unplugin

[![install size](https://packagephobia.com/badge?p=malinajs-unplugin@latest)](https://packagephobia.com/result?p=malinajs-unplugin@latest)

## Usage

### Vite

```ts
//vite.config.ts

import { defineConfig } from "vite";
import { vitePlugin as malinaPlugin } from "malinajs-unplugin";

export default defineConfig(({ mode }) => ({
  plugins: [
    malinaPlugin({
      debugLabel: mode === "development",
    }),
  ],
}));
```

### Webpack

```js
//webpack.config.js
const { webpackPlugin: malinaPlugin } = require("malinajs-unplugin");

module.exports = {
  plugins: [malinaPlugin()],
};
```

## Caution

Be careful when using with Vite: the `html` extension will not work
