'use strict'

const uuid = require('uuid')
const urlparse = require('url-parse')

const Request = module.exports = function Request(client)
{
    this.id = uuid.v4()
    this.client = client || {}

    this.method = null
    this.originalUrl
    this.url = ''

    this.body = {}
    this.params = {}

    return this
}

Object.defineProperty(Request, 'path', {
    configurable: true,
    enumerable: true,
    get: function path()
    {
        try
        {
            return urlparse(this.url).pathname
        }
        catch (err)
        {
            return undefined
        }
    }
})

Object.defineProperty(Request, 'query', {
    configurable: true,
    enumerable: true,
    get: function qs()
    {
        try
        {
            return urlparse(this.url, true).query
        }
        catch (err)
        {
            return {}
        }
    }
})
