import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, handleDelete, addLike }) => {
    const [showExtra, setShowExtra] = useState(false)

    Blog.propTypes = {
        blog: PropTypes.any.isRequired,
        user: PropTypes.any.isRequired,
        handleDelete: PropTypes.any.isRequired,
    }

    Blog.displayName = 'Blog'

    const toggleExtra = () => {
        if (showExtra) {
            setShowExtra(false)
        } else {
            setShowExtra(true)
        }
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }

    if (!showExtra) {
        return (
            <div style={blogStyle}>
                {blog.title} {blog.author} <button onClick={toggleExtra}> show </button>
            </div>
        )
    } else {
        return (
            <div style={blogStyle}>
                <div>
                    {blog.title} {blog.author} <button onClick={toggleExtra}> hide </button>
                </div>
                <div>url: {blog.url || ''}</div>
                <div>
                    likes: {blog.likes || 0}{' '}
                    <button className='likeButton' onClick={() => addLike(blog)}>
                        {' '}
                        likes{' '}
                    </button>
                </div>
                <div>{blog.user.username || ''}</div>
                <div>
                    {user.username === blog.user.username && (
                        <button
                            onClick={() => {
                                window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
                                    ? handleDelete(blog)
                                    : null
                            }}
                        >
                            {' '}
                            remove{' '}
                        </button>
                    )}
                </div>
            </div>
        )
    }
}

export default Blog
