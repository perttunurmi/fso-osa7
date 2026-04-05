import { useState, useEffect, useRef, useReducer } from 'react'
import Blog from './components/Blog'
import Blogform from './components/Blogform'
import Loginform from './components/Loginform'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

const Blogs = ({ blogs, user, deleteBlog, addLike }) => {
    console.log(blogs)
    if (blogs) {
        return (
            <div>
                {blogs
                    .sort((a, b) => {
                        return b.likes - a.likes
                    })
                    .map((blog) => (
                        <Blog
                            key={blog.id}
                            blog={blog}
                            user={user}
                            handleDelete={deleteBlog}
                            addLike={addLike}
                        />
                    ))}
            </div>
        )
    } else {
        return <div></div>
    }
}

const App = () => {
    const queryClient = useQueryClient()

    const [user, setUser] = useState(null)
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

    const blogs = result.data

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

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
        await blogService.deleteById(blog.id)
        const newBlogs = blogs.filter((b) => b.id !== blog.id)
        setBlogs(newBlogs)
    }

    const addLike = async (blog) => {
        blog.likes++
        await blogService.update(blog)
        const newBlogs = await blogService.getAll()
        setBlogs(newBlogs)
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
                <Blogs blogs={blogs} user={user} deleteBlog={deleteBlog} addLike={addLike} />
            </div>
        )
    }
}

export default App
