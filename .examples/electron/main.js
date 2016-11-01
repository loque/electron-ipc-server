const { app, BrowserWindow } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let win2

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // win2 = new BrowserWindow({width: 800, height: 600})
  // win2.loadURL(`file://${__dirname}/index2.html`)
  // win2.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const server = require('../../lib/adapters/electron/server').createServer()

server.get('/users', (req, res) =>
{
    res.status(200).send([])
})

// server.all('/users*', (req, res) =>
// {
//     res.status(200).send(`catching all`)
// })

// server.use('/users', (req, res) =>
// {
//     res.status(200).send(`request highjacked with use: ${req.method}`)
// })

server.post('/users', (req, res) =>
{
    res.status(200).send(`user ${req.body.name} created`)
})

server.put('/users/:id', (req, res) =>
{
    res.status(200).send(`user ${req.body.name}, with id ${req.params.id}, updated`)
})

server.delete('/users/:id', (req, res) =>
{
    res.status(200).send(`user deleted with id ${req.params.id}`)
})

server.broadcast('update-stuff', ['new stuff'])
server.broadcast('update-stuff', ['new stuff', 'new stuff'])

setTimeout(server => server.broadcast('update-stuff', ['new stuff', 'new stuff', 'new stuff']), 1000, server)
setTimeout(server => server.broadcast('update-stuff', ['new stuff', 'new stuff', 'new stuff', 'new stuff']), 2000, server)
