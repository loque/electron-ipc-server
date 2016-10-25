const pathToRegexp = require('path-to-regexp')

function Route(path, reOpts = {})
{
    this.path = path || '/'
    this.keys = []
    this.params = {}
    this.regexp = ''
    this.baseUrl

    let FNS = []
    let fnIdx

    this.addFunctions = fns =>
    {
        FNS = FNS.concat(fns)
    }

    this.match = function match(path)
    {
        // console.log(`route.path ${this.path}, match.path ${path}`)
        this.regexp = pathToRegexp(this.path, this.keys, reOpts)

        let result = this.regexp.exec(path)

        if (result === null) return false

        this.baseUrl = result[0]

        this.keys.forEach((key, i) =>
        {
            this.params[key.name] = result[i + 1]
        })

        return true
    }

    this.handle = function handle(req, res, routerNext)
    {
        // TODO: if route has been created with #use() then, remove this.basePath from req.url

        req.keys = this.keys
        req.params = this.params
        req.baseUrl = this.baseUrl

        req.originalUrl = req.originalUrl || req.url

        if (this.useHandler)
        {
            req.url = req.url.slice(req.baseUrl.length)
        }

        fnIdx = 0
        next()

        function next(err)
        {
            // console.info(`>>>>>>>>>>>> reached the end`)
            if (err == 'route') return routerNext(err)

            if (fnIdx >= FNS.length) return

            let fn = FNS[fnIdx]

            fnIdx++

            fn(req, res, next)
        }
    }

    return this
}

module.exports = Route
