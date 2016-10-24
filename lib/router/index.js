function Router(basePath)
{
    const ROUTES = []

    let routeIdx

    this.add = route =>
    {
        ROUTES.push(route)
    }

    this.handle = (req, res) =>
    {
        routeIdx = 0 // reset index
        next()

        function next(err, reason)
        {
            // if (err == 'route')
            // {
            //     console.log(`[route] ${routeIdx}`, reason, req)
            // }

            // no matching route found
            if (routeIdx >= ROUTES.length) return

            let route = ROUTES[routeIdx]

            routeIdx++

            route.handle(req, res, next)
        }
    }

    return this
}

module.exports = Router
