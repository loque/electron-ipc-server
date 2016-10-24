const uuid = require('uuid')
const channels = require('./channels')
const promise = require('./promise')
const Request = require('./request')

const restMethods = ['get', 'post', 'put', 'delete']

function Client(transport)
{
    const restHandlers = {}
    const eventHandlers = []
    const self = this

    this.id = uuid.v4()

    restMethods.forEach(method =>
    {
        this[method] = (url, body) =>
        {
            let _promise = promise.create()

            let request = new Request({ id: self.id })
            request.method = method
            request.url = request.originalUrl = url

            if (['post', 'put'].includes(request.method))
            {
                request.body = body
            }

            restHandlers[request.id] = { request, promise: _promise }

            transport.send(channels.REST, request)

            return _promise
        }
    })

    transport.receive(channels.REST, (event, response) =>
    {
        let promiseResult = response.status >= 200 && response.status < 300 ? 'resolve' : 'reject'
        restHandlers[response.id].promise[promiseResult](response)
        delete restHandlers[response.id]
    })

    transport.receive(channels.EVENT, (event, response) =>
    {
        eventHandlers.forEach(handler =>
        {
            if (handler.url != response.url) return

            handler.callback(response)
        })
    })

    this.on = (url, callback) =>
    {
        eventHandlers.push({ url, callback })
    }

    transport.send(channels.CONNECT, { id: this.id })

    return this
}

module.exports = Client
