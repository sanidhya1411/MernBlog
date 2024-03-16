import React, { useEffect, useState} from 'react'
import PostItem from './PostItem'
import Loader from './Loader'
import axios from 'axios'


const Posts = () => {

    const [posts, setPosts] = useState([])
    const [isLoading,setIsLoading]=useState(false)

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(`http://localhost:5000/api/posts`)
                setPosts(response?.data)
            }
            catch (err) {
                console.log(err)
            }
            setIsLoading(false)
        }
        fetchPosts()
    }, [])
    

  return (
      <section className='posts'>
          {posts.length>0?<div className='container posts_container'>
              {
                  posts.map(({ _id:id, thumbnail, category, description, creator, title,createdAt }) => <PostItem key={id} postId={id} thumbnail={thumbnail} category={category} title={title} desc={description} creator={creator} createdAt={createdAt} />)
              }
          </div>:isLoading? <Loader isLoading={isLoading} />:<div className='center'></div>}
    </section>
  )
}

export default Posts