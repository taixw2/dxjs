/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from '../helper/label';
import { LABEL, EFFECT_METHODS_META, TAKE_EVERY, REDUCER_METHODS_KEY } from '@dxjs/shared/symbol';
import { Effect } from '../helper/effect';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { TakeLatest, Throttle } from '../';
import { Reducer } from '../helper/reducer';

describe('helper', () => {
  const key = 'method';
  let Model: any;
  let model: any;
  beforeEach(() => {
    Model = class {};
    model = new Model();
  });

  it('label: 设置类的 label', () => {
    Label('user')(Model);
    expect(Reflect.getMetadata(LABEL, Model)).toEqual(['user']);
    Label('user1', 'user2')(Model);
    expect(Reflect.getMetadata(LABEL, Model)).toEqual(['user', 'user1', 'user2']);
  });

  it('label: 设置类属性的 label', () => {
    Label('user')(model, key, {});
    expect(Reflect.getMetadata(LABEL, Model, key)).toEqual(['user']);
    Label('user1', 'user2')(model, key, {});
    expect(Reflect.getMetadata(LABEL, Model, key)).toEqual(['user', 'user1', 'user2']);
  });

  it('effect: 相同的属性不能有多个 effect helper', () => {
    Effect()(model, key, {});
    const metas = Reflect.getMetadata(EFFECT_METHODS_META, Model) as Set<EffectTypeInterface>;
    expect(metas.size).toBe(1);
    // 重复添加
    Effect()(model, key, {});
    expect(metas.size).toBe(1);
  });

  it('effect: 传不同的参数', () => {
    const nsActionType = 'ns/actionType';
    // 不传参数
    Effect()(model, key, {});

    const metas = Reflect.getMetadata(EFFECT_METHODS_META, Model) as Set<EffectTypeInterface>;
    const ge = metas.values();
    expect(ge.next().value).toMatchObject({ name: key, helperType: TAKE_EVERY });

    // 传入 action type
    Effect(nsActionType)(model, key + '1', {});
    expect(ge.next().value).toMatchObject({ name: key + '1', helperType: TAKE_EVERY, actionType: nsActionType });

    // 传入 Action Type + Helper
    Effect(nsActionType, TakeLatest)(model, key + '2', {});
    expect(ge.next().value).toMatchObject({ name: key + '2', helperType: TakeLatest, actionType: nsActionType });

    // 只传入 helper
    Effect(TakeLatest)(model, key + '3', {});
    expect(ge.next().value).toMatchObject({ name: key + '3', helperType: TakeLatest });

    // 传入 helper 与参数
    Effect(Throttle, 100)(model, key + '4', {});
    expect(ge.next().value).toMatchObject({ name: key + '4', helperType: Throttle });
  });

  it('reducer: 生成 symbole action type', () => {
    Reducer()(model, key, {});

    const entries = [...(Reflect.getMetadata(REDUCER_METHODS_KEY, Model) as Map<symbol, string>)];
    expect(typeof entries[0][0]).toBe('symbol');
    expect(entries[0][1]).toBe(key);
  });

  it('reducer: 自定义 action type', () => {
    Reducer('ns')(model, key, {});
    const entries = [...(Reflect.getMetadata(REDUCER_METHODS_KEY, Model) as Map<symbol, string>)];
    expect(entries[0][0]).toBe('ns');
    expect(entries[0][1]).toBe(key);
  });
});
