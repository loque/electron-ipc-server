Client
===

## createClient([name])
Create a client instance. The client object has methods for sending IPC messages as if they were HTTP requests and handling it's responses with promises.
```javascript
const client = require('electron-ipc-server').createClient('CLIENT_NAME')
```

## HTTP-like methods

### client.get(path)
```javascript
client.get('/users')
.then(response =>
{
    console.log(`users`, response.body)
})
.catch(error =>
{
    console.error(error)
})
```

### client.post(path [, body])
```javascript
client.post('/users', { name: 'Messi' })
.then(response =>
{
    console.log(`last_user_id`, response.body.last_user_id)
})
.catch(error =>
{
    console.error(`error`, error)
})
```

### client.put(path [, body])
```javascript
client.put('/users/0', { name: 'New Name' })
.then(response =>
{
    console.log(`updated_user_id`, response.body.updated_user_id)
})
.catch(error =>
{
    console.error(`error`, error)
})
```
> Notice we are using path parameter to capture values from the path. For more information, see [Routing](routing.md).

### client.delete(path)
```javascript
client.delete('/users/0')
.then(response =>
{
    console.log(`deleted_user_id`, response.body.deleted_user_id)
})
.catch(error =>
{
    console.error(`error`, error)
})
```
> Notice we are using path parameter to capture values from the path. For more information, see [Routing](routing.md).

## Event methods

### client.on(channel, listener)
This is still working like regular `ipcRenderer.on()`. Shortly this will change in order to have greater control.
```javascript
client.on('users-list-update', (event, data) =>
{
    console.log(`users`, data)
})
```
