import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Admin/componants/Header";
import Sidebar from "../Admin/componants/sideBar";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';

const ProcessC = () => {
  const navigate = useNavigate();
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [processes, setProcesses] = useState([]);
  const [filteredProcesses, setFilteredProcesses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState("all");

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  function getCookie(val) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === val) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  useEffect(() => {
    const fetchProcesses = async () => {
      const company = getCookie("company");
      try {
        const response = await axios.get(
          `http://localhost:6500/allprocesses/${company}`
        );
        setProcesses(response.data.filteredProcesses);
        setFilteredProcesses(response.data.filteredProcesses); // Initially, all processes are shown
      } catch (error) {
        console.error("Error fetching processes:", error);
      }
    };
    fetchProcesses();
  }, []);

  useEffect(() => {
    const applyFilter = () => {
      let filtered = processes;

      if (filter !== "all") {
        filtered = filtered.filter(
          (process) => process.status.toLowerCase() === filter
        );
      }

      if (startDate) {
        filtered = filtered.filter((process) => {
          const [day, month, year] = process.date.split("/");
          const processDate = new Date(`${year}-${month}-${day}`);
          return processDate >= new Date(startDate);
        });
      }

      if (endDate) {
        filtered = filtered.filter((process) => {
          const [day, month, year] = process.date.split("/");
          const processDate = new Date(`${year}-${month}-${day}`);
          return processDate <= new Date(endDate);
        });
      }

      setFilteredProcesses(filtered);
    };

    applyFilter();
  }, [processes, filter, startDate, endDate]);
  
  const handleDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ textAlign: 'center', padding: '20px', background:'#222831',borderRadius:'3%' }}>
            <h1 style={{ marginBottom: '20px' }}>Warning</h1>
            <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this process?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={async () => {
                  try {
                    const response = await axios.delete(`http://localhost:6500/deleteprocess/${id}`);
                    if (response.status === 200) {
                      setProcesses(processes.filter((process) => process._id !== id));
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
                  }
                  onClose();
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
                  onClose();
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
      }
    });    
  };  
  const handleStrategy = (S) => {
    let Strategy;
    switch (S) {
      case "1":
        Strategy = "Focus on the bigger debt";
        break;
      case "2":
        Strategy = "Focus on the latest depts";
        break;
      case "3":
        Strategy = "Focus on the youngest debtors";
        break;
      case "4":
        Strategy = "Focus on the oldest debtors";
        break;
      default:
        Strategy = "Missing info";
    }
    return Strategy;
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
          <h3>{getCookie("company")} Processes</h3>
        </div>
        <div style={{marginBottom:'20px'}}>
          <label className="date-row"  style={{marginRight:"10px"}}>From Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            className="date-input"
            style={{borderRadius:"5px"}}
          />
          <label className="date-row"  style={{marginLeft:"20px",marginRight:"10px"}}>To Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            className="date-input"
            style={{borderRadius:"5px"}}
          />
          <div className="filter-button-div" style={{marginLeft:"20px"}}>
            <button
              className={`filter-button ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-button ${filter === "closed" ? "active" : ""}`}
              onClick={() => setFilter("closed")}
            >
              Closed
            </button>
            <button
              className={`filter-button ${filter === "opened" ? "active" : ""}`}
              onClick={() => setFilter("opened")}
            >
              Opened
            </button>
          </div>
        </div>
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Money Collected</th>
                <th>People Collected</th>
                <th>People Remaining</th>
                <th>Date</th>
                <th>Strategy</th>
                <th>Discount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProcesses.map((process) => (
                <tr key={process._id}>
                  <td>{process.moneyC}</td>
                  <td>{process.peopleC}</td>
                  <td>{process.peopleR}</td>
                  <td>{process.date}</td>
                  <td>{handleStrategy(process.strategy)}</td>
                  <td>{process.discount}</td>
                  <td>{process.status}</td>
                  <td>
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
  );
};

export default ProcessC;
