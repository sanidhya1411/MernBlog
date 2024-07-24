import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Layout from './Components/Layout';
import ErrorPage from './Pages/ErrorPage';
// import Postdetail from './Pages/Postdetail';
// import Register from './Pages/Register';
// import AuthorPosts from './Pages/AuthorPosts';
// import Home from './Pages/Home';
// import CreatePost from './Pages/CreatePost';
// import Login from './Pages/Login';
// import EditPost from './Pages/EditPost';
// import Dashboard from './Pages/Dashboard';
// import DeletePost from './Pages/DeletePost';
// import Logout from './Pages/Logout';
// import CategoryPosts from './Pages/CategoryPosts';
// import Authors from './Pages/Authors';
// import UserProfile from './Pages/UserProfile';
import UserProvider from './context/userContext';
// import ForgotPassword from './Pages/ForgotPassword';
// import ResetPassword from './Pages/Resetpassword';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Verify from './Pages/Verify';
// import Verified from './Pages/Verified';
import Loader from './Components/Loader';

const Home = lazy(() => import("./Pages/Home"));
const Postdetail = lazy(() => import("./Pages/Postdetail"));
const Register = lazy(() => import("./Pages/Register"));
const Login = lazy(() => import("./Pages/Login"));
const UserProfile = lazy(() => import("./Pages/UserProfile"));
const Authors = lazy(() => import("./Pages/Authors"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const CreatePost = lazy(() => import("./Pages/CreatePost"));
const EditPost = lazy(() => import("./Pages/EditPost"));
const DeletePost = lazy(() => import("./Pages/DeletePost"));
const CategoryPosts = lazy(() => import("./Pages/CategoryPosts"));
const AuthorPosts = lazy(() => import("./Pages/AuthorPosts"));
const Logout = lazy(() => import("./Pages/Logout"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const Verify = lazy(() => import("./Pages/Verify"));
const Verified = lazy(() => import("./Pages/Verified"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));






const router = createBrowserRouter([
  {
    path: '/',
    element:<UserProvider> <Layout /></UserProvider>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element:<Suspense fallback={<Loader/>}> <Home /></Suspense> },
      { path: 'posts/:id', element: <Suspense fallback={<Loader/>}> <Postdetail /></Suspense> },
      { path: 'register', element: <Suspense fallback={<Loader/>}> <Register /></Suspense> },
      { path: 'login', element:<Suspense fallback={<Loader/>}> <Login /></Suspense> },
      { path: 'profile/:id', element: <Suspense fallback={<Loader/>}> <UserProfile /></Suspense> },
      { path: 'authors', element:  <Suspense fallback={<Loader/>}> <Authors /></Suspense> },
      { path: 'myposts/:id', element:  <Suspense fallback={<Loader/>}> <Dashboard /></Suspense> },
      { path: 'create', element: <Suspense fallback={<Loader/>}> <CreatePost /></Suspense> },
      { path: 'posts/:id/edit', element:  <Suspense fallback={<Loader/>}> <EditPost /></Suspense> },
      { path: 'posts/:id/delete', element:  <Suspense fallback={<Loader/>}> <DeletePost /></Suspense> },
      { path: 'posts/categories/:category', element:  <Suspense fallback={<Loader/>}> <CategoryPosts /></Suspense> },
      { path: 'logout', element:  <Suspense fallback={<Loader/>}> <Logout /></Suspense> },
      { path: 'posts/users/:id', element:  <Suspense fallback={<Loader/>}> <AuthorPosts /></Suspense> },
      { path: 'forgot-password', element:  <Suspense fallback={<Loader/>}> <ForgotPassword/></Suspense> },
      { path: 'verify', element:  <Suspense fallback={<Loader/>}> <Verify/></Suspense> },
      { path: 'verified/:token', element:  <Suspense fallback={<Loader/>}> <Verified /></Suspense> },,
      { path: 'reset-password/:token', element:  <Suspense fallback={<Loader/>}> <ResetPassword /></Suspense> },
      
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
