import { ipcRenderer } from 'electron'

import React from 'react'
import ReactDOM from 'react-dom'
import { Spring, Transition, config } from 'react-spring'

const MAX_RANDOM = 1000000
function random (max) {
  return Math.floor(Math.random() * max)
}

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      images: [
        `https://placem.at/people?w=800&h=480&random=${random(MAX_RANDOM)}&txt=`,
        `https://placem.at/people?w=800&h=480&random=${random(MAX_RANDOM)}&txt=`,
        `https://placem.at/people?w=800&h=480&random=${random(MAX_RANDOM)}&txt=`
      ]
    }
  }

  componentDidMount () {
    setInterval(() => {
      this.setState((state) => {
        const rest = state.images.slice(1)
        rest.push(`https://placem.at/people?w=800&h=480&random=${random(MAX_RANDOM)}&txt=`)
        return { images: rest }
      })
    }, 6000)
  }

  render () {
    const containerStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }

    const images = this.state.images.slice(0, 2)
    return (
      <div style={containerStyle}>
        <Transition
          keys={images}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
          config={config.slow}
        >
          {images.slice(0, 2).map(item => props => <div style={{ ...containerStyle, ...props, background: `url(${item})`, backgroundSize: 'cover' }} />)}
        </Transition>
        <img src={this.state.images[2]} style={{ position: 'absolute', left: -10000, top: -10000 }} />
      </div>
    )
  }
  renderOld () {
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
