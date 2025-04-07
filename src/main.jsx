import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SpotifyAuthProvider } from './context/SpotifyAuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext.jsx'


const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <UserProvider>
      <SpotifyAuthProvider>
        <App />
        </SpotifyAuthProvider>
      </UserProvider>
    </GoogleOAuthProvider>
    
  </StrictMode>,
)
