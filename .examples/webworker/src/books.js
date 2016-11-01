const router = require('../../../lib/adapters/webworker/server').createRouter()
const pages = require('./pages')

router.use('/pages', pages.middleware())

router.get('/:id([\\d]+)', (req, res) =>
{
    // console.log(`get:/books/:id`)
    res.status(200).send([`book with id ${req.params.id}`])
})

// router.send('pages', 'new page')

module.exports = router
