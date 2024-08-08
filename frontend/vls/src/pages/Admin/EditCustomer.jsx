import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./componants/Header";
import Sidebar from "./componants/sideBar";
import Modal from "./componants/Modal";
import "./stylesAdmin.css";
import Cookies from "js-cookie";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const EditCustomer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state;
  const [editedUser, setEditedUser] = useState({ ...user });
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
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

        if (!response.data.data.premission == "admin") {
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
    console.log(location.state.user);
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
        `http://localhost:6500/user/${editedUser.email}`,
        editedUser
      );
      if (response.status === 200) {
        alert("user updated succesfully");
        navigate("/customersAdmin");
      } else {
        alert("Failed to update user");
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
                style={{ marginRight: "10px" }}
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
            <FormControl fullWidth margin="normal">
              <InputLabel id="permission-label">Permission</InputLabel>
              <Select
                labelId="permission-label"
                name="permission"
                value={editedUser.premission}
                onChange={handleChange}
                label="Permission"
                style={{
                  background: "#9e9ea4",
                  marginLeft: "14px",
                }}
              >
                <MenuItem value="company">Company</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
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
