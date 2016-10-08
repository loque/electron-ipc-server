function create()
{
    let _resolver,
        _rejector,
        _promise = new Promise((resolve, reject) =>
        {
            _resolver = resolve
            _rejector = reject
        })

    _promise.resolve = _resolver
    _promise.reject = _rejector

    return _promise
}

function wrap(origin, target)
{
    return origin
    .then(data =>
    {
        target.resolve(data)
    })
    .catch(error =>
    {
        target.reject(error)
    })
}

module.exports = {
    create,
    wrap,
}
