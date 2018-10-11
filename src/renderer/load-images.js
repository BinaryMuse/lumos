import fs from 'fs-extra'
import path from 'path'

import imageType from 'image-type'
import readChunk from 'read-chunk'

const VALID_IMAGE_TYPES = [ 'jpg', 'png', 'gif' ]

export default async function loadImages (dir) {
  let images = []

  const files = await fs.readdir(dir)
  for (let file of files) {
    try {
      const chunk = await readChunk(path.join(dir, file), 0, 12)
      const { ext } = imageType(chunk)
      if (VALID_IMAGE_TYPES.includes(ext)) {
        images.push(file)
      }
    } catch (err) {
      // not an image probably
    }
  }

  return images
}
