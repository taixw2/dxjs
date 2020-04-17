
import  { Dx, DxModel } from '@dxjs/core'
import  { Reducer } from '@dxjs/common'
console.log("Dx", Dx)

class TodolistModel extends DxModel {

  state = {
    data: []
  }

  @Reducer()
  addToData(text) {
    this.state.data.push(text)
  }

  @Reducer()
  removeToData(index) {
    this.state.data.splice(index, 1)
  }

}
