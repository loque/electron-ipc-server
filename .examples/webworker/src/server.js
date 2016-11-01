const server = require('../../../lib/adapters/webworker/server').createServer()
const books = require('./books')

function setOnline(req, res, next)
{
    req.online = true
    next()
}

server.use(setOnline)

server.use('/books', books.middleware())

const log = (...args) =>
{
    // console.log(...args)
}

server.get('/users', (req, res) =>
{
    log(`get:/users`)
    res.status(200).send([])
})

// server.all('/users*', (req, res) =>
// {
//     res.status(200).send(`catching all`)
// })

// server.use('/users', (req, res) =>
// {
//     res.status(200).send(`request highjacked with server#use, request method [${req.method}]`)
// })

server.post('/users', (req, res) =>
{
    log(`post:/users`)
    res.status(200).send(`user ${req.body.name} created`)
})

server.put('/users/:id(\\d)', (req, res) =>
{
    log(`put:/users:id`)
    res.status(200).send(`user ${req.body.name}, with id ${req.params.id}, updated`)
})

server.delete('/users/:id(\\d)', (req, res) =>
{
    log(`delete:/users:id`)
    res.status(200).send(`user deleted with id ${req.params.id}`)
})

server.send('update-stuff', ['new stuff'])
