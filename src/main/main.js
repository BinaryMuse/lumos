import fs from 'fs'
import os from 'os'
import path from 'path'
import { app, protocol, BrowserWindow } from 'electron'

import express from 'express'

import createDiscoveryService from './discovery-service'

const MAIN_WINDOW_CONTENT_URL = path.resolve(__dirname, '..', 'renderer', 'index.html')
const LUMOS_IMAGE_DIR = process.env.LUMOS_IMAGE_DIR || path.join(os.homedir(), '.lumos_images')
const WEB_PORT = 20106

if (!fs.existsSync(LUMOS_IMAGE_DIR)) {
  console.error(
    `Lumos image directory ${LUMOS_IMAGE_DIR} does not exist on disk. ` +
    `Create it or specify a different directory with the LUMOS_IMAGE_DIR environment variable.`
  )
  app.exit(1)
}

console.log(`Started: ${process.pid}`)
process.on('SIGUSR1', () => {
  app.relaunch()
  app.exit()
})

createDiscoveryService()

const DEVICE_INFO = {
  name: 'Lumos Photo Frame',
  slideTime: 3000
}

const server = express()
server.get('/_info', (req, res) => {
  res.json(DEVICE_INFO)
})
server.listen(WEB_PORT)

let mainWindow // eslint-disable-line no-unused-vars
function createWindow () {
  mainWindow = new BrowserWindow({
    title: 'Lumos',
    width: 800,
    height: 480,
    show: false,
    useContentSize: true,
    webPreferences: {
      backgroundThrottling: false
    }
  })
  mainWindow.loadURL(`file://${MAIN_WINDOW_CONTENT_URL}?imagedir=${encodeURIComponent(LUMOS_IMAGE_DIR)}`)

  // The client app will not boot until it gets the `boot-app` event
  mainWindow.once('show', () => {
    mainWindow.webContents.send('boot-app')
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    if (process.env.LUMOS_FULLSCREEN) {
      mainWindow.setFullScreen(true)
    }
  })
}

// `lumos://image.jpg` will load `image.jpg` from LUMOS_IMAGE_DIR
function registerImageProtocol () {
  protocol.registerFileProtocol('lumos', (request, callback) => {
    const relPath = request.url.replace(/^lumos:\/\//, '')
    const imagePath = path.join(LUMOS_IMAGE_DIR, relPath)
    callback(imagePath)
  })
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', () => {
  registerImageProtocol()
  createWindow()
})
