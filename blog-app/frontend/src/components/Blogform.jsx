import { useState } from 'react'

const Blogform = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    return (
        <form onSubmit={(e) => createBlog(e, title, author, url)}>
            <h2> create new </h2>
            <div>
                title:
                <input
                    value={title}
                    id='title'
                    type='text'
                    name='title'
                    required
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                author:
                <input
                    value={author}
                    type='text'
                    id='author'
                    name='author'
                    required
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                url:
                <input
                    value={url}
                    id='url'
                    type='text'
                    name='url'
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type='submit'>add blog</button>
        </form>
    )
}

export default Blogform
