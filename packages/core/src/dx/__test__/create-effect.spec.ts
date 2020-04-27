import { ExampleModel } from '../../../__tests__/example-model';
import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { hackTaro } from '../create-effect/hack-taro';
import { EFFECT_METHODS_META, EFFECT_METHODS_KEY } from '@dxjs/shared/symbol';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { isGenerator } from '../create-effect/is-generator';
import { createEffect } from '../create-effect';

describe('create effect', () => {
  const ExampleModelStatic: DxModelContstructor = ExampleModel;
  let model: ExampleModel;
  beforeEach(() => {
    Reflect.deleteProperty(process.env, 'TARO_ENV');
    Reflect.deleteMetadata(EFFECT_METHODS_META, ExampleModelStatic);
    Reflect.deleteMetadata(EFFECT_METHODS_KEY, ExampleModelStatic);
    model = new ExampleModelStatic() as ExampleModel;
  });

  it('hack taro', () => {
    process.env.TARO_ENV = 'WEB';
    hackTaro(model);
    const effects: Set<EffectTypeInterface> = Reflect.getMetadata(EFFECT_METHODS_META, ExampleModelStatic);
    expect(effects).not.toBeUndefined();
    expect([...effects].map((v: EffectTypeInterface) => v.name)).toContain('normalGeneratorFunction');
  });

  it('no hack taro', () => {
    hackTaro(model);
    const effects: Set<EffectTypeInterface> = Reflect.getMetadata(EFFECT_METHODS_META, ExampleModelStatic);
    expect(effects).toBeUndefined();
  });

  it('is generator', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isGenerator(function*() {})).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isGenerator(function() {})).toBe(false);
    expect(isGenerator(model.asyncUpdateCount)).toBe(true);
    expect(isGenerator(model.updateCount)).toBe(false);
    expect(isGenerator(model.state as any)).toBe(false);
  });

  it('create effect, no collect model', () => {
    expect(createEffect(Symbol(), model)).toBeUndefined();
  });

  it('create effect', () => {
    Reflect.set(process.env, 'TARO_ENV', 'WEB');
    hackTaro(model);
    expect(isGenerator(createEffect(Symbol(), model) as Function)).toBe(true);
  });
});
