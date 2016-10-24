const { app } = require('electron')
const Scheduler = require('../../scheduler')
const Response = require('../../response')
const channels = require('../../channels')

const broadcastScheduler = new Scheduler()
const WEBCONTENTS = []

const send = (url, body) =>
{
    broadcastScheduler.push(() =>
    {
        WEBCONTENTS.forEach(webcontent =>
        {
            let response = new Response(true)
            response.ipc = { channel: channels.EVENT }
            response.url = url
            response.body = body

            webcontent.send(channels.EVENT, response)
        })

        return Promise.resolve()
    })
}

app.on('web-contents-created', (event, webContents) =>
{
    webContents.on('did-finish-load', () =>
    {
        WEBCONTENTS.push(webContents)
        broadcastScheduler.start()
    })
})

module.exports = {
    send,
}
