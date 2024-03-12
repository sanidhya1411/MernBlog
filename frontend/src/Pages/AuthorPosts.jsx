import React,{useState,useEffect} from 'react'
import PostItem from '../Components/PostItem'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Loader from '../Components/Loader'

const AuthorPosts = () => {

  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const {id}=useParams()

  useEffect(() => {
      const fetchPosts = async () => {
          setIsLoading(true)
          try {
              const response = await axios.get(`https://mernblog-ypmi.onrender.com/api/posts/users/${id}`)
              setPosts(response?.data)
          }
          catch (err) {
              console.log(err)
          }
          setIsLoading(false)
      }
      fetchPosts()
  }, [])
    
    if (isLoading) {
        return <Loader isLoading={isLoading}/>
    }


  return (
  <section className='author-posts'>
          {posts && posts.length>0?<div className='container author_posts-container'>
              {
                  posts.map(({ _id:id, thumbnail, category, description, creator, title,createdAt }) => <PostItem key={id} postId={id} thumbnail={thumbnail} category={category} title={title} desc={description} creator={creator} createdAt={createdAt}  />)
              }
          </div>:<h2 className='center'>No posts Found</h2>}
    </section >
  )
}

export default AuthorPosts