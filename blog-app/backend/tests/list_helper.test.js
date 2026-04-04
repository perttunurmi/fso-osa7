const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper.js')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('totalLikes', () => {
    test('blogs[] is empty', () => {
        const empty = []

        const result = listHelper.totalLikes(empty)
        assert.strictEqual(result, 0)
    })

    test('no likes', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 0,
                __v: 0,
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 0,
                __v: 0,
            },
            {
                _id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 0,
                __v: 0,
            },
            {
                _id: '5a422b891b54a676234d17fa',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 0,
                __v: 0,
            },
            {
                _id: '5a422ba71b54a676234d17fb',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 0,
                __v: 0,
            },
            {
                _id: '5a422bc61b54a676234d17fc',
                title: 'Type wars',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 0,
                __v: 0,
            },
        ]

        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 0)
    })

    test('42 likes', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 2,
                __v: 0,
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 20,
                __v: 0,
            },
            {
                _id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 10,
                __v: 0,
            },
            {
                _id: '5a422b891b54a676234d17fa',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 6,
                __v: 0,
            },
            {
                _id: '5a422ba71b54a676234d17fb',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 1,
                __v: 0,
            },
            {
                _id: '5a422bc61b54a676234d17fc',
                title: 'Type wars',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 3,
                __v: 0,
            },
        ]

        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 42)
    })
})

describe('favoriteBlog', () => {
    test('blogs[] is empty', () => {
        const empty = []

        const result = listHelper.favoriteBlog(empty)
        assert.strictEqual(result, undefined)
    })

    test('favorite', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 2,
                __v: 0,
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 20,
                __v: 0,
            },
            {
                _id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 10,
                __v: 0,
            },
            {
                _id: '5a422b891b54a676234d17fa',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 6,
                __v: 0,
            },
            {
                _id: '5a422ba71b54a676234d17fb',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 1,
                __v: 0,
            },
            {
                _id: '5a422bc61b54a676234d17fc',
                title: 'Type wars',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 3,
                __v: 0,
            },
        ]

        const exp_fav = {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 20,
            __v: 0,
        }

        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, exp_fav)
    })
})

describe('Most blogs', () => {
    const blogs = [
        {
            _id: '5a422a851b54a676234d17f7',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 2,
            __v: 0,
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 20,
            __v: 0,
        },
        {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 10,
            __v: 0,
        },
        {
            _id: '5a422b891b54a676234d17fa',
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 6,
            __v: 0,
        },
        {
            _id: '5a422ba71b54a676234d17fb',
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
            likes: 1,
            __v: 0,
        },
        {
            _id: '5a422bc61b54a676234d17fc',
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 3,
            __v: 0,
        },
    ]

    test('Uncle Bob has the most blogs', () => {
        const res = listHelper.mostBlogs(blogs)
        const exp = {
            author: 'Robert C. Martin',
            blogs: 3,
        }

        assert.deepStrictEqual(res, exp)
    })
})

describe('Most likes', () => {
    test("Computers aren't human", () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 2,
                __v: 0,
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 20,
                __v: 0,
            },
            {
                _id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 10,
                __v: 0,
            },
            {
                _id: '5a422b891b54a676234d17fa',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 6,
                __v: 0,
            },
            {
                _id: '5a422ba71b54a676234d17fb',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 1,
                __v: 0,
            },
            {
                _id: '5a422bc61b54a676234d17fc',
                title: 'Type wars',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 3,
                __v: 0,
            },
        ]

        const res = listHelper.mostLikes(blogs)
        const exp = {
            author: 'Edsger W. Dijkstra',
            likes: 30,
        }

        assert.deepStrictEqual(res, exp)
    })
})
