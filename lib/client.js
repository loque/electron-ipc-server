'use strict'

const uuid = require('uuid')
const channels = require('./constants/channels')
const methods = require('./constants/methods')
const Request = require('./request')
const utils = require('./utils')

// FIXME: should return an instantiated server, not the constructor
const Client = module.exports = function Client(transport)
{
    if (!(this instanceof Client)) return new Client(transport)

    if (transport === undefined) throw new TypeError(`Client.constructor expects to receive a transport`)

    if (
        transport.on === undefined || typeof transport.on != 'function'
        || transport.emit === undefined || typeof transport.emit != 'function'
    )
    {
        throw new TypeError(`Client.constructor expects transport to implement the method .on() and .emit()`)
    }

    this.id = uuid.v4()
    this.transport = transport
    this.restHandlers = {}
    this.eventHandlers = []

    this.transport.on(channels.REST, (event, response) =>
    {
        let promiseResult = response.status >= 200 && response.status < 300 ? 'resolve' : 'reject'
        this.restHandlers[response.id].promise[promiseResult](response)
        delete this.restHandlers[response.id]
    })

    this.transport.on(channels.EVENT, (event, response) =>
    {
        this.eventHandlers.forEach(handler =>
        {
            if (handler.url != response.url) return

            handler.callback(response)
        })
    })

    this.transport.emit(channels.CONNECT, { id: this.id })

    return this
}

methods.forEach(method =>
{
    Client.prototype[method] = function (url, body)
    {
        let _promise = utils.exposePromise()

        let request = new Request({ id: this.id })
        request.method = method
        request.url = request.originalUrl = url

        if (['post', 'put'].includes(request.method))
        {
            request.body = body
        }

        this.restHandlers[request.id] = { request, promise: _promise }

        this.transport.emit(channels.REST, request)

        return _promise
    }
})

Client.prototype.on = function on(url, callback)
{
    this.eventHandlers.push({ url, callback })
}
