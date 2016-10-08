const PUSH = 'push'
const UNSHIFT = 'unshift'

const defaultRetryConfig = {
    limit: 0,
    attempts: 0,
}

/*

    config = {
        autostart: undefined,
        sync: undefined,
    }

*/
function Scheduler(config = {})
{
    const stack = []

    let shouldRun = false
    let isRunning = false

    this.addRetryAction = (method, action, config) =>
    {
        action.__method = method

        action.__retry = Object.assign(
            {
                method: method
            },
            defaultRetryConfig,
            config
        )

        return this.addAction(action)
    }

    this.addAction = action =>
    {
        let job = { action }

        let jobPromise = new Promise((resolve, reject) =>
        {
            job.__resolve = resolve
            job.__reject = reject
        })

        stack[action.__method](job)

        if (shouldRun && !isRunning) this.next()

        return jobPromise
    }

    this.push = action =>
    {
        action.__method = PUSH

        return this.addAction(action)
    }

    this.unshift = action =>
    {
        action.__method = UNSHIFT

        return this.addAction(action)
    }

    this.pushRetry = (action, config) =>
    {
        return this.addRetryAction(PUSH, action, config)
    }

    this.unshiftRetry = (action, config) =>
    {
        return this.addRetryAction(UNSHIFT, action, config)
    }

    this.start = () =>
    {
        if (shouldRun) return // avoid running next when already running

        shouldRun = true
        this.next()
    }

    this.pause = () =>
    {
        shouldRun = false
    }

    this.next = () =>
    {
        if (!shouldRun) return isRunning = false

        let job = stack.shift()

        if (!job) return isRunning = false

        isRunning = true

        let executionPromise = this.execute(job)

        if (!config.sync)
        {
            setTimeout(this.next.bind(this), 0)
        }
        else
        {
            executionPromise
            .then(response =>
            {
                this.next()
                return response
            })
        }
    }

    this.execute = job =>
    {
        if (job.action.__retry)
        {
            job.action.__retry.attempts++

            return job.action()
            .then(job.__resolve)
            .catch(error =>
            {
                if (
                    job.action.__retry.limit > 0
                    && job.action.__retry.attempts == job.action.__retry.limit
                )
                {
                    job.__reject(`retry limit reached: ${job.action.__retry.limit}`)
                    return
                }

                // re-schedule job
                this[job.action.__retry.method](job.action)
                .then(job.__resolve)
                .catch(job.__reject)
            })
        }

        return job.action()
        .then(job.__resolve)
        .catch(job.__reject)
    }

    if (config.autostart) this.start()

    return {
        push: this.push,
        unshift: this.unshift,
        pushRetry: this.pushRetry,
        unshiftRetry: this.unshiftRetry,
        start: this.start,
        pause: this.pause,
    }
}

module.exports = Scheduler
