const { ipcMain, webContents } = require('electron')
const Scheduler = require('../scheduler')

const broadcastScheduler = new Scheduler()
const CLIENTS = []

const add = webContents =>
{
    CLIENTS.push(webContents)
    broadcastScheduler.start()
}

const send = (url, body) =>
{
    broadcastScheduler.push(() =>
    {
        CLIENTS.forEach(client =>
        {
            client.send(url, body) // FIXME: we should be sending a custom 'ipc-broadcast' message
        })

        return Promise.resolve()
    })
}

const setApp = app =>
{
    app.on('web-contents-created', (event, webContents) =>
    {
        webContents.on('did-finish-load', () =>
        {
            add(webContents)
        })
    })
}

module.exports = {
    add,
    send,
    setApp,
}
