interface Config {
  name?: string;
  exportDefault?: boolean;
  inlineTemplate?: boolean;
  hideLabel?: boolean;
  compact?: boolean;
  autoSubscribe?: boolean;
  cssGenId?: () => string;
  plugins?: [];
  debug?: boolean;
  css?: boolean | ((css: string, path: string, ctx: any) => void);
  passClass?: boolean;
  immutable?: boolean;
}

interface ContextConfig extends Config {
  path: string;
}

interface ContextCSS {
  id: string;
  result?: string;
}

interface Context {
  result: string;
  source: string;
  config: ContextConfig;
  css?: ContextCSS;
}

declare module "malinajs" {
  export function compile(source: string, config: Config): Context;

  export declare const version: string;
}
