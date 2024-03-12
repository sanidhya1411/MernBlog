import React from 'react'
import { useState, useContext ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa'
import { UserContext } from '../context/userContext'
import axios from 'axios'
import { useDebugValue } from 'react'

const UserProfile = () => {
  const [avatar, setAvatar] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isAvatarTouched, setIsAvatarTouched] = useState(false)
  const [error,setError]=useState('')
  
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token
  const navigate = useNavigate()

  useEffect(() => {
  if (!token) {
    navigate('/login')
  }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`https://mernblog-ypmi.onrender.com/api/users/${currentUser.id}`, { withCredentials: true, headers: { Authorization: `Beraer ${token}` } })
      const { name, email, avatar } = response.data;
      setName(name)
      setEmail(email)
      setAvatar(avatar)
    }
    getUser()
  },[])

  const changeAvatarHandler = async() => {
    setIsAvatarTouched(false)
    try {
      const postData = new FormData();
      postData.set('avatar', avatar)
      const response = await axios.post(`https://mernblog-ypmi.onrender.com/api/users/change-avatar`, postData, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      setAvatar(response?.data.avatar)
    }
    catch (error) {
      setError(error.response.data.message)
    }
  }
  const updateUserDetail = async (e) => {
    e.preventDefault()

    const userData = new FormData()
    userData.set('name', name)
    userData.set('email', email)
    userData.set('currentPassword', currentPassword)
    userData.set('newPassword', newPassword)
    userData.set('confirmNewPassword', confirmNewPassword)

    try {
      const response = await axios.patch(`https://mernblog-ypmi.onrender.com/api/users/edit-user`, userData, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      if (response.status == 200) {
        navigate('/logout')
      }
    
    }
    catch (error) {
      setError(error.response.data.message)
    }

    
  }

  return (
    <section className="profile">
      <div className="container profile_container">
        <Link to={`/myposts/${currentUser.id}`} className='btn'>My Posts</Link>

        <div className="profile_details">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
              <img src={avatar} alt="" />
             </div>
              <form className='avatar_form'>
                <input type='file' name='avatar' onClick={()=>setIsAvatarTouched(true)} id='avatar'accept='png,jpg,jpeg' onChange={e=>setAvatar(e.target.files[0])}/>
                <label htmlFor='avatar'><FaEdit/></label>
            </form>
            {isAvatarTouched && <button className='profile_avatar-btn' onClick={changeAvatarHandler}><FaCheck/></button>}
            </div>
            <h1>{currentUser.name}</h1>
          <form className='form profile_form' onSubmit={updateUserDetail}>
            {error && <p className='form_error-message'>{error}</p>}
              <input type="text" placeholder='Full Name' value={name} onChange={e => setName(e.target.value)} autoFocus />
              <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder='Current Password' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              <input type="password" placeholder='New Password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <input type="password" placeholder='Confirm New Password' value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
              <button type='submit' className='btn primary'>Update Details</button>
          </form>
          </div>
        </div>
    </section>
  )
}

export default UserProfile