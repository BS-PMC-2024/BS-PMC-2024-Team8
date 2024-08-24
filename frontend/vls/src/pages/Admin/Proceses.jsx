import React, { useEffect, useState } from "react";
import Header from "./componants/Header";
import Sidebar from "./componants/sideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./stylesAdmin.css";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Proceses() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState([]);
  const [filteredProcesses, setFilteredProcesses] = useState([]);
  const [Cname, setCname] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

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
        toast.error("Failed to fetch processes", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    };
    fetchProcesses();
  }, []);

  const handleDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ textAlign: 'center', padding: '20px', background: '#222831', borderRadius: '8px', color: '#fff' }}>
            <h1 style={{ marginBottom: '20px' }}>Warning</h1>
            <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this process?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={async () => {
                  try {
                    const response = await axios.delete(`http://localhost:6500/deleteprocess/${id}`);
                    if (response.status === 200) {
                      setProcesses((prevProcesses) =>
                        prevProcesses.filter((process) => process._id !== id)
                      );
                      setFilteredProcesses((prevFilteredProcesses) =>
                        prevFilteredProcesses.filter((process) => process._id !== id)
                      );
  
                      // Trigger the success toast message in a separate block
                      setTimeout(() => {
                        toast.success('Process deleted successfully', {
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
                      toast.error(`Failed to delete process: ${response.data.message}`, {
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
                    console.error("Error deleting process:", error);
                    toast.error("Error deleting process", {
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
                  toast.info('Process deletion canceled', {
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

  const handleEdit = (process) => {
    navigate("/EditProceses", { state: { process } });
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
    const filtered = processes.filter((process) => {
      const matchesCname = process.cname
        .toLowerCase()
        .includes(cname.toLowerCase());

      // Convert the date format from DD/MM/YYYY to YYYY-MM-DD
      const [day, month, year] = process.date.split("/");
      const processDate = new Date(`${year}-${month}-${day}`);

      const matchesDate =
        (!startDate || processDate >= new Date(startDate)) &&
        (!endDate || processDate <= new Date(endDate));
      return matchesCname && matchesDate;
    });
    setFilteredProcesses(filtered);
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
          <div className="main-title">
            <h3>Processes</h3>
          </div>
          <div>
            <input
              type="text"
              value={Cname}
              onChange={handleCnameChange}
              placeholder="Search by company name"
              className="short-input"
              style={{ marginBottom: "10px", marginRight: "4rem", borderRadius: "5px" }}
            />
            <label style={{ marginBottom: "10px", marginRight: "2rem" }}>from Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Start Date"
              className="date-input"
              style={{ marginBottom: "10px", marginRight: "4rem", borderRadius: "5px" }}
            />
            <label style={{ marginBottom: "10px", marginRight: "2rem" }}>to Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="End Date"
              className="date-input"
              style={{ marginBottom: "10px", marginRight: "4rem", borderRadius: "5px" }}
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
                  <th>Status</th>
                  <th>Date</th>
                  <th>Sector</th>
                  <th></th>
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
                      <button
                        className="delete"
                        onClick={() => handleDelete(process._id)}
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
      </div>
    </>
  );
}

export default Proceses;
