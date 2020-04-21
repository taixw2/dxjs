import Taro, { Component, Config } from '@tarojs/taro'
import  { Dx, DxModel } from '@dxjs/core'
import  { Reducer, Effect } from '@dxjs/common'


@Dx.collect()
class TodolistModel extends DxModel {

  state = {
    data: []
  }

  @Reducer()
  addToData(text) {
    return { data: [...this.state.data, text] }
  }

  // TODO: taro 不支持装饰器与生成函数同时使用
  *asyncAddToData(text) {
    yield this.$delay(1000)
    yield this.$put(TodolistModel.addToData(text))
  }
}
