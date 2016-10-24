const pathToRegexp = require('path-to-regexp')

function pathMiddleware(_path)
{
    let keys = []
    let regexp = pathToRegexp(_path, keys)

    return function path(req, res, next)
    {
        let result = regexp.exec(req.path)

        if (result === null) return next('route', `"${req.path}" does not match "${_path}" with method [${req.method}]`)

        // console.log(`[path checker]`, _path, req.path, req.method, result)

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
