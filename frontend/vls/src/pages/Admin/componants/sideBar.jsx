import React, { useEffect } from 'react';
import { BsGrid1X2Fill, BsFillPlusCircleFill, BsXDiamondFill, BsGraphUp, BsPeopleFill, BsEnvelopeFill } from 'react-icons/bs';
import logo from '../../Login/assets/logo.png';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchPermission = async () => {
            try {
                const email = Cookies.get('email');
                const response = await axios.post('http://localhost:6500/check-permission', { email });
                const premission = response.data.data.premission;

                if (premission === "company") {
                    setMenuItems([
                        { path: '/homeCompany', icon: BsGrid1X2Fill, label: 'Dashboard' },
                        { path: '/newProcess', icon: BsFillPlusCircleFill, label: 'New Process' },
                        { path: '/processCompany', icon: BsXDiamondFill, label: 'Process' },
                        { path: '/analyticsCompany', icon: BsGraphUp, label: 'Analytics' },
                        { path: '/customersCompany', icon: BsPeopleFill, label: 'Customers' },
                        { path: '/contactCompany', icon: BsEnvelopeFill, label: 'Contact' }
                    ]);
                } else {
                    setMenuItems([
                        { path: '/homeAdmin', icon: BsGrid1X2Fill, label: 'Dashboard' },
                        { path: '/processAdmin', icon: BsXDiamondFill, label: 'Process' },
                        { path: '/analyticsAdmin', icon: BsGraphUp, label: 'Analytics' },
                        { path: '/customersAdmin', icon: BsPeopleFill, label: 'Customers' },
                        { path: '/contactAdmin', icon: BsEnvelopeFill, label: 'Contact' }
                    ]);
                }
            } catch (error) {
                console.error('Error fetching permission:', error);
            }
        };

        fetchPermission();
    }, []);

    const [menuItems, setMenuItems] = React.useState([]);

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
                {menuItems.map((item, index) => (
                    <li className='sidebar-list-item' key={index} data-testid={`link-${item.label.toLowerCase()}`}>
                        <a onClick={() => navigate(item.path, { replace: true })}>
                            <item.icon className='icon' /> {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
