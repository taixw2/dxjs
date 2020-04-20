import React from 'react';
import ReactDOM from 'react-dom';
import Main from './pages/main'
import './dx/todolist.model'
import { Dx } from '@dxjs/core'
import produce from 'immer'

import * as serviceWorker from './serviceWorker';

const DxApp = Dx.create({
  reducerEnhancer: [{ enhancer: produce }]
})

ReactDOM.render(
  <React.StrictMode>
    <DxApp>
      <Main />
    </DxApp>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
