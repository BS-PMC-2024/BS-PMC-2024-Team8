import React, { useEffect, useState } from "react";
import Header from "./componants/Header";
import {
  BsPeopleFill,
  BsCheckCircle,
  BsArrowRepeat,
  BsCash,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import "./stylesAdmin.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Sidebar from "./componants/sideBar";
import "./Customers_table.css";
import EditCustomer from "./EditCustomer";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function CUSTOMERS() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const checkAdminPermission = async () => {
      const email = Cookies.get("email");

      if (!email) {
        navigate("/", { replace: true });
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:6500/check-permission",
          { email }
        );

        if (response.data.data.premission !== "admin") {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error checking admin permission:", error);
        navigate("/", { replace: true });
      }
    };
    checkAdminPermission();
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:6500/allusers");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const handleDelete = async (email) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ textAlign: 'center', padding: '20px', background: '#222831', borderRadius: '8px', color: '#fff' }}>
            <h1 style={{ marginBottom: '20px' }}>Warning</h1>
            <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this customer?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={async () => {
                  try {
                    const response = await axios.delete(`http://localhost:6500/user/${encodeURIComponent(email)}`);
                    if (response.status === 200) {
                      setUsers(users.filter((user) => user.email !== email));
  
                      setTimeout(() => {
                        toast.success('Customer deleted successfully', {
                          position: "top-right",
                          autoClose: 2500,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "colored",
                          transition: Slide,
                        });
                      }, 0);
  
                    } else {
                      toast.error(`Failed to delete customer: ${response.data.message}`, {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Slide,
                      });
                    }
                  } catch (error) {
                    console.error("Error deleting customer:", error);
                    toast.error("Error deleting customer", {
                      position: "top-right",
                      autoClose: 2500,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                      transition: Slide,
                    });
                  } finally {
                    onClose(); // Close the confirm alert after handling the response
                  }
                }}
                style={{
                  backgroundColor: '#059212',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  toast.info('Customer deletion canceled', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide,
                  });
                  onClose(); // Close the confirm alert on cancel
                }}
                style={{
                  backgroundColor: '#C40C0C',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        );
      },
      closeOnClickOutside: false,
    });
  };

  const handleEdit = (user) => {
    navigate("/EditCustomer", { state: { user } });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <main className="main-container">
        <div className="main-title">
          <h3>Customers</h3>
        </div>
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Company</th>
                <th>Permission</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.country}</td>
                  <td>{user.company}</td>
                  <td>{user.premission}</td>
                  <td>
                    <button
                      data-testid="edit-button"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(user.email)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {showModal && (
        <EditCustomer
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}

export default CUSTOMERS;
