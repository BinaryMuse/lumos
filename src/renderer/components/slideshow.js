import React from 'react'
import {autobind} from 'core-decorators'

export default class Slideshow extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentImageIndex: 0
    }
  }

  getNextImageIndex () {
    let nextImageIndex = this.state.currentImageIndex + 1
    if (nextImageIndex >= this.props.images.length) {
      nextImageIndex = 0
    }

    return nextImageIndex
  }

  getImageAtIndex (index) {
    return this.props.images[index]
  }

  componentDidMount () {
    this.timeout = setTimeout(this.advance, this.props.timePerSlide)
  }

  @autobind
  advance () {
    this.setState({currentImageIndex: this.getNextImageIndex()})
    this.timeout = setTimeout(this.advance, this.props.timePerSlide)
  }

  componentDidUpdate () {
    const nextImage = this.getImageAtIndex(this.getNextImageIndex())
    if (nextImage) {
      const img = new Image()
      img.src = nextImage
    }
  }

  render () {
    const currentImageUrl = this.getImageAtIndex(this.state.currentImageIndex)
    const style = {
      backgroundImage: `url("file://${currentImageUrl}")`
    }
    return (
      <div className='image-slide' style={style} />
    )
  }

  componentWillUnmount () {
    this.timeout && clearTimeout(this.timeout)
  }
}

Slideshow.propTypes = {
  images: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  timePerSlide: React.PropTypes.number
}

Slideshow.defaultProps = {
  timePerSlide: 10000
}
