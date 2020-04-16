import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { ExampleModel } from './example-model';
import { Dx } from '../src/dx';
import { Reducer, Action } from 'redux';

describe('Dx create option', () => {
  const ExampleModelStatic: DxModelContstructor = ExampleModel;

  it('Dx reducerEnhancer', () => {
    const mockFn = jest.fn();
    function mockReducerEnhancer(reducer: Reducer): Reducer {
      mockFn();
      return <T>(state: T, action: Action): Reducer => reducer(state, action);
    }

    Dx.createStore({
      reducerEnhancer: [mockReducerEnhancer],
      models: [ExampleModelStatic],
    });
    expect(mockFn.mock.calls.length).toBe(1);
  });
});
