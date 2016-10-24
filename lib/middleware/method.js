function methodMiddleware(acceptedMethod)
{
    return function method(req, res, next)
    {
        // console.log(`[method checker]`, req, acceptedMethod)

        if (acceptedMethod == 'all' || acceptedMethod == req.method)
        {
            // console.log(`[method checker]`, `[${acceptedMethod}] is [all] or [${req.method}]. ${req.url}`)
            return next()
        }

        next('route', `[${acceptedMethod}] is not [all] nor [${req.method}]. ${req.url}`)
    }
}

module.exports = {
    methodMiddleware,
}
