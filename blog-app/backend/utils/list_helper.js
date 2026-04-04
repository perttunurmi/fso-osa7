const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, current) => sum + current.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((fav, current) => (current.likes > fav.likes ? current : fav), blogs[0])
}

const howManyBlogs = (blogs, author) => {
    return blogs.filter((blog) => blog.author === author).length
}

// Palauttaa kirjoittajan, jolla on eniten blogeja.
// Päähän sattui, mutta sain toteutettua ilman for-looppia!
const mostBlogs = (blogs) => {
    const counts = blogs.map((blog) => {
        const author = {
            author: blog.author,
            count: howManyBlogs(blogs, blog.author),
        }
        return author
    })

    const most = counts.reduce((most, curr) => (curr.count > most.count ? curr : most), counts[0])

    return {
        author: most.author,
        blogs: most.count,
    }
}

const howManyLikes = (blogs, author) => {
    return blogs.reduce((sum, curr) => (curr.author === author ? sum + curr.likes : sum), 0)
}

const mostLikes = (blogs) => {
    const likes = blogs.map((blog) => {
        return {
            author: blog.author,
            likes: howManyLikes(blogs, blog.author),
        }
    })

    const most = likes.reduce((most, curr) => {
        return curr.likes > most.likes ? curr : most
    }, likes[0])

    return {
        author: most.author,
        likes: most.likes,
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}
