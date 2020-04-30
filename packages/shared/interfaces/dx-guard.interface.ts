/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *
 * 能够获取到 effect 的 payload,
 * 通过判断是否合法，决定是否要中断这次 action
 */

import { AnyAction } from 'redux';

export interface BaseGuardInterface<T extends AnyAction> {
  /**
   * 获取整个状态树
   */
  getState(): any;
  /**
   * 通过该方法可以拿到传入的 payload
   */
  getPayload(): T;
  /**
   * 通过该方法可以拿到传入的 payload
   */
  dispatchCurrentAction<P>(payload?: P): T;
}

export interface GuardInterface<T extends AnyAction = any> extends BaseGuardInterface<T> {
  /**
   * 实现该方法，返回 false 则 effect 执行
   */
  guard(error?: Error, data?: any): Promise<boolean | void>;
}

export type GuardStatic = { new (): GuardInterface };
