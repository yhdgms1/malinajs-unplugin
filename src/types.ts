type Glob = string | string[]

export interface MalinaPlugin {
  name: string;
  dom: (ctx: any) => Promise<void>;
}

export interface Options {
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
   * controls how to handle CSS, true - adds css to JS bundle, false - into outside css file, function - intercepts css for manual handling
   * @default true
   */
  css?: boolean | ((css: string, path: string, ctx: any) => void);
  /**
   * convert new line to \n
   * @default false
   */
  inlineTemplate?: boolean;
  /**
   * hide comment tags (labels) from DOM
   * @default false
   */
  hideLabel?: boolean;
  /**
   * remove spaces between DOM elements
   * @default true
   */
  compact?: boolean;
  /**
   * autosubscribe imported stores
   * @default true
   */
  autoSubscribe?: boolean;
  /**
   *
   * generate hash for css classes
   * @example () => `amogus-${hash(this.name)}`
   */
  cssGenId?: () => string;
  /**
   * adds info label nodes
   * @default false
   */
  debugLabel?: boolean;
  /**
   * passing classes to child component
   * @default true
   */
  passClass?: boolean;
  /**
   * if true it doesn't perform deep comparison of objects
   * @default false
   */
  immutable?: boolean;
  /**
   * a function to handle missed components
   * @example (name) => "import ${name} from './${name}.xht';";
   */
  autoimport?: (name: string) => string;
  /**
   * function to receive warnings
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
}
