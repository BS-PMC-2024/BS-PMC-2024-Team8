import React from 'react';
import { BsPower, BsJustify } from 'react-icons/bs';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Header({ OpenSidebar }) {
  const handleLogOut = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ textAlign: 'center', padding: '20px',background:'#222831',borderRadius:'3%' }}>
            <p style={{ fontSize: '16px', marginBottom: '15px' }}>
              Are you sure you want to LogOut?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => {
                  onClose();
                  Cookies.remove('email');
                  window.location.href = '/';
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#059212',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Yes
              </button>
              <button
                onClick={() => onClose()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#C40C0C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                No
              </button>
            </div>
          </div>
        );
      },
      closeOnClickOutside: false,
    });
  };

  return (
    <header className='header'>
      <ToastContainer />
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
      <div className='header-left'>
      </div>
      <div className='header-right'>
        <BsPower className='icon' onClick={handleLogOut} />
      </div>
    </header>
  );
}

export default Header;
