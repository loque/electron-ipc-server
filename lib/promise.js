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

module.exports = {
    create,
}
