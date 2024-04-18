import React from 'react'
import { useState,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {UserContext} from '../context/userContext.js'

const Login = () => {

  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { setCurrentUser } = useContext(UserContext)
  
  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return {...prevState,[e.target.name]:e.target.value}
    })
  }
  const loginUser = async (e) => {
    e.preventDefault()
    setError('')
    try {

      const response = await axios.post(`http://localhost:5000/api/users/login`, userData)
      const user = await response.data;
      setCurrentUser(user)
      navigate('/')
      
    }
    catch (err) {
      setError(err.response.data.message)
    }
  }
  return (
    <section className='login'>
      <div className="container">
        <h2>Login</h2>
        <form className='form login_form' onSubmit={ loginUser}>
          {error && <p className="form_error-message">{error}</p>}
          <input type="email" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler}/>
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <button className='btn primary'>Login</button>
        </form>
        <small>Don't have an account?<Link to='/register'> Sign Up</Link></small>
        <small><Link to='/verify'>Verify Email</Link></small>
        <small><Link to='/forgot-password'>Forgot Password</Link></small>
      </div>
    </section>
  )
}

export default Login