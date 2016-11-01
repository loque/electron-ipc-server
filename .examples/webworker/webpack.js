const webpack = require('webpack')

const worker = webpack({
    context: __dirname,
    entry:
    {
        client: './src/client.js',
        server: './src/server.js',
    },
    output: {
        path: `${__dirname}/public`,
        filename: '[name].js',
    }
})

worker.watch({}, (err, stats) =>
{
    if (err) return console.error(err)

    console.log(stats.endTime)
})
