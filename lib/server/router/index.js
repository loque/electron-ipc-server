function Router(basePath = '/')
{
    const STACK = []
    let layerIdx = 0,
        handlerIdx = 0

    this.add = row =>
    {
        STACK.push(row)
    }

    this.handle = (request, response) =>
    {
        next()

        function next(label)
        {
            if (label == 'route')
            {
                // restore altered req.url
                layerIdx++
                handlerIdx = 0
            }

            // reached the end of the stack with no match
            if (layerIdx == STACK.length - 1) return

            let handler = STACK[layerIdx][handlerIdx]
            let handlersMaxIdx = STACK[layerIdx].length - 1

            if (handlerIdx < handlersMaxIdx)
            {
                handlerIdx++
            }
            else if (handlerIdx == handlersMaxIdx)
            {
                // restore altered req.url
                layerIdx++
                handlerIdx = 0
            }

            handler(request, response, next)
        }
    }

    return this
}

module.exports = Router
