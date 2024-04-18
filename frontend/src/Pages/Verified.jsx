import React,{useState,useEffect} from 'react'
import { Link ,useNavigate,useParams} from 'react-router-dom'
import Loader from '../Components/Loader'
import axios from 'axios'


const Verified = () => {

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(null)
    const {token}=useParams()

    useEffect(() => {
        const verifymail = async () => {
            setIsLoading(true)
            try {
              const response = await axios.patch(`http://localhost:5000/api/users/verified/${token}`)
            }
            catch (err) {
                setError(err.response.data.message)
            }
            setIsLoading(false)
        }
      verifymail();
    }, [])
      
      if (isLoading) {
          return <Loader isLoading={isLoading}/>
    }
    
  return (
    <section className='error-page'>
      <div className='center'>
        <Link to='/login' className='btn primary'>Go Back Home</Link>
        {!error ? <h2>Mail Verified</h2> : <h2>{error}</h2>}
      </div>
    </section>
  )
}

export default Verified