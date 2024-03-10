import React, { useEffect,useContext } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../images/logo.png'
import { FaBars } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import { useState } from 'react'
import { UserContext } from '../context/userContext'


const Header = () => {

    const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800 ? true : false)
    const {currentUser}=useContext(UserContext)
    
    const handleResize = () => {
        if (window.innerWidth >= 800) {
            setIsNavShowing(true)
        }
        else {
            setIsNavShowing(false)
        }
    }

    const closeNavhandler = () => {
        if (window.innerWidth < 800) {
            setIsNavShowing(false)
        }
    }

    useEffect(() => {
        // Add event listener on component mount
        window.addEventListener('resize', handleResize);
    
        // Remove event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };

    }, []);


    return (
        <nav>
            <div className="container nav_container">
                <Link to='/' className='nav_logo' onClick={closeNavhandler}>
                    <img src={Logo} alt="" />
                </Link>
                {currentUser?.id &&  isNavShowing&&<ul className='nav_menu'>
                    <li><Link to={`/profile/${currentUser.id}`} onClick={closeNavhandler}>{currentUser?.name}</Link></li>
                    <li><Link to='/create' onClick={closeNavhandler}>Create Post</Link></li>
                    <li><Link to='/authors' onClick={closeNavhandler}>Authors</Link></li>
                    <li><Link to='/logout' onClick={closeNavhandler}>Logout</Link></li>
                </ul>}
                {!currentUser?.id &&  isNavShowing&&<ul className='nav_menu'>
                    <li><Link to='/authors' onClick={closeNavhandler}>Authors</Link></li>
                    <li><Link to='/login' onClick={closeNavhandler}>Login</Link></li>
                </ul>}
                <button className='nav_toggle-btn' onClick={()=>setIsNavShowing(!isNavShowing)}>
                    {isNavShowing?<AiOutlineClose />:<FaBars/>}
                </button>
            </div>
      </nav>
  )
}

export default Header