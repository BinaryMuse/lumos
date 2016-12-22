import wifiSaga from './wifi'
import imagesSaga from './images'

export default function* rootSaga () {
  yield [
    wifiSaga(),
    imagesSaga()
  ]
}
