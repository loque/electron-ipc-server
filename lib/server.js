const Response = require('./response')
const Router = require('./router')
const Route = require('./router/route')
const channels = require('./channels')

const { methodMiddleware } = require('./middleware/method')
const { pathMiddleware } = require('./middleware/path')

const createMethodHandler = (router, method) =>
{
    return (path, ...fns) =>
    {
        if (typeof path != 'string')
        {
            console.error(`called server.${method}() without a path as the first parameter`)
            return
        }

        let route = new Route(path)

        route.addFunctions([
            methodMiddleware(method),
            ...fns
        ])

        router.add(route)

        // TODO: make it chainable with -> return this
    }
}

const restMethods = ['all', 'get', 'post', 'put', 'delete']

function Server(transport, basePath = '/')
{
    const router = new Router(basePath)

    restMethods.forEach(method =>
    {
        this[method] = createMethodHandler(router, method)
    })

    this.use = (...fns) =>
    {
        // TODO: server#use() does **NOT** need to match the complete req.url, just the begining
        // For example, .use('/users') should match req.url='/users/this' and req.url='/users/that'

        // TODO: server#use() should **NOT** stop routing handling after last callback

        let route = []

        if (typeof fns[0] == 'string')
        {
            let path = fns.shift()
            route.push(pathMiddleware(path))
        }

        // TODO: if no fns, throw error!
        route = route.concat(fns)

        router.add(route)
    }

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
