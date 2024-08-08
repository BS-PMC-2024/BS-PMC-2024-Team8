import React, { useEffect, useState } from "react";
import Header from "../Admin/componants/Header";
import Sidebar from "../Admin/componants/sideBar";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import EditCustomerC from "../Company/EditCustomerC";
import "../Admin/stylesAdmin.css";
import "../Admin/Customers_table.css";

const CustomersC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [people, setPeople] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const navigate = useNavigate();

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

  const company = getCookie("company");

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
        if (!response.data.permission === "company") {
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
          `http://localhost:6500/clients/${company}`
        );
        setPeople(response.data.clients);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };
    fetchPeople();
  }, []);

  const handleEdit = (person) => {
    navigate("/EditCustomerC", { state: { person } });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSavePerson = (updatedPerson) => {
    setPeople(
      people.map((person) =>
        person._id === updatedPerson._id ? updatedPerson : person
      )
    );
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
          <h3>PEOPLE</h3>
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
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person._id}>
                  <td>{person.Name}</td>
                  <td>
                    <a
                      href={`mailto:${person.Mail}`}
                      style={{
                        color: "#007bff",
                      }}
                      onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                      onMouseOut={(e) => e.target.style.textDecoration = "none"}
                    >
                      {person.Mail}
                    </a>
                  </td>
                  <td>{person.Debt}</td>
                  <td>{person.Age}</td>
                  <td>{person.City}</td>
                  <td>{person.Date}</td>
                  <td>{person.Phone}</td>
                  <td>{person.Messages}</td>
                  <td>{person.Discount}</td>
                  <td>
                    <button
                      data-testid="edit-button"
                      onClick={() => handleEdit(person)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {showModal && (
        <EditCustomerC
          person={selectedPerson}
          onClose={handleCloseModal}
          onSave={handleSavePerson}
        />
      )}
    </div>
  );
};

export default CustomersC;
