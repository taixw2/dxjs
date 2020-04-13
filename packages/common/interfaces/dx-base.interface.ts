/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from 'redux';
import { PuttableChannel, END, Task } from 'redux-saga';
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
  CpsCallback,
} from 'redux-saga/effects';

export interface DxBaseInterface {
  // saga put types
  $put<A extends Action>(action: A): PutEffect<A>;
  $put<T>(channel: PuttableChannel<T>, action: T | END): ChannelPutEffect<T>;
  $put<A extends Action>(resolve: 'resolve', action: A): PutEffect<A>;

  // saga call types
  $call<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: Parameters<Fn>
  ): CallEffect<SagaReturnType<Fn>>;
  $call<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctxAndFn: [Ctx, Fn],
    ...args: Parameters<Fn>
  ): CallEffect<SagaReturnType<Fn>>;
  $call<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctxAndFn: { context: Ctx; fn: Fn },
    ...args: Parameters<Fn>
  ): CallEffect<SagaReturnType<Fn>>;

  // saga apply
  $apply<Ctx extends { [P in Name]: (this: Ctx, ...args: any[]) => any }, Name extends string>(
    ctx: Ctx,
    fnName: Name,
    args: Parameters<Ctx[Name]>,
  ): CallEffect<SagaReturnType<Ctx[Name]>>;
  $apply<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctx: Ctx,
    fn: Fn,
    args: Parameters<Fn>,
  ): CallEffect<SagaReturnType<Fn>>;

  // saga cps
  $cps<Fn extends (cb: CpsCallback<any>) => any>(fn: Fn): CpsEffect<ReturnType<Fn>>;
  $cps<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: CpsFunctionParameters<Fn>
  ): CpsEffect<ReturnType<Fn>>;
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

  // saga fork
  $fork<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: Parameters<Fn>
  ): ForkEffect<SagaReturnType<Fn>>;
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

  // saga spawn
  $spawn<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: Parameters<Fn>
  ): ForkEffect<SagaReturnType<Fn>>;
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

  // saga join
  $join(task: Task): JoinEffect;
  $join(tasks: Task[]): JoinEffect;

  // saga cancel
  $cancel(task: Task[]): CancelEffect;
  $cancel(task: Task): CancelEffect;

  // saga select
  $select(): SelectEffect;
  $select<Fn extends (state: any, ...args: any[]) => any>(
    selector: Fn,
    ...args: Tail<Parameters<Fn>>
  ): SelectEffect;

  // saga delay
  $delay<T = true>(ms: number, val?: T): CallEffect<T>;

  // saga retry
  $retry<Fn extends (...args: any[]) => any>(
    maxTries: number,
    delayLength: number,
    fn: Fn,
    ...args: Parameters<Fn>
  ): CallEffect<SagaReturnType<Fn>>;

  // saga all
  $all<T>(effects: T[]): AllEffect<T>;
  $all<T>(effects: { [key: string]: T }): AllEffect<T>;

  // saga all
  $race<T>(effects: { [key: string]: T }): RaceEffect<T>;
  $race<T>(effects: T[]): RaceEffect<T>;
}
