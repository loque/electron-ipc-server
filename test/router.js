'use strict'

const expect = require('chai').expect

const Router = require('../lib/router')
const methods = require('../lib/constants/methods')

describe('Router', function()
{
    it('should handle .VERB()', function()
    {
        let router = new Router()

        methods.forEach(method =>
        {
            expect(router[method]).to.be.a('function')
        })
    })

    it('should handle Router interface methods', function()
    {
        let router = new Router()

        let interfaceMethods = ['use', 'handle', 'middleware']

        interfaceMethods.forEach(method =>
        {
            expect(router[method]).to.be.a('function')
        })
    })

    describe('.use', function()
    {
        it('should throw if no middlewares are sent', function()
        {
            let router = new Router()

            expect(function () { router.use() }).to.throw(`Router.use() requires middleware functions`)
        })

        it('should throw if middlewares are not functions', function()
        {
            let router = new Router()

            expect(function () { router.use('path', 'not a function') }).to.throw(`Router.use() requires middlewares to be of type "function"`)
        })
    })

    describe('.VERB', function()
    {
        it('should throw if a path was not sent', function()
        {
            let router = new Router()
            let method = 'get'

            expect(function () { router[method]() }).to.throw(`Router.${method}() requires a path as the first parameter`)
        })

        it('should throw if middlewares are not functions', function()
        {
            let router = new Router()
            let method = 'get'

            expect(function () { router[method]('path', 'not a function') }).to.throw(`Router.${method}() requires middlewares to be of type "function"`)
        })
    })
})
