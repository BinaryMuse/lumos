import {app, BrowserWindow, protocol} from 'electron'

let mainWindow
function createWindow () {
  if (mainWindow) return

  mainWindow = new BrowserWindow({
    width: 800,
    heigth: 480,
    title: '',
    // titleBarStyle: 'hidden',
    // movable: true,
    // resizable: false,
    show: true,
    useContentSize: true
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.webContents.openDevTools()
}

app.on('ready', () => {
  protocol.registerFileProtocol('lumos', (request, callback) => {
    const path = request.url.replace(/^lumos:\/\//, '')
    callback(path)
  })

  createWindow()
})
