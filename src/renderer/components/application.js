import fs from 'fs'
import path from 'path'

import React from 'react'
import readChunk from 'read-chunk'
import imageType from 'image-type'

import Slideshow from './slideshow'

const VALID_MIME_TYPES = [
  'image/jpg', 'image/jpeg', 'image/png'
]

export default class Application extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      err: null,
      imagesLoading: true,
      imagePaths: []
    }

    const imagesDir = process.env.LUMOS_IMAGE_DIR
    if (!imagesDir) {
      this.state.err = 'LUMOS_IMAGE_DIR not set!'
      return
    }
    this.loadImages(imagesDir)
  }

  loadImages (sourceDir) {
    fs.readdir(sourceDir, async (err, files) => {
      if (err) {
        console.error(err)
        this.setState({err: err.message})
        return
      }

      const promises = files.map((file) => {
        return this.getImageInfo(path.join(sourceDir, file))
      })
      const info = await Promise.all(promises)
      const images = info.reduce((images, {isImage, imagePath}) => {
        if (isImage) {
          images.push(imagePath)
        }
        return images
      }, [])
      this.setState({
        imagesLoading: false,
        imagePaths: images
      })
    })
  }

  getImageInfo (imagePath) {
    return readChunk(imagePath, 0, 12)
      .then(chunk => {
        const info = imageType(chunk)
        return {
          isImage: info && VALID_MIME_TYPES.includes(info.mime),
          imagePath: imagePath
        }
      })
      .catch(err => {
        console.error(`Error detecting image type for ${imagePath}:`)
        console.error(err)
        return {
          isImage: false,
          imagePath: imagePath
        }
      })
  }

  render () {
    if (this.state.err) {
      return this.renderMessage(this.state.err)
    } else if (this.state.imagesLoading) {
      return this.renderMessage('Loading...')
    } else {
      return this.renderSlideshow(this.state.imagePaths)
    }
  }

  renderMessage (message) {
    return (
      <div className='loading-indicator'>{message}</div>
    )
  }

  renderSlideshow (imagePaths) {
    return <Slideshow images={imagePaths} />
  }
}
