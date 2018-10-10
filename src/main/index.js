import { app, BrowserWindow } from 'electron'

let mainWindow // eslint-disable-line no-unused-vars
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 200
  })
}

app.on('ready', () => {
  createWindow()
})
