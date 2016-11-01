'use strict'

const utils = require('../utils')
const methods = require('../constants/methods')

const Route = module.exports = function Route(method, path, regexpOptions = {})
{
    this.method = method
    this.path = path
    this.params = {}
    this.baseUrl
    this.pathMatcher = utils.pathMatch(path, regexpOptions)

    this.handlers = []
    this.handlerIdx

    return this
}

Route.prototype.addHandlers = function addHandlers(handlers)
{
    this.handlers = this.handlers.concat(handlers)
}

Route.prototype.match = function match(method, path)
{
    // only accept requests that match the route's method
    // or any request when this.method is set to all
    if (this.method != method && this.method != 'all') return false

    let result = this.pathMatcher(path)

    if (result === false) return false

    this.baseUrl = result.match
    this.params = result.params

    return true
}

Route.prototype.handle = function handle(req, res, routerNext)
{
    // TODO: if route has been created with #use() then, remove this.basePath from req.url

    req.params = this.params
    req.baseUrl = this.baseUrl

    req.originalUrl = req.originalUrl || req.url

    if (this.useHandler)
    {
        req.url = req.url.slice(req.baseUrl.length)
    }

    this.handlerIdx = 0

    let self = this
    next()

    function next(err)
    {
        // console.log(`next being called by`, req, res)
        if (err == 'route') return routerNext()

        if (self.handlerIdx >= self.handlers.length) return routerNext()

        let fn = self.handlers[self.handlerIdx]

        // if (self.handlerIdx == self.handlers.length - 1)
        // {
        //     let fnMethods = Object.keys(fn)
        //     let fnIsRouter = methods.concat(['all', 'use', 'handle']).every(method => fnMethods.includes(method))
        //
        //     if (fnIsRouter)
        //     {
        //         routerNext()
        //     }
        // }

        self.handlerIdx++

        res.next = next

        fn(req, res, next)
    }
}
