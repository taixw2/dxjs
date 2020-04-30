import { enhancerFilter } from '../enhancer-filter';
import { ExampleModel } from '../../../__tests__/example-model';
import { Label } from '@dxjs/common';

describe('enhancer filter', () => {
  beforeAll(() => {
    Label('Todo')(ExampleModel);
  });

  it('过滤 enhancer: exclude', () => {
    const fn = jest.fn();
    const enhancers = enhancerFilter(ExampleModel, [
      {
        exclude: 'Todo',
        enhancer: fn,
      },
      {
        exclude: /^To/,
        enhancer: fn,
      },
      {
        exclude: 'NoFilter', // no filter
        enhancer: fn,
      },
    ]);
    expect(enhancers.length).toBe(1);
    expect(enhancers[0]).toEqual({ exclude: 'NoFilter', enhancer: fn });
  });

  it('包含 enhancer: exclude', () => {
    const fn = jest.fn();
    const enhancers = enhancerFilter(ExampleModel, [
      {
        include: 'Todo',
        enhancer: fn,
      },
      {
        include: /^To/,
        enhancer: fn,
      },
      {
        include: 'NoFilter', // no filter
        enhancer: fn,
      },
    ]);
    expect(enhancers.length).toBe(2);
    expect(enhancers[0]).toEqual({ include: 'Todo', enhancer: fn });
    expect(enhancers[1]).toEqual({ include: /^To/, enhancer: fn });
  });

  it('包含 enhancer: 同时使用 exclude 和 include, 优先匹配 exclude', () => {
    const fn = jest.fn();
    const enhancers = enhancerFilter(ExampleModel, [
      {
        include: 'Todo',
        exclude: 'Todo',
        enhancer: fn,
      },
      {
        include: /^To/,
        exclude: 'NoFilter',
        enhancer: fn,
      },
    ]);
    expect(enhancers.length).toBe(1);
    expect(enhancers[0]).toEqual({ include: /^To/, enhancer: fn, exclude: 'NoFilter' });
  });
});
