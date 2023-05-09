import type { Options, MalinaPlugin } from "./types";

import { createUnplugin } from "unplugin";
import { createRequire } from "module";
import picomatch from "picomatch";
import path from "path";

const CWD = process.cwd();
const __require = (() => {
  try {
    return 'resolve' in require && require;
  } catch {
    return false;
  }
})()

export const unplugin = createUnplugin<Options>((options) => {
  if (!options) options = {};

  if (!options.extensions) options.extensions = ["ma", "xht"];

  const require = __require || createRequire(import.meta.url);

  const malinajsPath = require.resolve("malinajs", {
    paths: [path.join(CWD, "node_modules", "malinajs")],
  });

  const malina = require(malinajsPath) as Awaited<typeof import("malinajs")>;

  if (options.displayVersion) console.log("! Malina.js", malina.version);

  const cssMap = new Map<string, string>();

  return {
    name: "malinajs",
    enforce: "pre",
    transformInclude(id) {
      const extensionMatches = options!.extensions!.some((extension) =>
        id.endsWith("." + extension)
      );

      if (!options?.include && !options?.exclude) {
        return extensionMatches;
      }

      const globMatches = picomatch.isMatch(id, options.include || [], {
        cwd: CWD,
        ignore: options.exclude || [],
        contains: true,
      });

      return globMatches || extensionMatches;
    },
    async transform(code, id) {
      const compileOptions = {
        ...options,
        path: id,
        name: id.match(/([^/\\]+)\.\w+$/)![1],
      };

      try {
        const ctx = await malina.compile(code, compileOptions);

        let result = ctx.result;

        if (ctx?.css?.result) {
          const name =
            id.replace(/[^\w.\\-]/g, "").replace(/(\.\w+)+/, "") +
            ".malina.css";

          cssMap.set(name, ctx.css.result);

          result += `\nimport "${name}";\n`;
        }

        return result;
      } catch (error: unknown) {
        if (options?.warning) {
          if (typeof error === "string") {
            options.warning(error);
          } else if (error instanceof Error) {
            options.warning(error.message);
          }
        }

        throw error;
      }
    },
    resolveId(name) {
      if (cssMap.has(name)) return name;

      return null;
    },
    load(id) {
      return cssMap.has(id) ? cssMap.get(id) : null;
    },
  };
});

export const vitePlugin = unplugin.vite;
export const rollupPlugin = unplugin.rollup;
export const webpackPlugin = unplugin.webpack;
export const esbuildPlugin = unplugin.esbuild;
export default unplugin;

export { Options, MalinaPlugin };
