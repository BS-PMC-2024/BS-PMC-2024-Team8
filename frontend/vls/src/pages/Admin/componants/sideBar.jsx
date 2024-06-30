import React from 'react';
import { BsGrid1X2Fill, BsXDiamondFill, BsGraphUp, BsPeopleFill, BsEnvelopeFill } from 'react-icons/bs';
import logo from '../../Login/assets/logo.png';
import { useNavigate } from 'react-router-dom';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
    const navigate = useNavigate();

    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <div>
                        <img src={logo} style={{ width: '5rem', marginLeft: '1rem', marginBottom: '1rem' }} alt="Example" />
                    </div>
                    Nicer Debt
                </div>
                <span className='icon close_icon' onClick={OpenSidebar} data-testid="close-icon">X</span>
            </div>

            <ul className='sidebar-list'>
                <li className='sidebar-list-item' data-testid="link-dashboard">
                    <a onClick={() => navigate('/homeAdmin', { replace: true })}>
                        <BsGrid1X2Fill className='icon' /> Dashboard
                    </a>
                </li>
                <li className='sidebar-list-item' data-testid="link-process">
                    <a onClick={() => navigate('/processAdmin', { replace: true })}>
                        <BsXDiamondFill className='icon' /> Process
                    </a>
                </li>
                <li className='sidebar-list-item' data-testid="link-analytics">
                    <a onClick={() => navigate('/analyticsAdmin', { replace: true })}>
                        <BsGraphUp className='icon' /> Analytics
                    </a>
                </li>
                <li className='sidebar-list-item' data-testid="link-customers">
                    <a onClick={() => navigate('/customersAdmin', { replace: true })}>
                        <BsPeopleFill className='icon' /> Customers
                    </a>
                </li>
                <li className='sidebar-list-item' data-testid="link-contact">
                    <a onClick={() => navigate('/contactAdmin', { replace: true })}>
                        <BsEnvelopeFill className='icon' /> Contact
                    </a>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
