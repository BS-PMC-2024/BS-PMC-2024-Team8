import React, { useEffect, useState } from "react";
import Header from "../Admin/componants/Header";
import Sidebar from "../Admin/componants/sideBar";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../Admin/stylesAdmin.css";
import "../Admin/Customers_table.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Clients = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [people, setPeople] = useState([]);
  const [nameQuery, setNameQuery] = useState("");
  const [companyQuery, setCompanyQuery] = useState("");
  const navigate = useNavigate();

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

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
        if (!response.data.permission === "admin") {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error checking company permission:", error);
        navigate("/", { replace: true });
      }
    };
    checkAdminPermission();
  }, [navigate]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6500/clients`
        );
        setPeople(response.data.clients);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };
    fetchPeople();
  }, []);
  const handleDelete = async (person) => {
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
                    const response = await axios.delete(`http://localhost:6500/person/${person._id}`);                    ;
                    if (response.status === 200) {
                      setPeople((people) => people.filter((p) => p._id !== person._id));  
                      setTimeout(() => {
                        toast.success('Person deleted successfully', {
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
                      toast.error(`Failed to delete person: ${response.data.message}`, {
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
                    console.error("Error deleting person: ", error);
                    toast.error("Error deleting person", {
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
                    onClose(); 
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
                  toast.info('Person deletion canceled', {
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

  const handleNameSearch = (event) => {
    setNameQuery(event.target.value);
  };

  const handleCompanySearch = (event) => {
    setCompanyQuery(event.target.value);
  };

  const filteredPeople = people.filter((person) => {
    return (
      person.Name.toLowerCase().includes(nameQuery.toLowerCase()) &&
      person.company.toLowerCase().includes(companyQuery.toLowerCase())
    );
  });

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <main className="main-container">
        <div className="main-title">
          <h3 style={{fontSize:'21px'}}>Clients</h3>
        </div>
        <div className="search-bars" style={{width:'85%',marginLeft:'15px',marginBottom:'15px'}}>
          <input
            type="text"
            placeholder="Search by name"
            value={nameQuery}
            onChange={handleNameSearch}
          />
          <input
            type="text"
            placeholder="Search by company"
            value={companyQuery}
            onChange={handleCompanySearch}
          />
        </div>
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mail</th>
                <th>Debt</th>
                <th>Age</th>
                <th>City</th>
                <th>Date</th>
                <th>Phone</th>
                <th>Messages</th>
                <th>Discount</th>
                <th>Company</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPeople.map((person) => (
                <tr key={person._id}>
                  <td>{person.Name}</td>
                  <td>{person.Mail}</td>
                  <td>{person.Debt}</td>
                  <td>{person.Age}</td>
                  <td>{person.City}</td>
                  <td>{person.Date}</td>
                  <td>{person.Phone}</td>
                  <td>{person.Messages}</td>
                  <td>{person.Discount}</td>
                  <td>{person.company}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => handleDelete(person)}
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

export default Clients;
