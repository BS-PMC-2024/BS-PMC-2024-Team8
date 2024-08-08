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
  const { process } = location.state || {};
  const [editedProceses, setEditedProceses] = useState({ ...process });
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateDate = (date) => {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!datePattern.test(date)) {
      return false;
    }
  
    const [_, day, month, year] = date.match(datePattern);
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
  
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
      return false;
    }
  
    if ([4, 6, 9, 11].includes(monthNum) && dayNum > 30) {
      return false;
    }
  
    if (monthNum === 2) {
      const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0);
      if (dayNum > (isLeapYear ? 29 : 28)) {
        return false;
      }
    }
  
    return true;
  };

  const validateForm = () => {
    const { cname, moneyC, peopleC, peopleR, status, date, sector } = editedProceses;
    const errors = {};

    if (!cname) errors.cname = "Company Name is required.";
    if (!moneyC || isNaN(moneyC)) errors.moneyC = "Money Collected must be a valid number.";
    if (!peopleC || isNaN(peopleC)) errors.peopleC = "People Collected must be a valid number.";
    if (!peopleR || isNaN(peopleR)) errors.peopleR = "People Remaining must be a valid number.";
    if (!status) errors.status = "Status is required.";
    if (!sector) errors.sector = "Sector is required.";

    if (!date) {
      errors.date = "Date is required.";
    } else if (!validateDate(date)) {
      errors.date = "Invalid date format. Please enter a valid date in the format dd/mm/yyyy.";
    }

    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log(editedProceses._id);
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
    return <div>No process data found</div>;
  }

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className="main-container">
        <Modal>
          <h2>Edit Process </h2>
          <form>
            <div className="form-row">
              <label>
                Company Name:
                <input
                  type="text"
                  name="cname"
                  value={editedProceses.cname}
                  onChange={handleChange}
                />
              </label>
              {errors.cname && <span className="error">{errors.cname}</span>}
            </div>
            <div className="form-row">
              <label>
                Money Collected:
                <input
                  type="text"
                  name="moneyC"
                  value={editedProceses.moneyC}
                  onChange={handleChange}
                />
              </label>
              {errors.moneyC && <span className="error">{errors.moneyC}</span>}
            </div>
            <div className="form-row">
              <label>
                People Collected:
                <input
                  type="text"
                  name="peopleC"
                  value={editedProceses.peopleC}
                  onChange={handleChange}
                />
              </label>
              {errors.peopleC && <span className="error">{errors.peopleC}</span>}
            </div>
            <div className="form-row">
              <label>
                People Remaining:
                <input
                  type="text"
                  name="peopleR"
                  value={editedProceses.peopleR}
                  onChange={handleChange}
                />
              </label>
              {errors.peopleR && <span className="error">{errors.peopleR}</span>}
            </div>
            <div className="form-row">
              <label>
                Status:
                <input
                  type="text"
                  name="status"
                  value={editedProceses.status}
                  onChange={handleChange}
                />
              </label>
              {errors.status && <span className="error">{errors.status}</span>}
            </div>
            <div className="form-row">
              <label>
                Date:
                <input
                  type="text"
                  name="date"
                  value={editedProceses.date}
                  onChange={handleChange}
                />
              </label>
              {errors.date && <span className="error">{errors.date}</span>}
            </div>
            <div className="form-row">
              <label>
                Sector:
                <input
                  type="text"
                  name="sector"
                  value={editedProceses.sector}
                  onChange={handleChange}
                />
              </label>
              {errors.sector && <span className="error">{errors.sector}</span>}
            </div>
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