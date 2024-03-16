import React from 'react'
import { useState,useContext,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import axios from 'axios'
import Loader from '../Components/Loader'
import DeletePost from './DeletePost'



const Dashboard = () => {
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)


  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token
  const id = currentUser?.id;

  useEffect(() => {
  if (!token) {
    navigate('/login')
  }
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/users/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
        setPosts(response.data)
      }
      catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    fetchPosts()
  }, [id])
  
  if (isLoading) {
    return <Loader isLoading={isLoading} />
  }
  
  return (
    <section className='dashboard'>
      {
        posts.length ? <div className='container dashboard_container'>
          {
            posts.map(post => {
              return <article key={post._id} className='dashboard_post'>
                <div className="dashboard_post-info">
                  <div className="dashboard_post-thumbnail">
                    <img src={post.thumbnail} alt="" />
                  </div>
                  <h5>{post.title}</h5>
                </div>
                <div className="dashboard_post-actions">
                  <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
                  <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                  <DeletePost postId={post._id} />
                </div>
            </article>
            })
          }
        </div> : <div> </div>
      }
    </section>
  )
}

export default Dashboard