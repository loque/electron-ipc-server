'use strict'

const Client = require('../../client')

function Transport(ctx)
{
    this.receivers = {}
    this.ctx = ctx

    this.ctx.onmessage = event =>
    {
        let payload = event.data

        if (!Array.isArray(payload))
        {
            console.error(`payload from server is not an array`, payload)
            return
        }

        let channel = payload.shift()
        let response = payload[0]

        if (this.receivers.hasOwnProperty(channel))
        {
            this.receivers[channel].callback(event, response)
        }
    }

    return this
}

Transport.prototype.on = function on(channel, callback)
{
    this.receivers[channel] = { channel, callback }
}

Transport.prototype.emit = function emit(channel, request)
{
    request = JSON.parse(JSON.stringify(request))
    this.ctx.postMessage([channel, request])
}

function createClient(worker)
{
    return new Client(new Transport(worker))
}

module.exports = { createClient }
