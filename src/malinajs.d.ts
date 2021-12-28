type MalinaPlugin = import("./types").MalinaPlugin;
type Config = import("./types").Options;

interface ContextCSS {
  id: string;
  result?: string;
}

interface Context {
  result: string;
  source: string;
  config: Config;
  css?: ContextCSS;
}

declare module "malinajs" {
  export function compile(source: string, config: Config): Context;

  export declare const version: string;
}
