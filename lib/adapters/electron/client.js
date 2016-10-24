const { ipcRenderer } = require('electron')
const Client = require('../../client')

const send = (channel, request) =>
{
    ipcRenderer.send(channel, request)
}

const receive = (channel, callback) =>
{
    ipcRenderer.on(channel, callback)
}

const createClient = () =>
{
    return new Client({ send, receive })
}

module.exports = { createClient }
