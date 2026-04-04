import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
    const blog = {
        title: 'Testi',
        author: 'Testaaja',
        user: {
            username: 'root',
            id: '123123',
        },
    }

    render(<Blog blog={blog} handleDelete={() => {}} />)

    const element = screen.getByText('Testi Testaaja')
    expect(element).toBeDefined()

    const user = screen.queryByText('root')
    expect(user).toBeNull()

    const url = screen.queryByText('url')
    expect(url).toBeNull()

    const likes = screen.queryByText('likes')
    expect(likes).toBeNull()
})

test('show extra info', async () => {
    const user = userEvent.setup()

    const userObj = {
        username: 'root',
        id: '12312313',
    }

    const blog = {
        title: 'Testi',
        author: 'Testaaja',
        url: 'https://testi.fi',
        likes: 5,
        user: userObj,
    }

    render(<Blog blog={blog} user={userObj} handleDelete={() => {}} />)

    const button = screen.getByText('show')
    await user.click(button)

    const url = screen.getByText('url:', { exact: false })
    expect(url).toBeDefined()

    const likes = screen.getByText('likes:', { exact: false })
    expect(likes).toBeDefined()
})

test('Two likes', async () => {
    const user = userEvent.setup()

    const userObj = {
        username: 'root',
        id: '12312313',
    }

    const blog = {
        title: 'Testi',
        author: 'Testaaja',
        url: 'https://testi.fi',
        likes: 5,
        user: userObj,
    }

    const mockHandler = vi.fn()

    const { container } = render(
        <Blog blog={blog} user={userObj} handleDelete={() => {}} addLike={mockHandler} />
    )

    const button = screen.getByText('show')
    await user.click(button)

    const like = container.querySelector('.likeButton')
    await user.click(like)
    await user.click(like)

    expect(mockHandler.mock.calls).toHaveLength(2)
})
