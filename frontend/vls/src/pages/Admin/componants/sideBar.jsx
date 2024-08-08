import React, { useEffect } from "react";
import {
  BsGrid1X2Fill,
  BsFillPlusCircleFill,
  BsXDiamondFill,
  BsGraphUp,
  BsPeopleFill,
  BsEnvelopeFill,
  BsPersonBoundingBox
} from "react-icons/bs";
import logo from "../../Login/assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location


  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const email = Cookies.get("email");
        const response = await axios.post(
          "http://localhost:6500/check-permission",
          { email }
        );
        const premission = response.data.data.premission;

        if (premission === "company") {
          setMenuItems([
            { path: "/homeCompany", icon: BsGrid1X2Fill, label: "Dashboard" },
            {
              path: "/newProcess",
              icon: BsFillPlusCircleFill,
              label: "New Process",
            },
            { path: "/processCompany", icon: BsXDiamondFill, label: "Process" },
            { path: "/analyticsCompany", icon: BsGraphUp, label: "Analytics" },
            {
              path: "/customersCompany",
              icon: BsPeopleFill,
              label: "Customers",
            },
            { path: "/contactCompany", icon: BsEnvelopeFill, label: "Contact" },
          ]);
        } else {
          setMenuItems([
            { path: "/homeAdmin", icon: BsGrid1X2Fill, label: "Dashboard" },
            { path: "/processAdmin", icon: BsXDiamondFill, label: "Process" },
            { path: "/analyticsAdmin", icon: BsGraphUp, label: "Analytics" },
            { path: "/customersAdmin", icon: BsPeopleFill, label: "Customers" },
            { path: "/Clients", icon: BsPersonBoundingBox, label: "Clients" },
            { path: "/contactAdmin", icon: BsEnvelopeFill, label: "Contact" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching permission:", error);
      }
    };

    fetchPermission();
  }, []);

  const iconColors = {
    "/homeCompany": "#007bff",
    "/newProcess": "#D4AF37",
    "/processCompany": "#dc3545",
    "/analyticsCompany": "#4CAF50",
    "/customersCompany": "#17a2b8",
    "/contactCompany": "#ff6f61",
    "/homeAdmin": "#007bff",
    "/processAdmin": "#dc3545",
    "/analyticsAdmin": "#4CAF50",
    "/customersAdmin": "#17a2b8",
    "/contactAdmin": "#ff6f61",
  };

  const [menuItems, setMenuItems] = React.useState([]);

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
      
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <div>
            <img
              src={logo}
              style={{
                width: "5rem",
                marginLeft: "1rem",
                marginBottom: "1rem",
              }}
              alt="Example"
            />
          </div>
          Nicer Debt
        </div>
        <span
          className="icon close_icon"
          onClick={OpenSidebar}
          data-testid="close-icon"
        >
          X
        </span>
      </div>

      <ul className="sidebar-list">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const iconColor = iconColors[item.path] || "#white"; // Default to white if no color found

          return (
            <li
              className="sidebar-list-item"
              key={index}
              data-testid={`link-${item.label.toLowerCase()}`}
              onClick={() => navigate(item.path, { replace: true })}
              style={{ cursor: 'pointer', marginLeft:'5px' }}
            >
              <item.icon
                className="icon"
                style={{ color: isActive ? iconColor : "#white", marginRight: '12px' }} // Apply color based on active state
              />
              {item.label}
            </li>
          );
        })}
      </ul>

    </aside>
  );
}

export default Sidebar;
