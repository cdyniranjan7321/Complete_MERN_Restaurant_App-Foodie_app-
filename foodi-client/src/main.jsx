import ReactDom from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/Router.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />,
    
)