import { useRef, useReducer, useContext } from 'react'
import Blogs from './components/Blogs'
import Blogform from './components/Blogform'
import Loginform from './components/Loginform'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import LoginUserContext from './components/LoginUserContext'

const messageReducer = (state, action) => {
    const blog = action.blog
    switch (action.type) {
        case 'NEW BLOG':
            return `Added ${blog.title} from ${blog.author}`
        case 'BLOG ERROR':
            return 'Error while adding the blog'
        case 'WRONG USER':
            return 'Wrong username or password'
        case 'RESET':
            return ''
        default:
            return state
    }
}

const App = () => {
    const queryClient = useQueryClient()

    const { user, setUser } = useContext(LoginUserContext)
    const [message, messageDispatch] = useReducer(messageReducer, '')

    const blogFormRef = useRef()

    const result = useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getAll,
    })

    const newBlogMutation = useMutation({
        mutationFn: blogService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
    })

    const likeBlogMutation = useMutation({
        mutationFn: blogService.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
    })

    const deleteBlogMutation = useMutation({
        mutationFn: blogService.deleteById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
    })

    const blogs = result.data

    const Notification = ({ message }) => {
        if (!message) {
            return (
                <div>
                    {' '}
                    <br />{' '}
                </div>
            )
        }

        return <div className='error'>{message}</div>
    }

    const addBlog = async (event, title, author, url) => {
        event.preventDefault()
        const blogObj = {
            title,
            author,
            url,
        }

        const newBlog = blogObj
        blogFormRef.current.toggleVisibility()

        newBlog.user = user
        await newBlogMutation.mutateAsync({ content: newBlog })
        messageDispatch({ type: 'NEW BLOG', blog: newBlog })
        setTimeout(() => {
            messageDispatch({ type: 'RESET' })
        }, 5000)
    }

    const deleteBlog = async (blog) => {
        await deleteBlogMutation.mutateAsync({ content: blog })
    }

    const addLike = async (blog) => {
        blog.likes++
        await likeBlogMutation.mutateAsync({ content: blog })
    }

    const loginUser = async (userObj) => {
        try {
            const user = await loginService.login(userObj)
            blogService.setToken(user.token)
            setUser(user)
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
        } catch (ex) {
            messageDispatch({ type: 'WRONG USER' })
            setTimeout(() => {
                messageDispatch({ type: 'RESET' })
            }, 5000)
        }
    }

    if (!user) {
        return (
            <Loginform loginUser={loginUser}>
                <Notification message={message} />
            </Loginform>
        )
    } else {
        return (
            <div>
                <Notification message={message} />
                <h2>blogs</h2>
                <div>
                    logged in as {user.username}
                    <button
                        onClick={() => {
                            window.localStorage.removeItem('loggedBlogappUser')
                            setUser(null)
                        }}
                    >
                        {' '}
                        logout{' '}
                    </button>
                </div>
                <br />
                <Togglable buttonLabel='add blog' ref={blogFormRef}>
                    <Blogform createBlog={addBlog} />
                </Togglable>
                <br />
                <Blogs blogs={blogs} deleteBlog={deleteBlog} addLike={addLike} />
            </div>
        )
    }
}

export default App
