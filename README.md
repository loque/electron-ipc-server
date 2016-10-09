electron-ipc-server
===

An IPC server with an API similar to [Express.js](https://github.com/expressjs/express)' for [Electron](https://github.com/electron/electron).

```javascript
// In main process
const server = require('electron-ipc-server').createServer(app)

server.get('/users', (req, res) =>
{
    let users = // you get the users from your backend
    res.status(200).send(users)
})
```

```javascript
// In render process
const client = require('electron-ipc-server').createClient()

client.get('/users')
.then(users =>
{
    console.log(`users`, users)
    // now go and do something with your users' list
})
```

## Installation
```
npm i electron-ipc-server --save
```

## Features
### What the client (renderer process) can do
* Make requests to main process with Promises
* Use regular HTTP verbs like GET, POST, PUT and DELETE
* Still use regular events with `client.on()`

### What the server (main process) can do
* Respond to regular HTTP verbs like GET, POST, PUT and DELETE
* Broadcast messages (by definition, to all clients)
* Use an API similar to what Express offers, with middleware, params, query-strings, etc.

## TODO
- [ ] Method overview in README.md
- [ ] Add /docs
- [ ] Add /examples

## License

  [MIT](LICENSE)
