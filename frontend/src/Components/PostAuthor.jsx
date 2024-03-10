import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../images/avatar1.jpg'
import axios from 'axios'
import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


const PostAuthor = ({ createdAt, authorId }) => {
  
  const [author, setAuthor] = useState({})
  useEffect(() => {
    const getAuthor = async () => {
      try { 
        const response = await axios.get(`http://localhost:5000/api/users/${authorId}`)
        setAuthor(response?.data)
      }
      catch (err) {
        console.log(err)
      }
    }
    getAuthor()
  },[])
  return (
      <Link to={`/posts/users/${authorId}`} className='post_author'>
          <div className="post_author-avatar">
              <img src={author?.avatar} alt="" />
          </div>
          <div className="post_author-details">
              <h5>By : { author?.name}</h5>
              <small><ReactTimeAgo date={new Date(createdAt)} locale='en-Us'/></small>
          </div>
    </Link>
  )
}

export default PostAuthor