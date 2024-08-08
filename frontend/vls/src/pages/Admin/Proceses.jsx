import React, { useEffect, useState } from "react";
import Header from "./componants/Header";
import Sidebar from "./componants/sideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./stylesAdmin.css";
import EditProceses from "./EditProceses";


function Proceses() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState([]);
  const [filteredProcesses, setFilteredProcesses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [Cname, setCname] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [selectedprocesses, setSelectedprocesses] = useState(null);


  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await axios.get("http://localhost:6500/allprocesses");
        setProcesses(response.data.processes);
        setFilteredProcesses(response.data.processes); // Initially, all processes are shown
      } catch (error) {
        console.error("Error fetching processes:", error);
      }
    };
    fetchProcesses();
  }, []);

  const handleDelete = async (id) => {
     // הצגת הודעת אישור למחיקה
    const confirmed = window.confirm("Are you sure you want to delete this process?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:6500/deleteprocess/${id}`);
      if (response.status === 200) {
        setProcesses(processes.filter((process) => process._id !== id));
        setFilteredProcesses(filteredProcesses.filter((process) => process._id !== id));
        console.log("Process deleted successfully");
        window.confirm("Process deleted successfully");
      } else {
        console.error("Failed to delete process:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting process:", error);
    }
  };
  

  const handleEdit = (process) => {
    navigate("/EditProceses", { state: { process } });
  };
  

 
  const handleSaveProcess = (updatedProcess) => {
    setProcesses(
      processes.map((process) => (process._id === updatedProcess._id ? updatedProcess : process))
    );
    setFilteredProcesses(
      filteredProcesses.map((process) => (process._id === updatedProcess._id ? updatedProcess : process))
    );
  };

  const handleCnameChange = (e) => {
    const value = e.target.value;
    setCname(value);
    filterProcesses(value, startDate, endDate);
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    filterProcesses(Cname, value, endDate);
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);
    filterProcesses(Cname, startDate, value);
  };

  const filterProcesses = (cname, startDate, endDate) => {
    const filtered = processes.filter(process => {
      const matchesCname = process.cname.toLowerCase().includes(cname.toLowerCase());
      
      // Convert the date format from DD/MM/YYYY to MM/DD/YYYY
      const [day, month, year] = process.date.split('/');
      const processDate = new Date(`${year}-${month}-${day}`);
      
      const matchesDate = (!startDate || processDate >= new Date(startDate)) &&
                          (!endDate || processDate <= new Date(endDate));
      return matchesCname && matchesDate;
    });
    setFilteredProcesses(filtered);
  };

  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveUser = (updatedUser) => {
    setProcesses(
        processes.map((process) => (process._id === updatedUser._id ? updatedUser : process))
    );
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className="main-container">
        <div className="main-title">
          <h3>Processes</h3>
        </div>
        <div>
          <input
            type="text"
            value={Cname}
            onChange={handleCnameChange}
            placeholder="Search by cname"
            className="short-input"
          />
          <label>from Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            placeholder="Start Date"
            className="date-input"
          />
          <label>to Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            placeholder="End Date"
            className="date-input"
          />
        </div>
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
              <th>Company Name</th>
                <th>Money Collected</th>
                <th>People Collected</th>
                <th>People Remaining</th>
                <th>status</th>
                <th>date</th>
                <th>sector</th>
                <th>Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredProcesses.map((process) => (
                <tr key={process._id}>
                  <td>{process.cname}</td>
                  <td>{process.moneyC}</td>
                  <td>{process.peopleC}</td>
                  <td>{process.peopleR}</td>
                  <td>{process.status}</td>
                  <td>{process.date}</td>
                  <td>{process.sector}</td>
                  <td>
                    <button onClick={() => handleEdit(process)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(process._id)}>
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
        <EditProceses
          user={selectedprocesses}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}

export default Proceses;
