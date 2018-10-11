import { ipcRenderer } from 'electron'
import qs from 'querystring'

import React from 'react'
import ReactDOM from 'react-dom'
import { Spring, Transition } from 'react-spring'

import loadImages from './load-images'
import FullScreen from './ui/full-screen'
import Slideshow from './slideshow'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      loadTimer: false,
      images: null
    }
  }

  async componentDidMount () {
    setTimeout(() => {
      this.setState({ loadTimer: true })
      delete this.timer
    }, 3000)

    const dir = qs.parse(document.location.search.replace(/^\?/, '')).imagedir
    const images = await loadImages(dir)
    this.setState({ images })
  }

  render () {
    const loaded = this.state.loadTimer && this.state.images !== null

    return (
      <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
        {(loaded ? styles => this.renderSlideshow(styles) : styles => this.renderLoading(styles))}
      </Transition>
    )
  }

  renderLoading (styles) {
    return (
      <FullScreen style={{ ...styles, display: 'flex' }} key='loading'>
        <Spring config={{ delay: 500, tension: 100, friction: 50 }} from={{ opacity: 0 }} to={{ opacity: 1 }}>
          {innerStyles => (
            <div style={{ ...innerStyles, color: 'white', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <h1 style={{ textAlign: 'center' }}>L U M O S</h1>
            </div>
          )}
        </Spring>
      </FullScreen>
    )
  }

  renderSlideshow (styles) {
    return (
      <FullScreen style={{ ...styles, display: 'flex' }} key='slideshow'>
        <Slideshow images={this.state.images} />
      </FullScreen>
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
