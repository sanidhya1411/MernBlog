import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({isLoading}) => {
  return (
    <div className='loader'>
      <div className="loader_image">
        <ClipLoader
        color={'#0c0c22'}
        loading={isLoading}
        size={50}
        />
      </div>
    </div>
 
  )
}

export default Loader