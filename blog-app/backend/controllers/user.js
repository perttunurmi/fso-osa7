const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
    try {
        const { username, name, password } = request.body

        if (password.length < 3) {
            response.status(400).json({ message: 'Password too short' })
            return
        }

        if (username.length < 3) {
            response.status(400).json({ message: 'Username too short' })
            return
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passwordHash,
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (e) {
        next(e)
    }
})

usersRouter.get('/', async (_, response, next) => {
    try {
        const users = await User.find({}).populate('blogs')
        response.status(200).json(users)
    } catch (e) {
        next(e)
    }
})

module.exports = usersRouter
