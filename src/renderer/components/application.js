import React from 'react'
import Transition from 'react-motion-ui-pack'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import Slideshow from './slideshow'
import Menu from './menu'

class Application extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showingOverlay: true
    }
  }

  render () {
    if (this.props.message) {
      return this.renderMessage(this.props.message)
    } else {
      return this.renderSlideshow(this.props.images, this.props.timePerSlide)
    }
  }

  renderMessage (message) {
    return (
      <div className='loading-indicator'>{message}</div>
    )
  }

  renderSlideshow (images, timePerSlide) {
    const overlay = this.state.showingOverlay && this.renderOverlay()
    return (
      <div className='full-screen' onClick={this.handleOpenMenu}>
        <Slideshow images={images} timePerSlide={timePerSlide} />
        <Transition
          component={false}
          enter={{
            opacity: 1
          }}
          leave={{
            opacity: 0
          }}
          runOnMount={false}
        >
          {overlay}
        </Transition>
      </div>
    )
  }

  renderOverlay () {
    return (
      <Menu key="menu" onClose={this.handleCloseMenu} />
    )
  }

  @autobind
  handleOpenMenu () {
    this.setState({showingOverlay: true})
  }

  @autobind
  handleCloseMenu () {
    this.setState({showingOverlay: false})
  }
}

export default connect(state => ({
  message: state.globalMessage,
  images: state.images,
  timePerSlide: state.timePerSlide
}))(Application)
