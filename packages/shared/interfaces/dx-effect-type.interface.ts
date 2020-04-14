import { SymbolType } from '../symbol';

export interface EffectTypeInterface {
  name: SymbolType;
  actionType: SymbolType;
  helperType: SymbolType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}
