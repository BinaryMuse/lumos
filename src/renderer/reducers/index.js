import { TYPES } from '../actions'

const initialState = {
  globalMessage: "Loading...",
  images: [],
  timePerSlide: 3000,
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
  case TYPES.SET_MESSAGE:
    return {
      ...state,
      globalMessage: action.message
    }
  case TYPES.IMAGES_LOADED:
    return {
      ...state,
      globalMessage: null,
      images: action.images
    }
  default:
    return state
  }
}
