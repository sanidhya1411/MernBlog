import React, { useState,useEffect, useContext } from 'react'
import PostAuthor from '../Components/PostAuthor'
import { Link, useParams } from 'react-router-dom'
import Thumbnail from '../images/blog1.jpg'
import Loader from '../Components/Loader'
import DeletePost from './DeletePost'
import { UserContext } from '../context/userContext'
import axios from 'axios'

const Postdetail = () => {

  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)

  const { currentUser } = useContext(UserContext)

  useEffect(() => {

    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://mernblog-ypmi.onrender.com/api/posts/${id}`)

        setPost(response.data)
      }
      catch (error) {
        setError(error)
      }
      setIsLoading(false)
    }
    getPost()
  }, [])
  
  if (isLoading) {
    return <Loader isLoading={isLoading} />
  }
 
  
  
  return (
    <section className='post-detail'>
      {error && <p className='error'>{ error}</p>}
      <div className="container post-detail_container">
        <div className="post-detail_header">
          {post && <PostAuthor createdAt={post.createdAt} authorId={post.creator} />} 
          {currentUser?.id == post?.creator && <div className="post-detail_buttons">
            <Link to={`/posts/${id}/edit`} className='btn sm primary'>Edit</Link>
            <DeletePost postId={id} />
          </div>}
        </div>
        <h1 className='title'>{ post?.title}</h1>
        <div className="post-detail_thumbnail">
          <img src={post?.thumbnail} alt="" />
        </div>
        <p dangerouslySetInnerHTML={{__html:post?.description}} ></p>
      </div>
    </section>
  )
}

export default Postdetail