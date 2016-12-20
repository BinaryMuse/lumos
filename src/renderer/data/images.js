import fs from 'fs'
import path from 'path'

import readChunk from 'read-chunk'
import imageType from 'image-type'

const VALID_MIME_TYPES = [
  'image/jpg', 'image/jpeg', 'image/png'
]

function getImageInfo (imagePath) {
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

export function loadImages (sourceDir) {
  return new Promise(async (resolve, reject) => {
    fs.readdir(sourceDir, async (err, files) => {
      if (err) {
        return reject(err)
      }

      const promises = files.map((file) => {
        return getImageInfo(path.join(sourceDir, file))
      })
      const info = await Promise.all(promises)
      const images = info.reduce((acc, {isImage, imagePath}) => {
        if (isImage) { acc.push(imagePath) }
        return acc
      }, [])
      resolve(images)
    })
  })
}
