import { AnyAction } from 'redux';
import { BaseEffectContextInterface } from './dx-effect-context.interface';
// import { SentinelInterface } from './dx-sentinel.interface';
// import { GuardInterface } from './dx-guard.interface';

export interface EnhancerSupportStatic<T> {
  new (context: BaseEffectContextInterface<T>): T;
  new (context: BaseEffectContextInterface<T>, error?: Error, data?: unknown): T;
}

export interface EnhancerFunctionSupportInterface {
  <T extends AnyAction>(context: BaseEffectContextInterface<T>): Promise<boolean | void>;
  <T extends AnyAction>(context: BaseEffectContextInterface<T>, error?: Error, data?: unknown): Promise<boolean | void>;
}

export type EnhancerSupportInterface<T> = EnhancerSupportStatic<T> | EnhancerFunctionSupportInterface;
