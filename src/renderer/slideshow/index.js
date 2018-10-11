import React from 'react'
import { Transition, config } from 'react-spring'

class ImageBucket {
  constructor (images) {
    this.originalImages = images
    this.images = images.slice()
  }

  pick () {
    const idx = Math.floor(Math.random() * this.images.length)
    const image = this.images[idx]
    this.images.splice(idx, 1)
    if (this.images.length === 0) {
      this.images = this.originalImages.slice()
    }
    return image
  }
}

function lumosImage (file) {
  return `lumos://${file}`
}

function preloadImage (imageSrc) {
  if (!imageSrc) {
    return Promise.resolve()
  }

  return new Promise(resolve => {
    const img = new Image() // eslint-disable-line no-undef
    img.onload = () => resolve()
    img.src = imageSrc
  })
}

export default class Slideshow extends React.Component {
  constructor (props) {
    super()
    this.bucket = new ImageBucket(props.images)
    const img1 = lumosImage(this.bucket.pick())
    const img2 = lumosImage(this.bucket.pick())
    this.state = {
      preloaded: false,
      images: [
        // Make first image blank to prevent flicker
        // when the slideshow first loads.
        '',
        img1,
        img2
      ]
    }
  }

  async componentDidMount () {
    await Promise.all(this.state.images.map(preloadImage))
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.setState({ preloaded: true })
    this.interval = setInterval(this.nextImage.bind(this), this.props.time)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
    delete this.interval
  }

  nextImage () {
    this.setState((state) => {
      const rest = state.images.slice(1)
      rest.push(lumosImage(this.bucket.pick()))
      return { images: rest }
    })
  }

  render () {
    if (!this.state.preloaded) {
      return <div />
    }

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
          config={config.molasses}
        >
          {images.slice(0, 2).map(item => props => (
            <div style={{ ...containerStyle, ...props, background: `url(${item})`, backgroundSize: 'cover', backgroundPosition: 'center center' }} />
          ))}
        </Transition>
        <img src={this.state.images[2]} style={{ position: 'absolute', left: -10000, top: -10000 }} />
      </div>
    )
  }
}
