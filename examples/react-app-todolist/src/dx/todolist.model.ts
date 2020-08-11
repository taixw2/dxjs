import { Dx, DxModel, Dispatch } from '@dxjs/core';
import { Reducer, Effect } from '@dxjs/common';

@Dx.collect()
export class TodolistModel extends DxModel {
  static addToData: Dispatch;

  state = {
    data: [] as string[],
  };

  @Reducer()
  addToData(text: string): void {
    this.state.data.push(text + Math.random().toFixed(6));
    // if no use immer
    // return { ...this.state, data: [...this.state.data] };
  }

  @Reducer()
  removeToData(index: number): void {
    this.state.data.splice(index, 1);
  }

  @Effect()
  *asyncAddToData(text: string): Generator {
    const action = TodolistModel.addToData(text, false);
    yield this.$delay(1000);
    yield this.$put(action);
  }
}
