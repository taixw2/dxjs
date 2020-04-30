import { createEffectFork } from '../create-effect-fork';
import { TAKE_EVERY, THROTTLE, TAKE_LEADING, TAKE_LATEST } from '@dxjs/shared/symbol';
import { takeLatest, takeEvery, takeLeading, throttle } from 'redux-saga/effects';

describe('create effect fork', () => {
  function* effect(): Generator {
    //
  }

  it('TAKE_EVERY', () => {
    const fork = createEffectFork({ helperType: TAKE_EVERY, actionType: 'tt' } as any, effect);
    const g = fork.payload.fn();
    expect(g.next().value).toMatchObject(takeEvery('tt', effect));
  });

  it('TAKE_LATEST', () => {
    const fork = createEffectFork({ helperType: TAKE_LATEST, actionType: 'tt' } as any, effect);
    const g = fork.payload.fn();
    expect(g.next().value).toMatchObject(takeLatest('tt', effect));
  });

  it('TAKE_LEADING', () => {
    const fork = createEffectFork({ helperType: TAKE_LEADING, actionType: 'tt' } as any, effect);
    const g = fork.payload.fn();
    expect(g.next().value).toMatchObject(takeLeading('tt', effect));
  });

  it('THROTTLE', () => {
    const fork = createEffectFork({ helperType: THROTTLE, actionType: 'tt', value: [350] } as any, effect);
    const g = fork.payload.fn();
    expect(g.next().value).toMatchObject(throttle(350, 'tt', effect));
  });

  it('DEFAULT', () => {
    const fork = createEffectFork({ helperType: 'DEFAULT', actionType: 'tt', value: [350] } as any, effect);
    const g = fork.payload.fn();
    expect(g.next().value).toMatchObject(takeEvery('tt', effect));
  });
});
