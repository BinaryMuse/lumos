import { ipcRenderer } from 'electron'

import React from 'react'
import ReactDOM from 'react-dom'
import { Spring } from 'react-spring'

class App extends React.Component {
  render () {
    return (
      <Spring config={{ delay: 500, tension: 100, friction: 50 }} from={{ opacity: 0 }} to={{ opacity: 1 }}>
        {styles => (
          <div style={{ ...styles, color: 'white', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center' }}>L U M O S</h1>
          </div>
        )}
      </Spring>
    )
  }
}

const render = () => ReactDOM.render(<App />, document.getElementById('app'))

if (document.location.hash.endsWith('booted')) {
  render()
} else {
  ipcRenderer.once('boot-app', () => {
    // Set a flag so that when the page is refreshed we don't wait
    // for the main process to instruct us to boot.
    document.location.hash = 'booted'
    render()
  })
}
