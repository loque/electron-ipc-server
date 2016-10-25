const uuid = require('uuid')
const methods = require('../constants/methods')
const methodMiddleware = require('../middleware/method')
const Route = require('./route')

module.exports = function Router()
{
    const id = uuid.v4()
    const ROUTES = []
    let routeIdx

    // router implementing the middleware interface
    const router = (req, res, next) =>
    {
        router.handle(req, res, next)
    }

    methods.concat('all').forEach(method =>
    {
        router[method] = (path, ...fns) =>
        {
            if (typeof path != 'string')
            {
                console.error(`called server.${method}() without a path as the first parameter`)
                return
            }

            let route = new Route(path)

            route.addFunctions([
                methodMiddleware(method),
                ...fns
            ])

            ROUTES.push(route)

            // TODO: make it chainable
            // return router
        }
    })

    router.use = (...fns) =>
    {
        // TODO: server#use() should **NOT** stop routing handling after last callback

        let path = typeof fns[0] == 'string' ? fns.shift() : '/'
        let route = new Route(path, { end: false })
        route.useHandler = true

        // TODO: if no fns, throw error!
        route.addFunctions(fns)

        ROUTES.push(route)
    }

    router.handle = (req, res, parentNext) =>
    {
        // console.log(`ROUTES`, ROUTES)
        routeIdx = 0 // reset index
        next()

        function next()
        {
            console.group(`routeIdx ${routeIdx} on router with length:${ROUTES.length}`)
            // console.log(`req`, req)

            // no matching route found
            if (routeIdx >= ROUTES.length) return console.groupEnd()

            let route = ROUTES[routeIdx]
            let match = route.match(req.url)
            // console.log(`match`, match)
            console.groupEnd()

            routeIdx++

            if (!match) return next()

            route.handle(req, res, next)
        }
    }

    return router
}
