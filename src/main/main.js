import path from 'path'
import { app, BrowserWindow } from 'electron'

const MAIN_WINDOW_CONTENT_URL = path.resolve(__dirname, '..', 'renderer', 'index.html')

let mainWindow // eslint-disable-line no-unused-vars
function createWindow () {
  mainWindow = new BrowserWindow({
    title: 'Lumos',
    width: 800,
    height: 480,
    show: true,
    useContentSize: true
  })
  mainWindow.loadURL(`file://${MAIN_WINDOW_CONTENT_URL}`)
}

app.on('ready', () => {
  createWindow()
})
