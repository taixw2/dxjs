import { AnyAction } from 'redux';
import { BaseEffectContextInterface } from './dx-effect-context.interface';
import { SentinelInterface } from './dx-sentinel.interface';
import { GuardInterface } from './dx-guard.interface';

export interface EnhancerSupportStatic {
  new <T extends AnyAction>(context: BaseEffectContextInterface<T>): SentinelInterface<T>;
  new <T extends AnyAction>(context: BaseEffectContextInterface<T>, error?: Error, data?: unknown): GuardInterface<T>;
}

export interface EnhancerFunctionSupportInterface {
  <T extends AnyAction>(context: BaseEffectContextInterface<T>): Promise<boolean | void>;
  <T extends AnyAction>(context: BaseEffectContextInterface<T>, error?: Error, data?: unknown): Promise<boolean | void>;
}
