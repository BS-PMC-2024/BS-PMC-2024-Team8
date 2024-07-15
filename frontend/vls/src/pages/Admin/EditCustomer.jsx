import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./componants/Header";
import Sidebar from "./componants/sideBar";
import Modal from "./componants/Modal";
import "./stylesAdmin.css";

const EditCustomer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state;
  const [editedUser, setEditedUser] = useState({ ...user });
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:6500/user/${editedUser.email}`, // Use backticks for template literal
        editedUser
      );
      if (response.status === 200) {
        alert("User updated successfully");
        navigate("/customersAdmin");
      } else {
        console.error("Failed to update user:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    navigate("/customersAdmin");
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <main className="main-container">
        <Modal>
          <h2>Edit User</h2>
          <form>
            <label>
              Full Name:
              <input
                type="text"
                name="full_name"
                value={editedUser.full_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Country:
              <input
                type="text"
                name="country"
                value={editedUser.country}
                onChange={handleChange}
              />
            </label>
            <label>
              Company:
              <input
                type="text"
                name="company"
                value={editedUser.company}
                onChange={handleChange}
              />
            </label>
            <label>
              Permission:
              <input
                type="text"
                name="permission"
                value={editedUser.permission}
                onChange={handleChange}
              />
            </label>
            <div className="button-group">
              <button type="button" onClick={handleSave}>
                Save
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default EditCustomer;
