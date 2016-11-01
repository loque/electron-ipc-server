'use strict'

const context = require('./context')
const Server = require('../../server')
const Router = require('../../router')

function Transport(ctx)
{
    this.receivers = {}
    this.ctx = ctx

    this.ctx.onmessage = event =>
    {
        let message = event.data

        if (!Array.isArray(message))
        {
            console.error(`message from client is not array`, message)
            return
        }

        let channel = message.shift()
        let request = message[0]

        if (this.receivers.hasOwnProperty(channel))
        {
            event.sender = this
            this.receivers[channel].callback(event, request)
        }
        else
        {
            // console.info(`channel "${channel}" has no receiver attached`)
        }
    }

    return this
}

Transport.prototype.on = function on(channel, callback)
{
    this.receivers[channel] = { channel, callback }
}

Transport.prototype.emit = function emit(channel, response)
{
    response = JSON.parse(JSON.stringify(response))
    this.ctx.postMessage([channel, response])
}

Transport.prototype.send = function send(channel, response)
{
    this.emit(channel, response)
}

function createServer()
{
    const transport = new Transport(context.get())
    const server = new Server(transport)

    return server
}

function createRouter(...args)
{
    return new Router(...args)
}

module.exports = { createServer, createRouter }
