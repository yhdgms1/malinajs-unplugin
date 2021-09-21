import type { Options } from "./types";

import { createUnplugin } from "unplugin";
import malina from "malinajs";
import fastGlob from "fast-glob";
const { sync: fg } = fastGlob;

export const unplugin = createUnplugin<Options>((options) => {
  if (!options) options = {};

  if (!options.extensions) options.extensions = ["ma", "xht"];

  if (options.displayVersion) console.log("! Malina.js", malina.version);

  let content_cache: { [key: string]: string } = {};

  return {
    name: "malinajs",
    transformInclude(id) {
      const extensionMatches = options!.extensions!.some((extension) =>
        id.endsWith("." + extension)
      );

      if (!options?.include && !options?.exclude) {
        return extensionMatches;
      }

      const files = fg(options.include || [], {
        cwd: process.cwd(),
        ignore: options.exclude || [],
        onlyFiles: true,
        absolute: true,
      });

      return files.includes(id) || extensionMatches;
    },
    async transform(code, id) {
      const compileOptions = {
        ...options,
        path: id,
        name: id.match(/([^\/\\]+)\.\w+$/)![1],
      };

      try {
        const ctx = await malina.compile(code, compileOptions);

        let result = ctx.result;

        if (ctx?.css?.result) {
          const name = id.replace(/[^\w.\\-]/g, "") + ".malina.css";

          content_cache[name] = ctx.css.result;

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
    async resolveId(name) {
      if (content_cache[name]) return name;

      if (name === "malinajs") return await require("malinajs/runtime");

      return null;
    },
    load(id) {
      return content_cache[id] || null;
    },
  };
});

export const vitePlugin = unplugin.vite;
export const rollupPlugin = unplugin.rollup;
export const webpackPlugin = unplugin.webpack;
