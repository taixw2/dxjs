import React from 'react';
import styles from './index.module.css';

function ListContainer({ data }) {
  if (!data || !data.length) return null;

  function Item({ text }) {
    return <li className={styles['list-item']}>{text}</li>;
  }

  return (
    <ul className={styles['list-container']}>
      {data.map(i => (
        <Item key={i} text={i} />
      ))}
    </ul>
  );
}

export default function Main() {
  return (
    <div className={styles.container}>
      <div>
        <input placeholder="input some things" className={styles.input} />
        <button className={styles.button}>Sync</button>
        <button className={styles.button}>Async</button>
      </div>

      <ListContainer data={[1, 2, 3]} />
    </div>
  );
}
