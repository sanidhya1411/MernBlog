import React from 'react'
import { useState } from 'react'
import { Link ,useNavigate,useParams} from 'react-router-dom'
import axios from 'axios'



const ResetPassword = () => {
  const [userData, setUserData] = useState({
    password: '',
    password2: ''
  })

  const {token}=useParams()

  const [error, setError] = useState('')
  const navigate=useNavigate()
  
  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return {...prevState,[e.target.name]:e.target.value}
    })
  }
  const updatePassword = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.patch(`http://localhost:5000/api/users/resetPassword/${token}`, userData)
      navigate('/login')

    }
    catch (err) {
      setError(err.response.data.message)
    }
  }
  return (
    <section className='login'>
      <div className="container">
        <h2>Reset Password</h2>
        <form className='form login_form' onSubmit={ updatePassword}>
          {error && <p className="form_error-message">{error}</p>}
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <input type="password" placeholder='Confirm Password' name='password2' value={userData.psaaword2} onChange={changeInputHandler} />
          <button className='btn primary'>Update</button>
        </form>
      </div>
    </section>
  )
}

export default ResetPassword