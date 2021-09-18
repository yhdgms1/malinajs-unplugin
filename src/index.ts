import type { Options } from "./types";

import { createUnplugin } from "unplugin";
import malina from "malinajs";

export const unplugin = createUnplugin<Options>((options) => {
  if (!options) options = {};

  if (!options.extensions) options.extensions = ["ma", "xht"];

  if (options.displayVersion) console.log("! Malina.js", malina.version);

  let content_cache: { [key: string]: string } = {};

  return {
    name: "malinajs",
    transformInclude(id) {
      return options!.extensions!.some((extension) =>
        id.endsWith("." + extension)
      );
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
          const name = id.replace(/[^\w.\\-]/g, "") + ".css";

          content_cache[name] = ctx.css.result;

          result += `\nimport "${name}";\n`;
        }

        return result;
      } catch (error: any) {
        if (error?.details && !options?.warning) console.log(error?.details);
        if (error?.details && options?.warning) options.warning(error?.details);

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
