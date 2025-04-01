import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './assets/fonts/fonts.css'
import { AuthProvider } from './providers/AuhProvider.tsx'
import { store } from './store/store.ts'
import { FavoriteProvider } from './providers/FavoriteProvider.tsx'

const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <FavoriteProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </FavoriteProvider>
    </Provider>
  </QueryClientProvider>
  // </StrictMode>
)
