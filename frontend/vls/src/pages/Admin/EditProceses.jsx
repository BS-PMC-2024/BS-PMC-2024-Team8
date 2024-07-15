import React, { useEffect, useState } from "react";
import Header from "./componants/Header";
import Sidebar from "./componants/sideBar";
import axios from "axios";
import Modal from "./componants/Modal";
import { useLocation, useNavigate } from "react-router-dom";

import "./stylesAdmin.css";

const EditProceses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { process } = location.state || {}; // Destructure 'process' correctly and handle undefined state
  const [editedProceses, setEditedProceses] = useState({ ...process });
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  useEffect(() => {
    if (process) {
      setEditedProceses({ ...process });
    }
  }, [process]);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProceses({ ...editedProceses, [name]: value });
  };

  const handleSave = async () => {
    try {
      console.log(editedProceses._id)
      const response = await axios.put(
        `http://localhost:6500/Proceses/${editedProceses._id}`,
        editedProceses
      );
      if (response.status === 200) {
        alert("Process updated successfully");
        navigate("/processAdmin");
      } else {
        console.error("Failed to update Process:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating Process:", error);
    }
  };
  

  const handleCancel = () => {
    navigate("/processAdmin");
  };

  if (!process) {
    return <div>No process data found</div>; // Handle case where process data is missing
  }

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <main className="main-container">
        <Modal>
          <h2>Edit Proceses</h2>
          <form>
            <label>
              Company Name:
              <input
                type="text"
                name="cname"
                value={editedProceses.cname}
                onChange={handleChange}
              />
            </label>
            <label>
              Money Collected:
              <input
                type="text"
                name="moneyC"
                value={editedProceses.moneyC}
                onChange={handleChange}
              />
            </label>
            <label>
              People Collected:
              <input
                type="text"
                name="peopleC"
                value={editedProceses.peopleC}
                onChange={handleChange}
              />
            </label>
            <label>
              People Remaining:
              <input
                type="text"
                name="peopleR"
                value={editedProceses.peopleR}
                onChange={handleChange}
              />
            </label>
            <label>
            Status:
              <input
                type="text"
                name="status"
                value={editedProceses.status}
                onChange={handleChange}
              />
            </label>
            <label>
            Date:
              <input
                type="text"
                name="date"
                value={editedProceses.date}
                onChange={handleChange}
              />
            </label>
            <label>
            Sector:
              <input
                type="text"
                name="sector"
                value={editedProceses.sector}
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

export default EditProceses;
