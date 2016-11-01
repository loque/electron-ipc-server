'use strict'

const expect = require('chai').expect

const Client = require('../lib/client')
const methods = require('../lib/constants/methods')

describe('Client', function()
{
    it('should throw if no transport was sent', function()
    {
        expect(function(){ let client = new Client() }).to.throw(`Client.constructor expects to receive a transport`)
    })

    describe('Transport', function()
    {
        it('should throw if .on() is not set', function()
        {
            expect(function()
            {
                new Client({ emit: function(){} })
            })
            .to.throw(`Client.constructor expects transport to implement the method .on() and .emit()`)
        })

        it('should throw if .emit() is not set', function()
        {
            expect(function()
            {
                new Client({ on: function(){} })
            })
            .to.throw(`Client.constructor expects transport to implement the method .on() and .emit()`)
        })

        it('should throw if neither .on() or .emit() are set', function()
        {
            expect(function()
            {
                new Client({})
            })
            .to.throw(`Client.constructor expects transport to implement the method .on() and .emit()`)
        })
    })

    it('should handle .VERB()', function()
    {
        let client = new Client({ on: function(){}, emit: function() {} })

        methods.forEach(method =>
        {
            expect(client[method]).to.be.a('function')
        })
    })

    it('should handle .on()', function()
    {
        let client = new Client({ on: function(){}, emit: function() {} })

        expect(client.on).to.be.a('function')
    })
})
