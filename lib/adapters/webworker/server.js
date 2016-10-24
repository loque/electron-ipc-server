const context = require('./context')
const Server = require('../../server')
const Response = require('../../response')
const channels = require('../../channels')

const Transport = ctx =>
{
    this.receivers = {}

    this.send = (channel, response) =>
    {
        response = JSON.parse(JSON.stringify(response))

        ctx.postMessage([channel, response])
    }

    this.receive = (channel, callback) =>
    {
        this.receivers[channel] = { channel, callback }
    }

    ctx.onmessage = event =>
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
            event.sender = { send: this.send }
            this.receivers[channel].callback(event, request)
        }
        else
        {
            // console.info(`channel "${channel}" has no receiver attached`)
        }
    }

    return this
}

const createServer = () =>
{
    const transport = Transport(context.get())
    const server = new Server(transport)

    server.send = (url, body) =>
    {
        let response = new Response(true)
        response.ipc = { channel: channels.EVENT }
        response.url = url
        response.body = body

        transport.send(channels.EVENT, response)
    }

    return server
}

module.exports = { createServer }
