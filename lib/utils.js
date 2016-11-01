'use strict'

const pathToRegexp = require('path-to-regexp')

const utils = module.exports = {}

utils.pathMatch = function pathMatch(path, options)
{
    options = options || {}

    return (url, params) =>
    {
        let keys = []
        params = params || {}

        let regexp = pathToRegexp(path, keys, options)

        let result = regexp.exec(url)

        if(result === null) return false

        let match = result.shift()

        keys.forEach((key, i) =>
        {
            params[key.name] = result[i]
        })

        return { match, params }
    }
}

utils.exposePromise = function exposePromise()
{
    let __resolver,
        __rejector,
        __promise = new Promise((resolve, reject) =>
        {
            __resolver = resolve
            __rejector = reject
        })

    __promise.resolve = __resolver
    __promise.reject = __rejector

    return __promise
}
