Server
===

## createServer(app)
Create a server intance. The server object has methods for routing IPC messages as if they were HTTP requests with an API similar to what [Express](https://github.com/expressjs/express) offers.
```javascript
const { app } = require('electron')
const server = require('electron-ipc-server').createServer(app)
```

## HTTP-like methods

### server.get(path [, callback...])
```javascript
server.get('/users', (req, res) =>
{
    let users = // you get the users from your backend
    res.status(200).send(users)
})
```

### server.post(path [, callback...])
```javascript
server.post('/users', (req, res) =>
{
    // create user, then...
    res.status(200).send(`user ${req.body.name} created`)
})
```

### server.put(path [, callback...])
```javascript
server.put('/users/:id', (req, res) =>
{
    // update user, then...
    res.status(200).send(`user ${req.body.name}, with id ${req.params.id}, updated`)
})
```
> Notice we are using path parameter to capture values from the path. For more information, see [Routing](routing.md).

### server.delete(path [, callback...])
```javascript
server.delete('/users/:id', (req, res) =>
{
    // delete user, then...
    res.status(200).send(`user deleted with id ${req.params.id}`)
})
```
> Notice we are using path parameter to capture values from the path. For more information, see [Routing](routing.md).

### server.all(path [, callback...])
```javascript
server.all('/users', (req, res) =>
{
    res.status(200).send(`catching all requests`)
})
```

## Event methods

### server.broadcast(channel, data)
```javascript
server.broadcast('users-list-update', usersList)
```

## Middleware methods

### server.use([path,] callback [, callback...])
```javascript
server.use(query)
```
