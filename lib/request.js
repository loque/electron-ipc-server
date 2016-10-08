const uuid = require('uuid')

function Request()
{
    this.id = uuid.v4()
    this.method
    this.originalUrl
    this.url
    this.body
    this.client = {}

    this.path
    this.query = {}

    // this.regexp = ''
    // this.keys = []
    this.params = {}

    this.setURL = url =>
    {
        this.url = this.originalUrl = url
    }

    return this
}

module.exports = Request
