import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
  <BrowserRouter>
   <GoogleOAuthProvider clientId="66982943772-f4fg4lqcg17h0o292buukpqed6n1oa12.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
  </QueryClientProvider>
  ,
)
