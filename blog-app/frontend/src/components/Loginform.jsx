import { useState } from 'react'

const Loginform = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (e) => {
        e.preventDefault()

        props.loginUser({ username, password })
        setUsername('')
        setPassword('')
    }

    return (
        <form onSubmit={handleLogin}>
            {props.children}
            <h2>log in</h2>
            <div>
                username
                <input
                    value={username}
                    type='text'
                    name='username'
                    required
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>

            <div>
                password
                <input
                    value={password}
                    type='password'
                    name='password'
                    required
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <div>
                <button type='submit'>login</button>
            </div>
        </form>
    )
}

export default Loginform
