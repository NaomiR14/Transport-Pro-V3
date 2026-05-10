import pino from 'pino'

const logger = pino({
    level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV !== 'production' ? 'debug' : 'info'),
})

export default logger
