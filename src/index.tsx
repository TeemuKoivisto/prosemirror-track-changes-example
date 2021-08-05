import * as React from 'react'
import { render } from 'react-dom'

import { UIContext, createStore } from 'context/UIStore'

import { Routes } from './routes'

import './index.css'

render(
  <UIContext.Provider value={createStore()}>
    <Routes />
  </UIContext.Provider>,
  document.getElementById('root')
)
