function Response()
{
    this.id
    this.statusCode
    this.ipc = { channel: '', sender: null }

    this.status = code =>
    {
        this.statusCode = code
        return this
    }

    this.send = body =>
    {
        let response = Object.assign({}, this, { body, status: this.statusCode })
        this.ipc.sender.send(this.ipc.channel, response)
    }

    return this
}

module.exports = Response
