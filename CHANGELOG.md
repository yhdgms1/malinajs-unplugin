# Changelog

## 0.0.17

Changed: `enforce` set to 'pre'

## 0.0.16

Changed: 'unplugin' bumped to `0.3.0`

Added: 'esbuild' support

### Oh, and...

While testing the new esbuild support, I found that it was not working because of `Cannot find module 'malinajs'` error.
To fix this, I changed import to require, this is 'just works' and I'm not sure will it work in all cases.

Currently, import inside the plugin looks like this:

```ts
const malina = createRequire(import.meta.url)(
  path.join(process.cwd(), "node_modules", "malinajs")
);
```

## 0.0.15

Fixed: added missed 'localConfig' property

## 0.0.14

Fixed: added missed 'exportDefault' property

## 0.0.13

Fixed: 'autoimport' type now a more complete

Changed: All descriptions in jsdoc now start with a capital letter

Changed: 'unplugin' bumped to `0.2.21`

## 0.0.11

Changed: Additional check was removed

## 0.0.10

Changed: Better Plugin Types

Use it like:

```ts
import type { MalinaPlugin } from "malinajs-unplugin";

export const myMalinaPlugin: MalinaPlugin = {
  name: "my-malina-plugin",
  // ... other plugin properties
};
```

## 0.0.9

Fixed: Glob type is any

## 0.0.8

Changed: Better Glob types

## 0.0.7

Changed: Object with CSS replaced by Map.

### BREAKING

Changed: Direct `malinajs` import won't work anymore, read more in [Issue](https://github.com/Artemis69/malinajs-unplugin/issues/1).

## 0.0.6

Changed: Better CSS handling (Regexes are stolen from [Malina's esbuild plugin](https://github.com/malinajs/malinajs/blob/master/malina-esbuild.js))

## 0.0.5

Changed: `fast-glob` replaced with `picomatch`

Fixed: No styles when `css` is `false`

## 0.0.4

Fixed: Added missing plugin type

## 0.0.3

Added: `include` and `exclude` options

## 0.0.2

Fixed: Compile errors handled properly

## 0.0.1

Release
