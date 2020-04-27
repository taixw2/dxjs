import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { ExampleModel } from './example-model';
import { Dx } from '../src/dx';

describe('Dx create option', () => {
  const ExampleModelStatic: DxModelContstructor = ExampleModel;

  it('Dx reducerEnhancer', () => {
    Dx.createStore({
      models: [ExampleModelStatic],
    });

    expect(ExampleModelStatic.delayUpdate(20, true).then).not.toBeUndefined();
  });
});
