// const isPlainObject = require('lodash.isplainobject')

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

    // this.set = (field, value) =>
    // {
    //     if (
    //         typeof field == 'string'
    //         && (typeof value == 'string' || typeof value == 'number')
    //     )
    //     {
    //         this.headers[field] = value
    //         return this
    //     }
    //
    //     if (isPlainObject(field))
    //     {
    //         Object.keys(field).forEach(key =>
    //         {
    //             if (typeof field[key] == 'string' || typeof field[key] == 'number')
    //             {
    //                 this.headers[key] = field[key]
    //             }
    //         })
    //     }
    //
    //     return this
    // }
    //
    // this.get = field => this.headers[field]

    this.send = body =>
    {
        let response = Object.assign({}, this, { body, status: this.statusCode })
        this.ipc.sender.send(this.ipc.channel, response)
    }

    return this
}

module.exports = Response
