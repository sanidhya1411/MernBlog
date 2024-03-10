import React from 'react'
import { useState,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


const ForgotPassword = () => {

  const [userData, setUserData] = useState({
    email: '',
    password: '',
    password2: ''
  })

  const navigate = useNavigate()

  const [error, setError] = useState("")

  const ForgotUser = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.patch(`http://localhost:5000/api/users/forgotPassword`, userData)
      navigate('/login')

    }
    catch (err) {
      setError(err.response.data.message)
    }
  }
  
  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return {...prevState,[e.target.name]:e.target.value}
    })
  }

  return (
    <section className='login'>
      <div className="container">
        <h2>Reset Password</h2>
        <form className='form login_form' onSubmit={ForgotUser}>
          {error && <p className="form_error-message">{error}</p>}
          <input type="email" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <input type="password" placeholder='Confirm Password' name='password2' value={userData.password2} onChange={changeInputHandler} />
          <button className='btn primary'>Submit</button>
        </form>
      </div>
    </section>
  )
}

export default ForgotPassword