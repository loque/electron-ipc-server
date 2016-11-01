'use strict'

const methods = require('../constants/methods')
const Route = require('./route')

const Router = module.exports = function Router()
{
    if (!(this instanceof Router)) return new Router()

    this.routes = []
    this.routeIdx

    return this
}

methods.concat('all').forEach(method =>
{
    Router.prototype[method] = function (path, ...handlers)
    {
        if (typeof path != 'string') throw new TypeError(`Router.${method}() requires a path as the first parameter`)

        if (handlers.length)
        {
            if (!handlers.every(handler => typeof handler == 'function')) throw new TypeError(`Router.${method}() requires middlewares to be of type "function"`)
        }

        let route = new Route(method, path)
        route.addHandlers(handlers)
        this.routes.push(route)

        return this
    }
})

Router.prototype.use = function use(...handlers)
{
    let path = typeof handlers[0] == 'string' ? handlers.shift() : '/'
    let route = new Route('all', path, { end: false })
    route.useHandler = true

    if (!handlers.length) throw new TypeError(`Router.use() requires middleware functions`)

    if (!handlers.every(handler => typeof handler == 'function')) throw new TypeError(`Router.use() requires middlewares to be of type "function"`)

    route.addHandlers(handlers)
    this.routes.push(route)
}

Router.prototype.handle = function handle(req, res, parentNext)
{
    let self = this
    self.routeIdx = 0 // reset index
    next()

    function next()
    {
        // no matching route found
        if (self.routeIdx >= self.routes.length) return

        let route = self.routes[self.routeIdx]
        let match = route.match(req.method, req.url)

        self.routeIdx++

        if (!match) return next()

        route.handle(req, res, next)
    }
}

// implement the middleware interface
Router.prototype.middleware = function middleware()
{
    let self = this

    return function routerAsMiddleware(req, res, next)
    {
        return self.handle(req, res, next)
    }
}
