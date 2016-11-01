'use strict'

const expect = require('chai').expect

const Server = require('../lib/server')
const methods = require('../lib/constants/methods')

describe('Server', function()
{
    it('should throw if no transport was sent', function()
    {
        expect(function(){ let server = new Server() }).to.throw(`Server.constructor expects to receive a transport`)
    })

    it('should handle .VERB()', function()
    {
        let transport = { on: function(){} }
        let server = new Server(transport)

        methods.concat(['all']).forEach(method =>
        {
            expect(server[method]).to.be.a('function')
        })
    })

    it('should add a .send() method if transport has one', function()
    {
        let transport = { on: function(){}, send: function(){}, broadcast: function(){} }
        let server = new Server(transport)

        expect(server.send).to.be.a('function')
        expect(server.broadcast).to.be.a('function')
    })
})
