/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Dx } from '@dxjs/core';
import styles from './index.module.css';
import { connect } from '@dxjs/core';

function Item({ text, index }: any) {
  function onPressItem() {
    Dx.getModels(/^Todo/)[0].removeToData(index, true);
  }
  return (
    <li onClick={onPressItem} className={styles['list-item']}>
      {text}
    </li>
  );
}

function ListContainer({ data }: any) {
  if (!data || !data.length) return null;
  return (
    <ul className={styles['list-container']}>
      {data.map((text: string, i: number) => (
        <Item key={text} text={text} index={i} />
      ))}
    </ul>
  );
}

function Main({ todoList }: any) {
  const ref: any = React.useRef();
  
  function onPressSyncButton() {
    Dx.getModels().TodolistModel.addToData(ref.current?.value, true);
  }

  function onPressAsyncButton() {
    Dx.getModels('T').asyncAddToData(ref.current.value, true);
  }

  return (
    <div className={styles.container}>
      <div>
        <input ref={ref} placeholder="input some things" className={styles.input} />
        <button onClick={onPressSyncButton} className={styles.button}>
          Sync
        </button>
        <button onClick={onPressAsyncButton} className={styles.button}>
          Async
        </button>
      </div>
      <ListContainer data={todoList} />
    </div>
  );
}

const mapStateToProps = store => {
  return { todoList: store.TodolistModel.data };
};

export default connect(mapStateToProps)(Main);
