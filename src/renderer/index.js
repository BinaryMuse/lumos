import React from 'react'
import ReactDom from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers'
import rootSaga from './sagas'

import Application from './components/application'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(
  thunk, sagaMiddleware
))
global.store = store

sagaMiddleware.run(rootSaga)

const app = (
  <Provider store={store}>
    <Application />
  </Provider>
)

ReactDom.render(app, document.getElementById('app'))
