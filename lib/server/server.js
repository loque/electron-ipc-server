const { ipcMain } = require('electron')
const Response = require('../response')
const Router = require('./router')
const clients = require('./clients')

const { methodMiddleware } = require('./middleware/method')
const { pathMiddleware } = require('./middleware/path')
const queryMiddleware = require('./middleware/query')

const createMethodHandler = (router, method) =>
{
    return (path, ...callbacks) =>
    {
        if (typeof path != 'string')
        {
            console.error(`called server.${method}() without a path as the first parameter`)
            return
        }

        router.add([
            methodMiddleware(method),
            pathMiddleware(path),
            queryMiddleware,
            ...callbacks
        ])
    }
}

function createServer()
{
    const router = new Router()
    const server = {}

    ['all', 'get', 'post', 'put', 'delete'].forEach(method =>
    {
        server[method] = createMethodHandler(router, method)
    })

    server.use = (...callbacks) =>
    {
        let layer = []

        if (typeof callbacks[0] == 'string')
        {
            let path = callbacks[0]
            layer.push(pathMiddleware(path))
            callbacks = callbacks.slice(1)
        }

        layer = layer.concat([
            queryMiddleware,
            ...callbacks
        ])

        router.add(layer)
    }

    server.broadcast = (url, body) =>
    {
        clients.send(url, body)
    }

    ipcMain.on('ipc-promise', (event, request) =>
    {
        let response = new Response()
        response.ipc = { channel: 'ipc-promise', sender: event.sender }
        response.id = request.id
        router.handle(request, response)
    })

    return server
}

module.exports = {
    createServer,
}
