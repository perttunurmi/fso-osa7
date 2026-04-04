import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { assert } from 'vitest'
import Blogform from './Blogform'

describe('Blogform tests', () => {
    test('Blogform calls addBlog with correct parameters', async () => {
        const blogContent = {
            title: 'Testi title',
            author: 'Testaaaja',
            url: 'www.example.com',
        }

        const mockCreateUser = (e, title, author, url) => {
            e.preventDefault()

            assert.strictEqual(title, blogContent.title)
            assert.strictEqual(author, blogContent.author)
            assert.strictEqual(url, blogContent.url)

            assert.notStrictEqual(title, blogContent.title + 'Tämä on eri kuin alkuperäinen')
        }

        const { container } = render(<Blogform createBlog={mockCreateUser} />)

        const title = container.querySelector('#title')
        const author = container.querySelector('#author')
        const url = container.querySelector('#url')

        await userEvent.type(title, blogContent.title)
        await userEvent.type(author, blogContent.author)
        await userEvent.type(url, blogContent.url)

        await userEvent.click(screen.getByText('add blog'))
    })
})
