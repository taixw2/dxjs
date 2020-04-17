import React from 'react';
import { Dx } from '@dxjs/core';
import styles from './index.module.css';
import { connect } from '@dxjs/core';

function Item({ text, index }) {
  function onPressItem() {
    Dx.getModels(/^Todo/)[0].removeToData(index, true);
  }
  return (
    <li onClick={onPressItem} className={styles['list-item']}>
      {text}
    </li>
  );
}

function ListContainer({ data }) {
  if (!data || !data.length) return null;
  return (
    <ul className={styles['list-container']}>
      {data.map((text, i) => (
        <Item key={text} text={text} index={i} />
      ))}
    </ul>
  );
}

function Main({ todoList }) {
  const ref = React.useRef();

  function onPressSyncButton() {
    Dx.getModels().TodolistModel.addToData(ref.current.value, true);
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

const mapStateToProps = ({ TodolistModel }) => {
  return { todoList: TodolistModel.data };
};

export default connect(mapStateToProps)(Main);
