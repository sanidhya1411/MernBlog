import React,{useContext,useEffect, useState}from 'react'
import { useNavigate ,Link,useLocation} from 'react-router-dom'
import { UserContext } from '../context/userContext'
import axios from 'axios'
import Loader from '../Components/Loader'

const DeletePost = ({postId}) => {

  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading,setIsloading]=useState(false)

  useEffect(() => {
  if (!token) {
    navigate('/login')
    }    
  }, [])

  const removePost = async (id) => {
    setIsloading(true)
    try {
      const response = await axios.delete(`https://mernblog-ypmi.onrender.com/api/posts/${id}`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      if (response.status == 200) {
        if (location.pathname == `/myposts/${currentUser.id}`) {
          navigate(0)
        }
        else {
          navigate('/')
        }
      }
      setIsloading(false)
    }
    catch (err) {
      console.log(err)
    }
  }

  if (isLoading) {
    return <Loader isLoading={ isLoading} />
  }
  return (
    <Link className='btn sm danger' onClick={()=>removePost(postId)}>Delete</Link>
  )
}

export default DeletePost