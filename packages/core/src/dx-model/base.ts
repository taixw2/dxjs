/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxBaseInterface } from '@dxjs/common/interfaces/dx-base.interface';
import { PuttableChannel, END, Task } from 'redux-saga';
import { Action } from 'redux';
import {
  PutEffect,
  ChannelPutEffect,
  CallEffect,
  SagaReturnType,
  CpsFunctionParameters,
  CpsEffect,
  ForkEffect,
  JoinEffect,
  CancelEffect,
  SelectEffect,
  Tail,
  AllEffect,
  RaceEffect,
  put,
  putResolve,
  call,
  apply,
  cps,
  fork,
  join,
  cancel,
  select,
  delay,
  all,
  race,
  CpsCallback,
  spawn,
  retry,
} from 'redux-saga/effects';

export class DxBase implements DxBaseInterface {
  $put<T>(channel: PuttableChannel<T>, action: T | END): ChannelPutEffect<T>;
  $put<A extends Action>(action: A): PutEffect<A>;
  $put<A extends Action>(resolve: 'resolve', action: A): PutEffect<A>;
  $put<A extends Action>(
    resolve: 'resolve' | A | PuttableChannel<A>,
    action?: A | END,
  ): PutEffect<A> | ChannelPutEffect<A | void> {
    if (resolve === 'resolve') {
      return putResolve(action as A);
    }

    if ('type' in resolve) {
      return put(resolve);
    }

    return put(resolve, action);
  }

  $call<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctxAndFn: [Ctx, Fn],
    ...args: Parameters<Fn>
  ): CallEffect<SagaReturnType<Fn>>;
  $call<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctxAndFn: { context: Ctx; fn: Fn },
    ...args: Parameters<Fn>
  ): CallEffect<SagaReturnType<Fn>>;
  $call<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: Parameters<Fn>
  ): CallEffect<SagaReturnType<Fn>> {
    return call(fn, ...args);
  }

  $apply<Ctx extends { [P in Name]: (this: Ctx, ...args: any[]) => any }, Name extends string>(
    ctx: Ctx,
    fnName: Name,
    args: Parameters<Ctx[Name]>,
  ): CallEffect<SagaReturnType<Ctx[Name]>>;
  $apply<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctx: Ctx,
    fn: Fn,
    args: Parameters<Fn>,
  ): CallEffect<SagaReturnType<Fn>> {
    return apply(ctx, fn, args);
  }

  $cps<Fn extends (cb: CpsCallback<any>) => any>(fn: Fn): CpsEffect<ReturnType<Fn>>;
  $cps<Ctx extends { [P in Name]: (this: Ctx, ...args: any[]) => void }, Name extends string>(
    ctxAndFnName: [Ctx, Name],
    ...args: CpsFunctionParameters<Ctx[Name]>
  ): CpsEffect<ReturnType<Ctx[Name]>>;
  $cps<Ctx extends { [P in Name]: (this: Ctx, ...args: any[]) => void }, Name extends string>(
    ctxAndFnName: { context: Ctx; fn: Name },
    ...args: CpsFunctionParameters<Ctx[Name]>
  ): CpsEffect<ReturnType<Ctx[Name]>>;
  $cps<Ctx, Fn extends (this: Ctx, ...args: any[]) => void>(
    ctxAndFn: [Ctx, Fn],
    ...args: CpsFunctionParameters<Fn>
  ): CpsEffect<ReturnType<Fn>>;
  $cps<Ctx, Fn extends (this: Ctx, ...args: any[]) => void>(
    ctxAndFn: { context: Ctx; fn: Fn },
    ...args: CpsFunctionParameters<Fn>
  ): CpsEffect<ReturnType<Fn>>;
  $cps<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: CpsFunctionParameters<Fn>
  ): CpsEffect<ReturnType<Fn>> {
    return cps(fn, ...args);
  }

  $fork<Ctx extends { [P in Name]: (this: Ctx, ...args: any[]) => any }, Name extends string>(
    ctxAndFnName: [Ctx, Name],
    ...args: Parameters<Ctx[Name]>
  ): ForkEffect<SagaReturnType<Ctx[Name]>>;
  $fork<Ctx extends { [P in Name]: (this: Ctx, ...args: any[]) => any }, Name extends string>(
    ctxAndFnName: { context: Ctx; fn: Name },
    ...args: Parameters<Ctx[Name]>
  ): ForkEffect<SagaReturnType<Ctx[Name]>>;
  $fork<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctxAndFn: [Ctx, Fn],
    ...args: Parameters<Fn>
  ): ForkEffect<SagaReturnType<Fn>>;
  $fork<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctxAndFn: { context: Ctx; fn: Fn },
    ...args: Parameters<Fn>
  ): ForkEffect<SagaReturnType<Fn>>;
  $fork<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: Parameters<Fn>
  ): ForkEffect<SagaReturnType<Fn>> {
    return fork(fn, ...args);
  }

  $spawn<Ctx extends { [P in Name]: (this: Ctx, ...args: any[]) => any }, Name extends string>(
    ctxAndFnName: [Ctx, Name],
    ...args: Parameters<Ctx[Name]>
  ): ForkEffect<SagaReturnType<Ctx[Name]>>;
  $spawn<Ctx extends { [P in Name]: (this: Ctx, ...args: any[]) => any }, Name extends string>(
    ctxAndFnName: { context: Ctx; fn: Name },
    ...args: Parameters<Ctx[Name]>
  ): ForkEffect<SagaReturnType<Ctx[Name]>>;
  $spawn<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctxAndFn: [Ctx, Fn],
    ...args: Parameters<Fn>
  ): ForkEffect<SagaReturnType<Fn>>;
  $spawn<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctxAndFn: { context: Ctx; fn: Fn },
    ...args: Parameters<Fn>
  ): ForkEffect<SagaReturnType<Fn>>;
  $spawn<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: Parameters<Fn>
  ): ForkEffect<SagaReturnType<Fn>> {
    return spawn(fn, ...args);
  }

  $join(task: Task | Task[]): JoinEffect {
    // 满足 effect types
    if (Array.isArray(task)) return join(task);
    return join(task);
  }

  $cancel(task: Task | Task[]): CancelEffect {
    if (Array.isArray(task)) return cancel(task);
    return cancel(task);
  }
  $cancels(task: Task[]): CancelEffect {
    return cancel(task);
  }

  $select(): SelectEffect;
  $select<Fn extends (state: any, ...args: any[]) => any>(
    selector: Fn,
    ...args: Tail<Parameters<Fn>>
  ): SelectEffect;
  $select<Fn extends (state: any, ...args: any[]) => any>(
    selector?: Fn,
    ...args: Tail<Parameters<Fn>>
  ): SelectEffect {
    if (typeof selector === 'undefined') return select();
    return select(selector, ...args);
  }

  $delay<T = true>(ms: number, val?: T): CallEffect<T> {
    return delay(ms, val);
  }

  $retry<Fn extends (...args: any[]) => any>(
    maxTries: number,
    delayLength: number,
    fn: Fn,
    ...args: Parameters<Fn>
  ): CallEffect<SagaReturnType<Fn>> {
    return retry(maxTries, delayLength, fn, ...args);
  }

  $all<T>(effects: T[]): AllEffect<T>;
  $all<T>(effects: { [key: string]: T }): AllEffect<T> {
    return all(effects);
  }

  $raceWithMap<T>(effects: { [key: string]: T }): RaceEffect<T> {
    return race(effects);
  }

  $race<T>(effects: { [key: string]: T }): RaceEffect<T>;
  $race<T>(effects: T[]): RaceEffect<T> {
    return race(effects);
  }
}
