'use strict'

const uuid = require('uuid')

const Response = module.exports = function Response(autoGenerateId)
{
    this.id = autoGenerateId ? uuid.v4() : null
    this.statusCode
    this.ipc = { channel: '', sender: null }
    this.next

    return this
}

Response.prototype.status = function status(code)
{
    this.statusCode = code
    return this
}

Response.prototype.send = function send(body)
{
    this.body = body
    this.status = this.statusCode
    this.ipc.sender.send(this.ipc.channel, this)

    if (typeof this.next == 'function')
    {
        this.next()
    }
}
