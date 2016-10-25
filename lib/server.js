const channels = require('./constants/channels')
const methods = require('./constants/methods')
const Response = require('./response')
const Router = require('./router')

function Server(transport)
{
    const router = new Router('/')

    methods.concat(['all', 'use']).forEach(method =>
    {
        this[method] = (...args) => router[method](...args)
    })

    transport.receive(channels.REST, (event, request) =>
    {
        let response = new Response()
        response.ipc = { channel: channels.REST, sender: event.sender }
        response.id = request.id
        router.handle(request, response)
    })

    return this
}

module.exports = Server
