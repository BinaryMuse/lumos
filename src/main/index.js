import {app, BrowserWindow} from 'electron'

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
}

app.on('ready', createWindow)
