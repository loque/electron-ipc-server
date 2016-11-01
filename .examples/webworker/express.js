const app = require('express')()
const PORT = 3000

function addAsset(app, path, filepath)
{
    filepath = filepath || path

    app.get(path, (req, res) =>
    {
        res.sendFile(`${__dirname}/${filepath}`)
    })
}

addAsset(app, '/', 'public/index.html')
addAsset(app, '/client.js', 'public/client.js')
addAsset(app, '/server.js', 'public/server.js')

app.listen(PORT, error =>
{
    if (error) return console.error(error)

    console.info(`==> 🌎  Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.`)
});
