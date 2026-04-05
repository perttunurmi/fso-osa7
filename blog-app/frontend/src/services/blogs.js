import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAll = async () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)
}

const create = async (data) => {
    const newObj = data.content
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newObj, config)
    return response.data
}

const update = async (blog) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.put(baseUrl + '/' + blog.id, blog, config)
    return response.data
}

const deleteById = async (id) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

export default { getAll, create, update, deleteById, setToken }
