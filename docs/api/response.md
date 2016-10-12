Response
===

The response object is created by the server and sent to the client.

## Properties

### res.id
A universally unique identifier (UUID) matching the `req.id`.

### res.ipc
An object with two properties. `channel` specifies the channel being used by `ipcMain` to send messages. `sender` contains an instance of [webContents](https://github.com/electron/electron/blob/master/docs/api/web-contents.md) used to send the message.

## Methods

### res.status(code)
Sets the HTTP status for the response.
```javascript
res.status(400).send('Bad Request')
```

### res.send([body])
Sends the response to the client. The body can be any javascript value.
