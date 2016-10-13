const { ipcMain } = require('electron')
const Response = require('../response')
const Router = require('./router')
const clients = require('./clients')

const { methodMiddleware } = require('./middleware/method')
const { pathMiddleware } = require('./middleware/path')
const queryMiddleware = require('./middleware/query')

function createServer()
{
    const router = new Router()

    const createMethodHandler = method =>
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

    const all = createMethodHandler('all')
    const get = createMethodHandler('get')
    const post = createMethodHandler('post')
    const put = createMethodHandler('put')
    const _delete = createMethodHandler('delete')
    const use = (...callbacks) =>
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

    ipcMain.on('ipc-promise', (event, request) =>
    {
        let response = new Response()
        response.ipc = { channel: 'ipc-promise', sender: event.sender }
        response.id = request.id
        router.handle(request, response)
    })

    const broadcast = (url, body) =>
    {
        clients.send(url, body)
    }

    return {
        all,
        get,
        post,
        put,
        use,
        delete: _delete,
        broadcast,
    }
}

module.exports = {
    createServer,
}
