import type { Options } from "./types";

import { createUnplugin } from "unplugin";
import malina from "malinajs";
import picomatch from "picomatch";

export const unplugin = createUnplugin<Options>((options) => {
  if (!options) options = {};

  if (!options.extensions) options.extensions = ["ma", "xht"];

  if (options.displayVersion) console.log("! Malina.js", malina.version);

  const cssMap = new Map<string, string>();

  return {
    name: "malinajs",
    transformInclude(id) {
      const extensionMatches = options!.extensions!.some((extension) =>
        id.endsWith("." + extension)
      );

      if (!options?.include && !options?.exclude) {
        return extensionMatches;
      }

      const globMatches = picomatch.isMatch(id, options.include || [], {
        cwd: process.cwd(),
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

        if (options?.css === false && ctx?.css?.result) {
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
