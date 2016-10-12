electron-ipc-server
===
[![NPM](https://nodei.co/npm/electron-ipc-server.png)](https://nodei.co/npm/electron-ipc-server/)

An IPC server with an API similar to [Express](https://github.com/expressjs/express)' for [Electron](https://github.com/electron/electron).

Handling IPC messages in [Electron](https://github.com/electron/electron) can be a pain if you are building an app with a very active communication between processes. Instead of reinventing the wheel `electron-ipc-server` aims to reduce the learning curve by reimplementing well known patterns such as those used for routing in [Express](https://github.com/expressjs/express) on the server side and a fetch*-ish* API on the client side. Internally it' still using [ipcRenderer](https://github.com/electron/electron/blob/master/docs/api/ipc-renderer.md) and [ipcMain](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md) so there's nothing magic going on.

## Quick example
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
.then(response =>
{
    console.log(`users`, response.body)
    // now go and do something with your list of users!
})
```

## Installation
```
npm i electron-ipc-server --save
```

## Features
### What the client (renderer process) can do
* Send requests to the main process and handle responses using Promises.
* Use regular HTTP verbs like GET, POST, PUT and DELETE.
* Still use regular events with `client.on()`.

### What the server (main process) can do
* Respond to regular HTTP verbs like GET, POST, PUT and DELETE.
* Use an API similar to what Express offers, with middleware, params, query-strings, and much more.
* Broadcast messages (by definition, to all clients).

## Documentation
* [Server](docs/api/server.md)
* [Client](docs/api/client.md)
* [Routing](docs/api/routing.md)
* [Request](docs/api/request.md)
* [Response](docs/api/response.md)

## TODO
- [ ] Add guides to /docs
- [ ] Add /examples

## License

  [MIT](LICENSE)
