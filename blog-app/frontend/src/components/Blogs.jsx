import { useContext } from 'react'
import Blog from './Blog'
import LoginUserContext from './LoginUserContext'

export const Blogs = ({ blogs, deleteBlog, addLike }) => {
    const { user, setUser } = useContext(LoginUserContext)

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

export default Blogs
