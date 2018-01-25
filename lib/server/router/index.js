function Router(basePath = '/')
{
    const STACK = []

    this.add = row =>
    {
        STACK.push(row)
    }

    this.handle = (request, response) =>
    {
        let layerIdx = 0,
            handlerIdx = 0

        next()

        function next(label)
        {
            if (label == 'route')
            {
                layerIdx++
                handlerIdx = 0
            }

            // reached the end of the stack with no match
            if (layerIdx == STACK.length) return

            let handler = STACK[layerIdx][handlerIdx]
            let handlersMaxIdx = STACK[layerIdx].length - 1

            if (handlerIdx < handlersMaxIdx)
            {
                handlerIdx++
            }
            else if (handlerIdx == handlersMaxIdx)
            {
                layerIdx++
                handlerIdx = 0
            }

            handler(request, response, next)
        }
    }

    return this
}

module.exports = Router
