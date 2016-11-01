const Client = require('../../../lib/adapters/webworker/client')
const worker = new Worker('server.js')

const client = Client.createClient(worker)

const log = (...args) =>
{
    console.log(...args)
}

client.get('/books/8')
.then(response =>
{
    log(`[get]/books/8`, response.body)
})
.catch(error =>
{
    console.error(`error`, error)
})

client.get('/books/pages/108')
.then(response =>
{
    log(`[get]/books/pages/108`, response.body)
})
.catch(error =>
{
    console.error(`error`, error)
})

client.get('/users')
.then(response =>
{
    log(`[get]`, response.body)
})
.catch(error =>
{
    console.error(`error`, error)
})

client.post('/users', { name: 'Messi' })
.then(response =>
{
    log(`[post]`, response.body)
})
.catch(error =>
{
    console.error(`error`, error)
})

client.put('/users/0', { name: 'Messi' })
.then(response =>
{
    log(`[put]`, response.body)
})
.catch(error =>
{
    console.error(`error`, error)
})

client.delete('/users/0')
.then(response =>
{
    log(`[delete]`, response.body)
})
.catch(error =>
{
    console.error(`error`, error)
})

// client.on('update-stuff', response =>
// {
//     log(`[event] update-stuff:`, response.body)
// })

client.on('pages', response =>
{
    log(`[event] pages:`, response.body)
})
