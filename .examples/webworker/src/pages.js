const router = require('../../../lib/adapters/webworker/server').createRouter()

router.get('/:id([\\d]+)', (req, res) =>
{
    console.log(`req.online`, req.online)
    // console.log(`get:/books/pages`)
    res.status(200).send([`page with id ${req.params.id}`])
})

module.exports = router
