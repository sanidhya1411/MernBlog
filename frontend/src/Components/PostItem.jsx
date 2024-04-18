import React from 'react'
import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'


const PostItem = ({ postId, title, category, desc, creator, thumbnail,createdAt}) => {
    
    const shortDesc = desc.length > 145 ? desc.substr(0, 145) + '...' : desc
    const shortTitle=title.length>25?title.substr(0,25)+'...':title
  return (
      <article className='post'>
          <div className='post_display'>
          <div className="post_thumbnail">
              <img src={thumbnail} alt={title} />
          </div>
          <div className="post_content">
              <Link to={`/posts/${postId}`}>
                  <h3>{ shortTitle}</h3>
              </Link>
              <p dangerouslySetInnerHTML={{__html:shortDesc}}></p>
          </div>
          </div>
          <div className="post_footer">
            <PostAuthor authorId={creator} createdAt={createdAt} />
            <Link to={`/posts/categories/${category}`} className='btn category'>{category }</Link>
          </div>
    </article>
  )
}

export default PostItem