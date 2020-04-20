
import  { Dx, DxModel } from '@dxjs/core'
import  { Reducer, Effect } from '@dxjs/common'


@Dx.collect()
class TodolistModel extends DxModel {

  state = {
    data: []
  }

  @Reducer()
  addToData(text) {
    console.log("TodolistModel -> addToData -> text", text)
    this.state.data.push(text)
  }

  @Reducer()
  removeToData(index) {
    this.state.data.splice(index, 1)
  }

  @Effect()
  *asyncAddToData(text) {
    const action = TodolistModel.addToData(text)
    console.log("TodolistModel -> *AddToData -> action", action)
    yield this.$delay(1000)
    yield this.$put(action)
  }
}
