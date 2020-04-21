import Taro, { Component, Config } from '@tarojs/taro';
import { View, Button, Input, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { Dx } from '@dxjs/core';
import './index.css';

interface IndexProps {
  todoList: string[];
}

const mapStateToProps = ({ TodolistModel }) => {
  return { todoList: TodolistModel.data };
};

@connect(mapStateToProps)
export default class Index extends Component<IndexProps> {
  config: Config = {
    navigationBarTitleText: '首页',
  };

  state = {
    inputValue: '',
  };

  onChangeValue = ({ target }) => {
    this.setState({ inputValue: target.value });
  };

  onPressSyncButton = () => {
    Dx.getModels('TodolistModel').addToData(this.state.inputValue, true);
  };

  onPressASyncButton = () => {
    Dx.getModels('To').asyncAddToData(this.state.inputValue, true);
  };

  render() {
    const { inputValue } = this.state;
    const { todoList } = this.props;
    return (
      <View className="index">
        <Input
          placeholder="输入文字"
          className="input"
          onInput={this.onChangeValue}
          value={inputValue}
        />
        <Button type="primary" onClick={this.onPressSyncButton}>
          Sync
        </Button>
        <Button type="primary" onClick={this.onPressASyncButton}>
          Async
        </Button>
        <View style={{ paddingTop: 10 }}></View>
        {todoList.map(text => (
          <Text className="item" key={text}>{text}</Text>
        ))}
      </View>
    );
  }
}
