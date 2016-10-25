const pathToRegexp = require('path-to-regexp')

var path = '/users'
var keys = []
var params = {}

var regexp = pathToRegexp(path, keys, {
    end: false
})

console.log(`regexp`, regexp)

var result = regexp.exec('/users/books')

console.log(`result`, result, keys)

keys.forEach((key, i) =>
{
    params[key.name] = result[i + 1]
})

console.log(keys)
console.log(params)
