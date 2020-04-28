/**
 *
 * 可以穿插在 effect 中，并且可以中断 effect
 */
import { DxBaseInterface } from './dx-base.interface';
import { AnyAction } from 'redux';
import { BaseEffectContextInterface } from './dx-effect-context.interface';

export interface SpyBaseInterface<T extends AnyAction> extends DxBaseInterface {
  /**
   * 相当于 effect 的 generator 引用
   * 通过 next 可以执行一次 effect 的一个 yield
   * 于 generator 的引用不同，这个不能传值，也不能获取返回值
   */
  next(): void;

  /**
   * 中断 effect
   */
  abort(): void;

  /**
   * 获取 payload
   */
  getPayload(): T['payload'];

  /**
   * 重新 dispatch 当前的 action
   */
  dispatchCurrentAction(): T;
}

export interface SpyInterface<T extends AnyAction> extends SpyBaseInterface<T> {
  /**
   * 继承 Spy 必须实现 spy 方法
   */
  spy(): Generator;
}

export interface SpyStatic {
  new <T extends AnyAction>(context: BaseEffectContextInterface<T>): SpyInterface<T>;
}
