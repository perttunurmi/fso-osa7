require('dotenv').config()
const { test, after, describe, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token

before(async () => {
    await User.deleteMany({})
    console.log('Users deleted')

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({
        username: 'root',
        passwordHash: passwordHash,
    })

    const savedUser = await user.save()
    console.log('Test user initialized')

    console.log('Generating token')
    token = jwt.sign({ username: savedUser.username, id: savedUser._id }, process.env.SECRET)

    assert(token)

    console.log(token)
})

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('Blogs deleted')

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))

    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
    console.log('Blogs initialized')
})

describe('Blogs api tests', async () => {
    test('Right amount of blogs', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body

        assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })

    test('Blogs contain id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body

        blogs.forEach((blog) => {
            assert(blog.id)
        })
    })

    test('Adding a blog', async () => {
        await api
            .post('/api/blogs')
            .send({
                title: 'Test',
                author: 'Test',
                url: 'Test',
                likes: 0,
            })
            .set('Authorization', `Bearer ${token}`)

        const response = await api.get('/api/blogs')
        const blogs = response.body

        assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
    })

    test('Zero likes is the norm', async () => {
        const response = await api
            .post('/api/blogs')
            .send({
                title: 'Test',
                author: 'Test',
                url: 'Tets',
            })
            .set('Authorization', `Bearer ${token}`)

        const newBlog = JSON.parse(response.text)

        assert.strictEqual(newBlog.likes, 0)
    })

    test('A blog must have an title and author', async () => {
        await api
            .post('/api/blogs')
            .send({
                author: 'Test',
            })
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        await api
            .post('/api/blogs')
            .send({
                title: 'Test',
            })
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        await api.post('/api/blogs').send({}).set('Authorization', `Bearer ${token}`).expect(400)
    })

    test('Delete blog', async () => {
        const blog = await api.post('/api/blogs/').set('Authorization', `Bearer ${token}`).send({
            title: 'Test',
            author: 'Test',
        })

        await api
            .delete(`/api/blogs/${blog.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    })

    test('Editing existing', async () => {
        const blog = await api
            .post('/api/blogs/')
            .send({
                title: 'Test',
                author: 'Test',
            })
            .set('Authorization', `Bearer ${token}`)

        await api.put(`/api/blogs/${blog.body.id}`).send({
            title: blog.body.title,
            author: blog.body.title,
            likes: 1,
        })

        const response = await api.get('/api/blogs/')
        const blogs = response.body
        const edited = blogs.find((obj) => obj.id === blog.body.id)

        assert.deepEqual(edited.likes, 1)
    })
})

after(async () => {
    await mongoose.connection.close()
})
