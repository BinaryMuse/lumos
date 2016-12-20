import React from 'react'
import ReactDom from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import reducer from './reducers'
import * as actions from './actions'

import Application from './components/application'

const store = createStore(reducer, applyMiddleware(thunk))
store.dispatch(actions.init(process.env.LUMOS_IMAGE_DIR))

const app = (
  <Provider store={store}>
    <Application />
  </Provider>
)

ReactDom.render(app, document.getElementById('app'))
