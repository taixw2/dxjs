export interface EffectTypeInterface {
  name: string | symbol;
  actionType: symbol | string;
  helperType: symbol;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}
