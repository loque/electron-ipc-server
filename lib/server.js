'use strict'

const channels = require('./constants/channels')
const methods = require('./constants/methods')
const Response = require('./response')
const Router = require('./router')

const supportedOutputHandlers = ['send', 'broadcast']

// FIXME: should return an instantiated server, not the constructor
const Server = module.exports = function Server(transport)
{
    if (!(this instanceof Server)) return new Server(transport)

    if (transport === undefined) throw new TypeError(`Server.constructor expects to receive a transport`)

    this.router = new Router()
    this.transport = transport

    supportedOutputHandlers.forEach(outputHandler =>
    {
        createMethod.call(this, outputHandler)
    })

    this.transport.on(channels.REST, (event, request) =>
    {
        let response = new Response()
        response.ipc = { channel: channels.REST, sender: event.sender }
        response.id = request.id

        this.router.handle(request, response)
    })

    return this
}

methods.concat(['all', 'use']).forEach(method =>
{
    Server.prototype[method] = function (...args)
    {
        return this.router[method](...args)
    }
})

function createMethod(outputHandler)
{
    if (typeof this.transport[outputHandler] == 'function')
    {
        this[outputHandler] = function (url, body)
        {
            let response = new Response(true)
            response.ipc = { channel: channels.EVENT }
            response.url = url
            response.body = body

            this.transport[outputHandler](channels.EVENT, response)
        }
    }
}
