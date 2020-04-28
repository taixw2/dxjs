/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *
 * 能够获取到 effect 的 payload,
 * 通过判断是否合法，决定是否要中断这次 action
 */

import { AnyAction } from 'redux';

export interface BaseSentinelInterface<T extends AnyAction> {
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

export interface SentinelInterface<T extends AnyAction> extends BaseSentinelInterface<T> {
  /**
   * 实现该方法，返回 false 则 effect 执行
   */
  sentinel(): Promise<boolean | void>;
}
