import fs from 'fs-extra'
import path from 'path'

import imageType from 'image-type'
import React from 'react'
import readChunk from 'read-chunk'

const VALID_IMAGE_TYPES = [ 'jpg', 'png', 'gif' ]

export default class ImageLoader extends React.Component {
  constructor () {
    super()
    this.state = {
      images: []
    }
  }

  async componentDidMount () {
    let images = []

    const files = await fs.readdir(this.props.directory)
    for (let file of files) {
      try {
        const chunk = await readChunk(path.join(this.props.directory, file), 0, 12)
        const { ext } = imageType(chunk)
        if (VALID_IMAGE_TYPES.includes(ext)) {
          images.push(file)
        }
      } catch (err) {
        // not an image probably
      }
    }

    this.props.onLoad(images)
  }

  render () {
    return null
  }
}
