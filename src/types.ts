export type Glob = string | string[];
export type Thenable<T> = T | Promise<T>;
export type Modify<T, R> = Omit<T, keyof R> & R;
export type AcornNode = import("acorn").Node;

export type MalinaPluginHookResult = Thenable<void>;
export type MalinaPluginHook<T> = (ctx: T) => MalinaPluginHookResult;

export interface BaseContext {
  /**
   * The source code of the component
   */
  source: string;
  /**
   * The compiler's configuration
   */
  config: Options;
  uniqIndex: number;
  warning: (warn: string) => void;
  Q: (str: string) => string;
  inuse: Record<string, string | number>;
  require: (...args: string[]) => void;
  DOM: null;
  compactDOM(): void;
  buildBlock(data: any, option?: {}): any;
  bindProp(prop: any, node: any, element: any, requireCD: any): any;
  makeEachBlock(
    data: any,
    option: any
  ): {
    source: any;
  };
  makeifBlock(data: any, element: any, requireCD: any): any;
  makeComponent(
    node: any,
    requireCD: any
  ): {
    bind: any;
  };
  makeComponentDyn(node: any, requireCD: any, element: any): any;
  makeHtmlBlock(exp: any, label: any, requireCD: any): any;
  makeAwaitBlock(node: any, element: any): any;
  attachSlot(slotName: any, node: any, requireCD: any): any;
  makeFragment(node: any, requireCD: any): any;
  attachFragmentSlot(label: any, requireCD: any): any;
  attachFragment(node: any): any;
  attchExportedFragment(
    node: any,
    label: any,
    componentName: any,
    requireCD: any
  ): any;
  attachHead(n: any, requireCD: any): any;
  inspectProp(prop: any): {
    name: any;
    value: any;
    rawValue: any;
    static: boolean;
  };
  attachPortal(node: any, requireCD: any): any;
  makeEventProp(prop: any, requireElement: any): any;
  glob: {
    apply: any;
    component: any;
    componentFn: any;
    rootCD: any;
  };
  module: {
    top: any;
    head: any;
    code: any;
    body: any;
  };
  checkRootName(name: string): void;
  parseHTML(): void;
  parseText: (source: string) => {
    result: any[];
    parts: {
      value: string;
      type: "js" | "text" | "exp";
    }[];
    staticText: string;
  };
  script: null;
  scriptNodes: null;
  js_parse(): void;
  js_transform(): void;
  js_build(): void;
}

export interface ParserNode {
  type: "node" | "script" | "template" | "style" | string;
  name: string;
  elArg: null;
  openTag: string;
  start: number;
  end: number;
  closedTag: string;
  voidTag: boolean;
  attributes: { content: string; name: string; value: string }[];
  classes?: Set<string>;
  content: string;
}

export interface ParserNodeScript
  extends Modify<
    Exclude<ParserNode, "classes">,
    {
      type: "script";
      name: "script";
    }
  > {}

export interface ParserNodeStyle
  extends Modify<
    Exclude<ParserNode, "classes">,
    {
      type: "style";
      name: "style";
    }
  > {}

export type ContextDomStageRootBody =
  | {
      type: "comment" | "template" | "text" | "systag";
      content: string;
    }
  | {
      type: "await";
      value: string;
      body: ContextDomStageRootBody[];
      parts: {
        main: ContextDomStageRootBody[];
        mainValue: string;
        then: ContextDomStageRootBody[];
        thenValue: string;
        catch: ContextDomStageRootBody[];
        catchValue: string;
      };
    }
  | {
      type: "slot" | "fragment" | "each" | "if";
      value: string;
      body: ContextDomStageRootBody[];
    }
  | ParserNode
  | ParserNodeScript
  | ParserNodeStyle;

export interface ContextDomStage
  extends Modify<
    BaseContext,
    {
      DOM: {
        type: "root";
        body: ContextDomStageRootBody[];
      };
    }
  > {}

export interface ContextDomCheckStage
  extends Modify<
    ContextDomStage,
    {
      scriptNodes: ParserNodeScript[];
      styleNodes: ParserNodeStyle[];
    }
  > {}

export interface ContextDomCompactStage extends ContextDomCheckStage {}
export interface ContextDomAfterStage extends ContextDomCompactStage {}
export interface ContextJsBeforeStage extends ContextDomAfterStage {}
export interface ContextJsStage
  extends Modify<
    ContextJsBeforeStage,
    {
      script: {
        source: string;
        watchers: string[];
        imports: [];
        importedNames: [];
        autosubscribeNames: string[];
        props: [];
        rootVariables: Record<string, boolean>;
        rootFunctions: Record<string, boolean>;
        readOnly: boolean;
        autoimport: {};
        comments: { start: number; end: number; value: string }[];
        ast: AcornNode;
      };
    }
  > {}

export interface ContextJsAfterStage
  extends Modify<
    ContextJsStage,
    {
      script: {
        source: string;
        watchers: string[];
        rootVariables: Record<string, boolean>;
        rootFunctions: Record<string, boolean>;
        readOnly: boolean;
        autoimport: {};
        ast: AcornNode;
        rootLevel: AcornNode[];
        imports: [];
        importedNames: string[];
        onMount?: boolean;
        onDestroy?: boolean;
        props: [];
      };
    }
  > {}

export interface ContextCssBeforeStage extends ContextJsAfterStage {}

export interface ContextCssStageResolveArguments {
  cleanSelector: string;
  isSimple: boolean;
  source: unknown[];
  fullyGlobal: boolean;
  hashedSelectors: unknown[];
  local: string;
  $selector: boolean;
  resolved: boolean;
}

export interface ContextCssStage
  extends Modify<
    ContextCssBeforeStage,
    {
      css: {
        id: string;
        externalMainName: null | string;
        isExternalClass: (name: string) => boolean;
        markAsExternal: (name: string) => void;
        active: () => boolean;
        containsExternal: () => boolean;
        getClassMap: () => {
          classMap: Record<string, string>;
          metaClass: Record<string, string>;
          main: null | string;
        };
        process: (data: ContextCssBeforeStage["DOM"]) => void;
        resolve: (sel: ContextCssStageResolveArguments) => string;
        getContent: () => string;
      };
    }
  > {}

export interface ContextRuntimeBeforeStage extends ContextCssStage {}
export interface ContextRuntimeStage extends ContextCssBeforeStage {}

export interface ContextBuildBeforeStage extends ContextRuntimeStage {}
export interface ContextBuildStage
  extends Modify<
    ContextBuildBeforeStage,
    {
      result: string;
    }
  > {}

export type Context = ContextBuildStage;

export interface MalinaPlugin {
  name: string;
  "dom:before"?: MalinaPluginHook<BaseContext>;
  dom?: MalinaPluginHook<ContextDomStage>;
  "dom:check"?: MalinaPluginHook<ContextDomCheckStage>;
  "dom:compact"?: MalinaPluginHook<ContextDomCompactStage>;
  "dom:after"?: MalinaPluginHook<ContextDomAfterStage>;
  "js:before"?: MalinaPluginHook<ContextJsBeforeStage>;
  js?: MalinaPluginHook<ContextJsStage>;
  "js:after"?: MalinaPluginHook<ContextJsAfterStage>;
  "css:before"?: MalinaPluginHook<ContextCssBeforeStage>;
  css?: MalinaPluginHook<ContextCssStage>;
  "runtime:before"?: MalinaPluginHook<ContextRuntimeBeforeStage>;
  runtime?: MalinaPluginHook<ContextRuntimeStage>;
  "build:before"?: MalinaPluginHook<ContextBuildBeforeStage>;
  build?: MalinaPluginHook<ContextBuildStage>;
}

export interface Options {
  /**
   * Use default export for component
   * @default true
   */
  exportDefault?: boolean;
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
