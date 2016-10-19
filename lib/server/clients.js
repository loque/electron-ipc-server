const { app } = require('electron')
const Scheduler = require('../scheduler')

const broadcastScheduler = new Scheduler()
const CLIENTS = []

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

app.on('web-contents-created', (event, webContents) =>
{
    webContents.on('did-finish-load', () =>
    {
        CLIENTS.push(webContents)
        broadcastScheduler.start()
    })
})

module.exports = {
    send,
}
