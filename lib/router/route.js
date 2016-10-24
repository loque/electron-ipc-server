const pathToRegexp = require('path-to-regexp')

function Route(path)
{
    this.path = path || '/'
    this.keys = []
    this.params = {}
    this.regexp = ''

    let FNS = []
    let fnIdx

    this.addFunctions = fns =>
    {
        FNS = FNS.concat(fns)
    }

    this.match = function match(_path)
    {
        this.regexp = pathToRegexp(this.path, this.keys)

        let result = regexp.exec(_path)

        if (result === null) return false

        this.keys.forEach((key, i) =>
        {
            this.params[key.name] = result[i + 1]
        })

        return true
    }

    this.handle = function handle(req, res, parentNext)
    {
        // TODO: attach keys, params, regexp to req
        fnIdx = 0
        next()

        function next(err, reason)
        {
            if (err == 'route') return parentNext(err, reason)

            if (fnIdx >= FNS.length) return

            let fn = FNS[fnIdx]

            fnIdx++

            fn(req, res, next)
        }
    }

    return this
}

module.exports = Route
