const client = require('../../lib/adapters/electron/client').createClient()

client.get('/test/this/shit')
.then(response =>
{
    console.log(`response`, response)
})
.catch(error =>
{
    console.error(`error`, error)
})

client.on('update-stuff', (event, data) =>
{
    console.log(`update-stuff`, data)
})
