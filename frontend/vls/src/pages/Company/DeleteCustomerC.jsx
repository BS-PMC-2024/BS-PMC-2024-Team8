import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Admin/componants/Header";
import Sidebar from "../Admin/componants/sideBar";
import Modal from "../Admin/componants/Modal";
import "../Admin/stylesAdmin.css";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { TextField, Button } from "@mui/material";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteCustomerC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { person } = location.state;
  const [editedPerson, setEditedPerson] = useState({ ...person });
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [mes, setMes] = useState("");

  useEffect(() => {
    setEditedPerson({ ...person });
  }, [person]);

  useEffect(() => {
    emailjs.init("GBJlmTqEGrwbhN6rN");
  }, []);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setMes(value);
  };
  const handleCancel = () => {
    navigate("/customersCompany");
  };

  const handleSubmit = async (e) => {
    const serviceId = "service_0x2l75s";
    const templateId = "template_wbo9ytj";
    try {
      await emailjs.send(serviceId, templateId, {
        mes: mes,
        name: person.Name,
        cname: person.company,
        email: person.Mail,
      });
      toast.success('Email successfully sent. Check your inbox.', {
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
    } catch (error) {
      return toast.error(`Failed to send email. Please try again`, {
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
  };

  return (
    <>
    ToastContainer
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <main className="main-container">
        <Modal>
          <h2>Delete Debtor</h2>
          <form>
            <label>
              Please Specify The Reason <br></br> For Deleting This Debtor:
              <br></br>
              <TextField
                label="Message"
                variant="outlined"
                id="description"
                name="description"
                value={mes}
                onChange={handleInputChange}
                required
                fullWidth
                multiline
                rows={10} // Adjust the number of rows as needed
                InputProps={{
                  style: { minHeight: "300px", width: "550px" }, // Set a minimum height for the input
                }}
                InputLabelProps={{
                  style: { fontWeight: "bold", color: "#9e9ea4" }, // Adjust label styles as needed
                }}
                sx={{ backgroundColor: "#FFFFFF" }}
                style={{ marginTop: "19px" }}
              />
            </label>

            <div className="button-group">
              <button
                className="button save-button"
                type="button"
                onClick={handleSubmit}
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

export default DeleteCustomerC;
