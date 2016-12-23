import { TYPES } from '../actions'

const initialState = {
  globalMessage: "Loading...",
  images: [],
  timePerSlide: 3000,
  wifi: {
    connected: false,
    connecting: false,
    ssid: null,
    scanning: false,
    availableSsids: []
  }
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
  case TYPES.WIFI_SSID:
    return {
      ...state,
      wifi: {
        ...state.wifi,
        connected: true,
        ssid: action.ssid
      }
    }
  case TYPES.WIFI_DISCONNECTED:
    return {
      ...state,
      wifi: {
        ...state.wifi,
        connected: false,
        ssid: null
      }
    }
  case TYPES.WIFI_SCAN_IN_PROGRESS:
    return {
      ...state,
      wifi: {
        ...state.wifi,
        scanning: true,
        availableSsids: []
      }
    }
  case TYPES.WIFI_SCAN_FAIL:
    return {
      ...state,
      wifi: {
        ...state.wifi,
        scanning: false,
        availableSsids: []
      }
    }
  case TYPES.WIFI_SCAN_SUCCESS:
    return {
      ...state,
      wifi: {
        ...state.wifi,
        scanning: false,
        availableSsids: action.ssids
      }
    }
  case TYPES.WIFI_CONNECT_IN_PROGRESS:
    return {
      ...state,
      wifi: {
        ...state.wifi,
        connecting: true,
        ssid: null
      }
    }
  case TYPES.WIFI_CONNECT_FAIL:
    return {
      ...state,
      wifi: {
        ...state.wifi,
        connecting: false,
        ssid: null
      }
    }
  default:
    return state
  }
}
