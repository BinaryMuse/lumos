import { takeEvery } from 'redux-saga'
import { put, call } from 'redux-saga/effects'

import { TYPES } from '../actions'
import {loadImages} from '../data/images'

function* initialLoad () {
  const imageDir = process.env.LUMOS_IMAGE_DIR
  if (!imageDir) {
    yield put({
      type: TYPES.SET_MESSAGE,
      message: 'LUMOS_IMAGE_DIR env not set!'
    })
    return
  }

  try {
    const images = yield call(loadImages, imageDir)
    yield put({
      type: TYPES.IMAGES_LOADED,
      images: images
    })
  } catch (err) {
    console.error(err)
    yield put({
      type: TYPES.SET_MESSAGE,
      message: err.message
    })
  }
}

export default function* imagesSaga () {
  yield initialLoad()
}
