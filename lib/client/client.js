const { ipcRenderer } = require('electron')
const uuid = require('uuid')
const promise = require('../promise')
const Request = require('../request')

const createRequestBuilder = (client, method) =>
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

const createMethodHandler = (client, method, expectedResponses) =>
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

function createClient(name = '')
{
    const id = uuid.v4()
    const expectedResponses = {}
    const client = {}

    ['get', 'post', 'put', 'delete'].forEach(method =>
    {
        client[method] = createMethodHandler({ id, name }, method, expectedResponses)
    })

    client.on = (...args) => ipcRenderer.on(...args)

    ipcRenderer.send('ipc-connect', { id, name })

    ipcRenderer.on('ipc-promise', (event, response) =>
    {
        let promiseResult = response.status >= 200 && response.status < 300 ? 'resolve' : 'reject'
        expectedResponses[response.id].promise[promiseResult](response)
        delete expectedResponses[response.id]
    })

    return client
}

module.exports = {
    createClient,
}
