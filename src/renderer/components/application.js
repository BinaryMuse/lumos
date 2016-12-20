import React from 'react'
import { connect } from 'react-redux'

import Slideshow from './slideshow'

class Application extends React.Component {
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
    return <Slideshow images={images} timePerSlide={timePerSlide} />
  }
}

export default connect(state => ({
  message: state.globalMessage,
  images: state.images,
  timePerSlide: state.timePerSlide
}))(Application)
