require('dotenv')
const middleware = require('../utils/middleware')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (_, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user')
        response.json(blogs)
    } catch (e) {
        next(e)
    }
})

blogRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    const body = request.body

    if (!request.token) {
        return response.status(401).json({ error: 'Token is undefined' })
    }

    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url || '',
        likes: body.likes || 0,
        user: user.id,
    })

    if (!blog.title || !blog.author) {
        response.status(400).json({})
        return
    }

    try {
        const result = await blog.save()
        user.blogs = user.blogs.concat(result.id)
        await user.save()
        response.status(201).json(result)
    } catch (e) {
        next(e)
    }
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    if (!request.token) {
        return response.status(401).json({ error: 'Token is undefined' })
    }

    const user = request.user

    try {
        const blog = await Blog.findById(request.params.id)
        if (blog.user.toString() !== user.id) {
            return response
                .status(401)
                .json({ error: "You don't have the rights to remove resource" })
        }
    } catch (e) {
        next(e)
    }

    try {
        const result = await Blog.findByIdAndDelete(request.params.id)
        response.status(204).json(result)
    } catch (e) {
        next(e)
    }
})

blogRouter.put('/:id', async (request, response, next) => {
    try {
        const result = await Blog.findByIdAndUpdate(
            request.params.id,
            {
                title: request.body.title,
                author: request.body.author,
                url: request.body.url,
                likes: request.body.likes,
            },
            { runValidators: true }
        )
        response.json(result)
    } catch (e) {
        next(e)
    }
})

module.exports = blogRouter
