const Client = require('../../client')

const Transport = ctx =>
{
    this.receivers = {}

    this.send = (channel, request) =>
    {
        request = JSON.parse(JSON.stringify(request))
        ctx.postMessage([channel, request])
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
            console.error(`message from server is not array`, message)
            return
        }

        let channel = message.shift()
        let response = message[0]

        if (this.receivers.hasOwnProperty(channel))
        {
            this.receivers[channel].callback(event, response)
        }
    }

    return this
}

const createClient = worker =>
{
    return new Client(Transport(worker))
}

module.exports = { createClient }
