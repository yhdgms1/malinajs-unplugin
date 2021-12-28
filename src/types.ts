type Glob = string | string[];
type Thenable<T> = T | Promise<T>;

type MalinaPLuginHookResult = Thenable<void>;
type MalinaPLuginHook = (ctx: any) => MalinaPLuginHookResult;

export interface MalinaPlugin {
  name: string;
  "dom:before"?: MalinaPLuginHook;
  dom?: MalinaPLuginHook;
  "dom:check"?: MalinaPLuginHook;
  "dom:compact"?: MalinaPLuginHook;
  "dom:after"?: MalinaPLuginHook;
  "js:before"?: MalinaPLuginHook;
  js?: MalinaPLuginHook;
  "js:after"?: MalinaPLuginHook;
  "css:before"?: MalinaPLuginHook;
  css?: MalinaPLuginHook;
  "runtime:before"?: MalinaPLuginHook;
  runtime?: MalinaPLuginHook;
  "build:before"?: MalinaPLuginHook;
  build?: MalinaPLuginHook;
}

export interface Options {
  /**
   * Use default export for component
   * @default true
   */
  exportDefault?: boolean
  /**
   * By default, all ".xht" and ".ma" files are compiled
   * @default ['ma', 'xht']
   */
  extensions?: string[];
  /**
   * Exclude globs
   *
   * @default []
   */
  exclude?: Glob;
  /**
   * Include globs
   *
   * @default []
   */
  include?: Glob;
  /**
   * Controls how to handle CSS, true - adds css to JS bundle, false - into outside css file, function - intercepts css for manual handling
   * @default true
   */
  css?: boolean | ((css: string, path: string, _ctx: any, ctx: any) => void);
  /**
   * Convert new line to \n
   * @default false
   */
  inlineTemplate?: boolean;
  /**
   * Hide comment tags (labels) from DOM
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Remove spaces between DOM elements
   * @default true
   */
  compact?: boolean;
  /**
   * Autosubscribe imported stores
   * @default true
   */
  autoSubscribe?: boolean;
  /**
   *
   * Generate hash for css classes
   * @example () => `amogus-${hash(this.name)}`
   */
  cssGenId?: () => string;
  /**
   * Adds info label nodes
   * @default false
   */
  debugLabel?: boolean;
  /**
   * Passing classes to child component
   * @default true
   */
  passClass?: boolean;
  /**
   * If true it doesn't perform deep comparison of objects
   * @default false
   */
  immutable?: boolean;
  /**
   * A function to handle missed components
   * @example (name) => `import ${name} from './${name}.xht';`
   * @param {string} name A name of imported component
   * @param {string} path A path to component, in which import should be resolved
   */
  autoimport?: (name: string, path: string, ctx: any) => string;
  /**
   * Function to receive warnings
   */
  warning?: (warn: string) => void;
  /**
   * Show annoying message with version of Malina.js
   * @default false
   */
  displayVersion?: boolean;
  /**
   * Malina.js plugins
   * @default []
   */
  plugins?: MalinaPlugin[];
  /**
   * If true, then if 'malina.config.js' file is found near the component, it will be used to extend options.
   * 
   * Will be used only if 'path' is passed
   * @default null
   */
  localConfig?: boolean | null;
  /**
   * Path to a component
   */
  path?: string;
}
