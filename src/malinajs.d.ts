import { Options } from "tsup";

type MalinaPlugin = import("./types").MalinaPlugin;
type Config = import("./types").Options;
type Context = import("./types").Context;

declare module "malinajs" {
  export function compile(source: string, config: Config): Promise<Context>;

  export declare const version: string;
}
