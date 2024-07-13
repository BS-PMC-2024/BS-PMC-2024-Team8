import React from 'react';
import Header from '../Admin/componants/Header';
import Sidebar from '../Admin/componants/sideBar';
import { useState } from 'react';

const AnalyticsC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

    return (
        <div className='grid-container'>
          <Header OpenSidebar={OpenSidebar} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          <h1>Analytics C</h1>
        </div>
      );
};

export default AnalyticsC;