import cp from 'child_process'

import { takeEvery, takeLatest, delay } from 'redux-saga'
import { call, race, take, put } from 'redux-saga/effects'
import wifi from 'node-wifi'

let iface = process.env.LUMOS_WLAN_IFACE || 'wlan0'
wifi.init({ iface })

import { TYPES } from '../actions'

function getCurrentWifiSsid () {
  let command
  switch (process.platform) {
    case 'darwin':
      command = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID:/'"
      break
    case 'linux':
      command = 'iwgetid -r'
      break
    default:
      throw new Error(`Unsupported platform: ${process.platform}`)
  }

  return new Promise((resolve, reject) => {
    const child = cp.exec(command, {
      timeout: 3000
    }, (err, stdout) => {
      if (err) return reject(err)
      let output = stdout.trim()
      if (process.platform === 'darwin') {
        output = output.replace(/^SSID:\s?/, '')
      }
      if (output.length) {
        return resolve(output)
      } else {
        return reject(new Error('Not connected to wifi'))
      }
    })
  })
}

function getAvailableWifiSsids () {
  return new Promise((resolve, reject) => {
    wifi.scan((error, ssids) => {
      if (error) return reject(error)
      const deduped = ssids.map(({ssid}) => ssid)
        .reduce((acc, ssid) => {
          if (!acc.includes(ssid)) {
            acc.push(ssid)
          }
          return acc
        }, [])
      return resolve(deduped)
    })
  })
}

function connectWifi (ssid, password) {
  let ap = {
    ssid: ssid,
    password: password || ''
  }
  return new Promise((resolve, reject) => {
    wifi.connect(ap, (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

function* wifiCheckSaga () {
  while (true) {
    try {
      const ssid = yield call(getCurrentWifiSsid)
      yield put({
        type: TYPES.WIFI_SSID,
        ssid: ssid
      })
    } catch (err) {
      yield put({
        type: TYPES.WIFI_DISCONNECTED
      })
    }
    yield race({
      reset: take(TYPES.WIFI_INFO_RESET),
      timeout: call(delay, 10000)
    })
  }
}

function* wifiScan () {
  try {
    yield put({type: TYPES.WIFI_SCAN_IN_PROGRESS})
    const ssids = yield call(getAvailableWifiSsids)
    yield put({
      type: TYPES.WIFI_SCAN_SUCCESS,
      ssids: ssids
    })
  } catch (err) {
    yield put({type: TYPES.WIFI_SCAN_FAIL})
  }
}

function* wifiConnect ({ssid, password}) {
  try {
    yield put({type: TYPES.WIFI_CONNECT_IN_PROGRESS})
    yield call(connectWifi, ssid, password)
    yield put({type: TYPES.WIFI_INFO_RESET})
  } catch (err) {
    yield put({type: TYPES.WIFI_CONNECT_FAIL})
  }
}

export default function* wifiSaga () {
  yield [
    wifiCheckSaga(),
    takeEvery(TYPES.WIFI_SCAN_REQUEST, wifiScan),
    takeLatest(TYPES.WIFI_CONNECT_REQUEST, wifiConnect)
  ]
}
