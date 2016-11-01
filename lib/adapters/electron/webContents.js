'use strict'

const { app } = require('electron')
const Scheduler = require('./scheduler')

const broadcastScheduler = new Scheduler()
const WEBCONTENTS = []

function send(channel, response)
{
    broadcastScheduler.push(() =>
    {
        WEBCONTENTS.forEach(webcontent =>
        {
            webcontent.send(channel, response)
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
