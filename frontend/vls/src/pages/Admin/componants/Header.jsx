import React from 'react'
import 
 {BsPower , BsJustify}
 from 'react-icons/bs'
 import Cookies from 'js-cookie';
 
 function Header({OpenSidebar}) {
  const handleLogOut = () => {
    Cookies.remove('email');
    window.location.href = '/';
}
  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
        </div>
        <div className='header-right'>
            <BsPower className='icon' onClick={handleLogOut}/>
        </div>
    </header>
  )
}

export default Header