const jwt = require('jsonwebtoken')
const { response, request } = require('express')
const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    if (!process.env.NODE_ENV === 'test') {
        logger.info('Method:', request.method)
        logger.info('Path:  ', request.url)

        if (request.url === '/api/users') {
            const user = request.body.username

            logger.info('Body:  ', user)
        } else {
            logger.info('Body:  ', request.body)
        }
        logger.info('---')
    }
    next()
}

const unknownEndpoint = (_, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (
        error.errmsg &&
        error.errmsg.includes('E11000 duplicate key error collection: Blogilista.users index:')
    ) {
        console.log(error.errmsg)
        return response.status(400).json({ error: 'username taken' })
    }

    next(error)
}

const getTokenFrom = (request) => {
    const auth = request.get('authorization')
    if (auth && auth.startsWith('Bearer ')) {
        return auth.replace('Bearer ', '')
    }
    return null
}

const tokenExtractor = (request, response, next) => {
    const auth = request.get('authorization')
    if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
        if (!decodedToken || !decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

        request.token = decodedToken
    }

    next()
}

const userExtractor = async (request, response, next) => {
    try {
        if (!request.token) {
            return response.status(401).json({ error: 'Missing authorization' })
        }

        const user = await User.findById(request.token.id)
        if (!user) {
            return response.status(400).json({ error: "missing id for user or it's not valid" })
        }

        request.user = user
    } catch (e) {
        logger.error(e)
        next(e)
    }

    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
}
