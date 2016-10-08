const { ipcRenderer } = require('electron')
const uuid = require('uuid')
const promise = require('../promise')
const Request = require('../request')

function createRequestBuilder(client, method)
{
    let request = new Request()
    request.method = method
    request.client = client

    return (url, body) =>
    {
        request.setURL(url)

        if (['post', 'put'].includes(request.method))
        {
            request.body = body
        }

        return request
    }
}

function createClient(name = '')
{
    const id = uuid.v4()
    const expectedResponses = {}

    ipcRenderer.send('ipc-connect', { id, name })

    const createMethodHandler = (client, method) =>
    {
        let requestBuilder = createRequestBuilder(client, method)

        return (url, body) =>
        {
            let _promise = promise.create()
            let request = requestBuilder(url, body)

            expectedResponses[request.id] = { request, promise: _promise }

            ipcRenderer.send('ipc-promise', request)

            return _promise
        }
    }

    const get = createMethodHandler({ id, name }, 'get')
    const post = createMethodHandler({ id, name }, 'post')
    const put = createMethodHandler({ id, name }, 'put')
    const _delete = createMethodHandler({ id, name }, 'delete')

    ipcRenderer.on('ipc-promise', (event, response) =>
    {
        let promiseHandler = response.status >= 200 && response.status < 300 ? 'resolve' : 'reject'
        expectedResponses[response.id].promise[promiseHandler](response)
        delete expectedResponses[response.id]
    })

    const on = (...args) => ipcRenderer.on(...args)

    return {
        get,
        post,
        put,
        delete: _delete,
        on,
    }
}

module.exports = {
    createClient,
}
