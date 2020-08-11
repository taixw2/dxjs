import { SymbolType } from '../symbol';

export interface EffectTypeInterface {
  name: SymbolType;
  // action type
  actionType: SymbolType;
  /**
   * saga helper
   * TAKE_EVERY,TAKE_LATEST,TAKE_LEADING,THROTTLE
   */
  helperType: SymbolType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}
