const client = require('../../lib/adapters/electron/client').createClient()

client.get('/users')
.then(response =>
{
    console.log(`get response`, response.body)
})
.catch(error =>
{
    console.error(`error`, error)
})

client.post('/users', { name: 'Messi' })
.then(response =>
{
    console.log(`post response`, response.body)
})
.catch(error =>
{
    console.error(`error`, error)
})
//
client.put('/users/0', { name: 'Messi' })
.then(response =>
{
    console.log(`put response`, response.body)
})
.catch(error =>
{
    console.error(`error`, error)
})

client.delete('/users/0')
.then(response =>
{
    console.log(`delete response`, response.body)
})
.catch(error =>
{
    console.error(`error`, error)
})

client.on('update-stuff', response =>
{
    console.log(`update-stuff`, response.body)
})
