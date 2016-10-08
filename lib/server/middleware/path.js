const parseurl = require('parseurl')
const pathToRegexp = require('path-to-regexp')

function pathMiddleware(path)
{
    let keys = []
    let regexp = pathToRegexp(path, keys)

    return (req, res, next) =>
    {
        req.path = parseurl(req).pathname
        let result = regexp.exec(req.path)

        if (result === null) return next('route')

        keys.forEach((key, i) =>
        {
            req.params[key.name] = result[i + 1]
        })

        next()
    }
}

module.exports = {
    pathMiddleware,
}
