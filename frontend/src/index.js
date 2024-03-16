import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Layout from './Components/Layout';
import ErrorPage from './Pages/ErrorPage';
import Postdetail from './Pages/Postdetail';
import Register from './Pages/Register';
import AuthorPosts from './Pages/AuthorPosts';
import Home from './Pages/Home';
import CreatePost from './Pages/CreatePost';
import Login from './Pages/Login';
import EditPost from './Pages/EditPost';
import Dashboard from './Pages/Dashboard';
import DeletePost from './Pages/DeletePost';
import Logout from './Pages/Logout';
import CategoryPosts from './Pages/CategoryPosts';
import Authors from './Pages/Authors';
import UserProfile from './Pages/UserProfile';
import UserProvider from './context/userContext';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const router = createBrowserRouter([
  {
    path: '/',
    element:<UserProvider> <Layout /></UserProvider>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'posts/:id', element: <Postdetail /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: 'profile/:id', element: <UserProfile /> },
      { path: 'authors', element: <Authors /> },
      { path: 'myposts/:id', element: <Dashboard /> },
      { path: 'create', element: <CreatePost /> },
      { path: 'posts/:id/edit', element: <EditPost /> },
      { path: 'posts/:id/delete', element: <DeletePost /> },
      { path: 'posts/categories/:category', element: <CategoryPosts /> },
      { path: 'logout', element: <Logout /> },
      { path: 'posts/users/:id', element: <AuthorPosts /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:token', element: <ResetPassword/> },
      
    ]
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClickrtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
  </React.StrictMode>
);
