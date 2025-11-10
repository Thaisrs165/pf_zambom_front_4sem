import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'


createRoot(document.getElementById('root')).render(
  <Auth0Provider
      domain="dev-ixloob8g7y8kjaf0.us.auth0.com"
      clientId="sBLD574v15FhvNPJVxKpatYTvBAr6CKa"
      authorizationParams={{
        audience: "https://dev-ixloob8g7y8kjaf0.us.auth0.com/api/v2/",
        redirect_uri: window.location.origin
      }}
    >
    <App /> 
  </Auth0Provider>, 
)