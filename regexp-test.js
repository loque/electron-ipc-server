const pathToRegexp = require('path-to-regexp')

var path = '/users/:id'

function pathMatch(path, options)
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

let pathMatcher = pathMatch(path)


let params = { name: 'shit' }
let result = pathMatcher('/users/8', params)
console.log(result.match, params)
