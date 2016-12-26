import {app, BrowserWindow, globalShortcut, protocol} from 'electron'

let mainWindow
function createWindow () {
  if (mainWindow) return

  let options = {
    width: 800,
    heigth: 480,
    title: '',
    // titleBarStyle: 'hidden',
    // movable: true,
    // resizable: false,
    show: true,
    useContentSize: true
  }
  if (process.env.NODE_ENV === 'production') {
    options.kiosk = true
  }
  mainWindow = new BrowserWindow(options)
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.webContents.openDevTools()

  globalShortcut.register("CommandOrControl+Shift+Q", () => {
    app.quit()
  })
}

app.on('ready', () => {
  protocol.registerFileProtocol('lumos', (request, callback) => {
    const path = request.url.replace(/^lumos:\/\//, '')
    callback(path)
  })

  createWindow()
})
