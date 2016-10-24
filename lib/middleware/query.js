// const urlparse = require('url-parse')
// const qs = require('qs')
// TODO: this middleware is obsolete mad the module qs should be uninstalled!

function query(req, res, next)
{
    // console.log(`[query checker]`, req)

    if (!Object.keys(req.query).length)
    {
        // let queryString = urlparse(req.url).query.slice(1)
        // req.query = qs.parse(req.qs)
    }

    next()
}

module.exports = query
