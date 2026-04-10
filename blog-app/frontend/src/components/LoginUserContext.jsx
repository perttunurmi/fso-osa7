import { createContext, useEffect, useState } from 'react'
import blogService from '../services/blogs'

const LoginUserContext = createContext()

export default LoginUserContext

export const LoginUserContextProvider = (props) => {
    const [user, setUser] = useState(0)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    return (
        <LoginUserContext.Provider value={{ user, setUser }}>
            {props.children}
        </LoginUserContext.Provider>
    )
}
