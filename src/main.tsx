import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import App from './layout.tsx'
import Layout from '@/layout';
//import './index.css'
import './styles/global.scss'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { App } from 'antd';

import AboutPage from 'pages/client/about';
import BookPage from 'pages/client/book';
import HomePage from 'pages/client/home';
import RegisterPage from 'pages/client/auth/register';
import LoginPage from 'pages/client/auth/login';
import {AppContext} from '@/components/context/app.context'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    
    children: [
      
      {
        path: "/about",
        element: <div><AboutPage/></div>
      },
      {
        path: "/book",
        element: <div><BookPage/></div>
      },
      {
        path: "/home",
        element: <div><HomePage/></div>
      }
    ],
  },
  {
     path: "/register",
        element: <div><RegisterPage/></div>
   },
   {
        path: "/login",
        element: <div><LoginPage/></div>
      },
]);
createRoot(document.getElementById('root')!).render(
    
      <StrictMode>
        <App>
          <AppContext>

            <RouterProvider router={router} />
          </AppContext>
        </App>
      </StrictMode>,
    
)
