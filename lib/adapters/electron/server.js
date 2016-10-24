const { ipcMain } = require('electron')
const Server = require('../../server')
const WebContents = require('./webContents')

const receive = (channel, callback) =>
{
    ipcMain.on(channel, (event, response) => callback(event, response))
}

const createServer = () =>
{
    const server = new Server({ receive })

    server.broadcast = (url, body) =>
    {
        WebContents.send(url, body)
    }

    return server
}

module.exports = { createServer }
