/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render, version } from 'react-dom';
import { Dx } from '@dxjs/core';
import Main from './pages/main';
import './dx/todolist.model';

const root = document.createElement('div');
document.body.appendChild(root);

const DxApp = Dx.create();

render(
  <React.StrictMode>
    <DxApp>
      <Main />
    </DxApp>
  </React.StrictMode>,
  root,
);
