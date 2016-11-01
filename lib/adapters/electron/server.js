'use strict'

const { ipcMain } = require('electron')
const Server = require('../../server')
const WebContents = require('./webContents')

function Transport(){}

Transport.prototype.on = function on(channel, callback)
{
    ipcMain.on(channel, (event, response) => callback(event, response))
}

Transport.prototype.broadcast = function broadcast(channel, response)
{
    WebContents.send(channel, response)
}

function createServer()
{
    const server = new Server(new Transport())

    return server
}

module.exports = { createServer }
