import React,{useState,useEffect} from 'react'
import PostItem from '../Components/PostItem'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Loader from '../Components/Loader'


const CategoryPosts = () => {

  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const {category}=useParams()

  useEffect(() => {
      const fetchPosts = async () => {
          setIsLoading(true)
          try {
            const response = await axios.get(`http://localhost:5000/api/posts/categories/${category}`)
            setPosts(response?.data)            
          }
          catch (err) {
              console.log(err)
          }
          setIsLoading(false)
      }
      fetchPosts()
  }, [category])
    
    if (isLoading) {
        return <Loader isLoading={isLoading}/>
    }

  return (
    <section className='category-posts'>
          {posts.length>0?<div className='container category-posts_container'>
              {
                  posts.map(({ _id:id, thumbnail, category,title, description, creator,createdAt }) => <PostItem key={id} postId={id} thumbnail={thumbnail} category={category} title={title} desc={description} creator={creator} createdAt={createdAt} />)
              }
          </div>:<h2 className='center'>No Posts Found</h2>}
    </section>
  )
}

export default CategoryPosts