import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Admin/componants/Header";
import Sidebar from "../Admin/componants/sideBar";
import Modal from "../Admin/componants/Modal";
import "../Admin/stylesAdmin.css";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  colors,
} from "@mui/material";

const EditCustomerC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { person } = location.state;
  const [editedPerson, setEditedPerson] = useState({ ...person });
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  useEffect(() => {
    setEditedPerson({ ...person });
  }, [person]);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPerson({ ...editedPerson, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:6500/person/${editedPerson._id}`,
        editedPerson
      );
      if (response.status === 200) {
        toast.success('Person updated successfully', {
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
      
        setTimeout(() => {
          navigate("/customersCompany");
        }, 1500); 
      }      
      else {
        return toast.error(`"Failed to update person`, {
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
      console.error("Error updating person:", error);
    }
  };

  const handleCancel = () => {
    navigate("/customersCompany");
  };

  return (
    <>
    <ToastContainer />
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <main className="main-container">
        <Modal>
          <h2>Edit Person</h2>
          <form>
            <label>
              Name:
              <input
                type="text"
                name="Name"
                value={editedPerson.Name}
                onChange={handleChange}
              />
            </label>
            <label>
              Mail:
              <input
                type="email"
                name="Mail"
                value={editedPerson.Mail}
                onChange={handleChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="City"
                value={editedPerson.City}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="Phone"
                value={editedPerson.Phone}
                onChange={handleChange}
              />
            </label>
            <div className="button-group">
              <button
                className="button save-button"
                type="button"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="button cancel-button"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
    </>
  );
};

export default EditCustomerC;
