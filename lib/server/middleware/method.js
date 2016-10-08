function methodMiddleware(acceptedMethod)
{
    return (req, res, next) =>
    {
        if (req.method == acceptedMethod || acceptedMethod == 'all') return next()
        next('route')
    }
}

module.exports = {
    methodMiddleware,
}
