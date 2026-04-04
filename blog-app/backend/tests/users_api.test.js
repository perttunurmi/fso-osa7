const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const User = require('../models/user')
const app = require('../app.js')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    console.log('Deleted')

    const userObjects = helper.initialUsers.map((user) => new User(user))

    const promiseArray = userObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
    console.log('Initialized')
})

describe('users api tests', async () => {
    test('returns the right amount of users', async () => {
        const response = await api.get('/api/users')

        assert.strictEqual(response.body.length, helper.initialUsers.length)
    })

    test('add user', async () => {
        await api.post('/api/users').send({
            username: 'username',
            password: 'password',
        })

        const response = await api.get('/api/users')
        assert.strictEqual(response.body.length, helper.initialUsers.length + 1)
    })

    test('short password fails', async () => {
        const response = await api.post('/api/users').send({
            username: 'username',
            password: '12',
        })

        assert.strictEqual(response.statusCode, 400)
    })

    test('short username fails', async () => {
        const response = await api.post('/api/users').send({
            username: '12',
            password: 'password',
        })

        assert.strictEqual(response.statusCode, 400)
    })

    test('username already exists', async () => {
        const response = await api.post('/api/users').send({
            username: 'root',
            password: 'password',
        })

        assert.strictEqual(response.statusCode, 500)
    })
})

after(async () => {
    await mongoose.connection.close()
})
