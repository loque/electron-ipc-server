const pathToRegexp = require('path-to-regexp')
const methods = require('../constants/methods')

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

        this.regexp = pathToRegexp(this.path, this.keys, reOpts)

        let result = this.regexp.exec(path)

        if (result === null)
        {
            // console.log(`route.path ${this.path}, req.url ${path}`, false)
            return false
        }

        this.baseUrl = result[0]

        this.keys.forEach((key, i) =>
        {
            this.params[key.name] = result[i + 1]
        })

        // console.log(`route.path ${this.path}, req.url ${path}`, true)
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
            console.log(`next being called by`, req, res)
            if (err == 'route') return routerNext()

            if (fnIdx >= FNS.length) return routerNext()

            let fn = FNS[fnIdx]

            // if (fnIdx == FNS.length - 1)
            // {
            //     let fnMethods = Object.keys(fn)
            //     let fnIsRouter = methods.concat(['all', 'use', 'handle']).every(method => fnMethods.includes(method))
            //
            //     if (fnIsRouter)
            //     {
            //         routerNext()
            //     }
            // }

            fnIdx++

            res.next = next

            fn(req, res, next)
        }
    }

    return this
}

module.exports = Route
