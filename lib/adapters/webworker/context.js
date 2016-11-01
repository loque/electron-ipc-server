'use strict'

let ctx
let is = ''

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
{
    ctx = self
    is = 'worker'
}
else
{
    ctx = window
    is = 'window'
}

module.exports = {
    get: () => ctx,
    is: search => search == is,
}
