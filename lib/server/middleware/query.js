const parseurl = require('parseurl')
const qs = require('qs')

function query(req, res, next)
{
    if (!req.query)
    {
        let val = parseurl(req).query
        req.query = qs.parse(val)
    }

    next()
}

module.exports = query
