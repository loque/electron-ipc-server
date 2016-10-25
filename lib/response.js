const uuid = require('uuid')

function Response(autoGenerateId)
{
    this.id = autoGenerateId ? uuid.v4() : null
    this.statusCode
    this.ipc = { channel: '', sender: null }

    this.status = code =>
    {
        this.statusCode = code
        return this
    }

    this.next

    this.send = body =>
    {
        this.body = body
        this.status = this.statusCode
        this.ipc.sender.send(this.ipc.channel, this)

        if (typeof this.next == 'function')
        {
            this.next()
        }
    }

    return this
}

module.exports = Response
