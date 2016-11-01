'use strict'

const { ipcRenderer } = require('electron')
const Client = require('../../client')

function on(channel, callback)
{
    ipcRenderer.on(channel, callback)
}

function emit(channel, request)
{
    ipcRenderer.send(channel, request)
}

function createClient()
{
    return new Client({ on, emit })
}

module.exports = { createClient }
