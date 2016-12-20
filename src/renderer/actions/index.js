import {loadImages} from '../data/images'

export const TYPES = {
  SET_MESSAGE: 'SET_MESSAGE',
  IMAGES_LOADED: 'IMAGES_LOADED'
}

export function init (imageDir) {
  if (!imageDir) {
    return {
      type: TYPES.SET_MESSAGE,
      message: 'LUMOS_IMAGE_DIR env not set!'
    }
  }

  return async (dispatch) => {
    try {
      const images = await loadImages(imageDir)
      console.warn(images)
      return dispatch({
        type: TYPES.IMAGES_LOADED,
        images: images
      })
    } catch (err) {
      console.error(err)
      return dispatch({
        type: TYPES.SET_MESSAGE,
        message: err.message
      })
    }
  }
}
