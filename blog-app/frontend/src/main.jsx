import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import { LoginUserContextProvider } from './components/LoginUserContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <LoginUserContextProvider>
            <App />
        </LoginUserContextProvider>
    </QueryClientProvider>
)
