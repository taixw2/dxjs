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
} from 'redux-saga/effects';

export interface DxModelInterface<T = any> {
  state: T;

  $put<A extends Action>(action: A): PutEffect<A>;
  $put<A extends Action>(type: 'resolve', action: A): PutEffect<A>;
  $put<T>(channel: PuttableChannel<T>, action: T | END): ChannelPutEffect<T>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $call<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: Parameters<Fn>
  ): CallEffect<SagaReturnType<Fn>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $call<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctxAndFn: { context: Ctx; fn: Fn },
    ...args: Parameters<Fn>
  ): CallEffect<SagaReturnType<Fn>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $apply<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
    ctx: Ctx,
    fn: Fn,
    args: Parameters<Fn>,
  ): CallEffect<SagaReturnType<Fn>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $cps<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: CpsFunctionParameters<Fn>
  ): CpsEffect<ReturnType<Fn>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $cps<Ctx extends { [P in Name]: (this: Ctx, ...args: any[]) => void }, Name extends string>(
    ctxAndFnName: { context: Ctx; fn: Name },
    ...args: CpsFunctionParameters<Ctx[Name]>
  ): CpsEffect<ReturnType<Ctx[Name]>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $fork<Fn extends (...args: any[]) => any>(
    fn: Fn,
    ...args: Parameters<Fn>
  ): ForkEffect<SagaReturnType<Fn>>;

  $join(tasks: Task[]): JoinEffect;
  $join(task: Task): JoinEffect;
  $cancel(task: Task): CancelEffect;
  $cancel(tasks: Task[]): CancelEffect;

  $select(): SelectEffect;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $select<Fn extends (state: any, ...args: any[]) => any>(
    selector: Fn,
    ...args: Tail<Parameters<Fn>>
  ): SelectEffect;

  $delay<T = true>(ms: number, val?: T): CallEffect<T>;

  $all<T>(effects: { [key: string]: T }): AllEffect<T>;
  $all<T>(effects: T[]): AllEffect<T>;

  $race<T>(effects: { [key: string]: T }): RaceEffect<T>;
  $race<T>(effects: T[]): RaceEffect<T>;
}
