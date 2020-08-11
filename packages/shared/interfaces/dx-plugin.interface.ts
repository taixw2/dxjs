// 参数

export type Hook =
  | 'beforeDispatch'
  | 'afterDispatch'
  | 'beforeEffect'
  | 'effect'
  | 'afterEffect'
  | 'beforeReducer'
  | 'reducer'
  | 'afterReducer';

interface Context {
  hooks(hook: Hook, callback: unknown): void;
}

export interface ClassPlugin {
  apply(ctx: Context): void;
}

export type DxPlugin = { new (): ClassPlugin } | ((ctx: Context) => void);
