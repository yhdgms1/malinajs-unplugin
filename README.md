# malinajs-unplugin

[![install size](https://packagephobia.com/badge?p=malinajs-unplugin@latest)](https://packagephobia.com/result?p=malinajs-unplugin@latest)
[![npm version](https://badgen.net/npm/v/malinajs-unplugin)](https://www.npmjs.com/package/malinajs-unplugin)

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

As [stated](https://malinajs.github.io/docs/#context) in the malinajs documentation, you can import 'malinajs' as 'malinajs/runtime'.
Using unplugin, you cannot do this. [Read more in the issue](https://github.com/Artemis69/malinajs-unplugin/issues/1#issuecomment-938657122)
