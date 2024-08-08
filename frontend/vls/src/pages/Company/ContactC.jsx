import React, { useEffect, useState } from 'react';
import Header from '../Admin/componants/Header';
import Sidebar from '../Admin/componants/sideBar';
import '../Admin/stylesAdmin.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';


import { TextField, Button } from '@mui/material';

function ContactC() {
  const navigate = useNavigate();
  const [compName, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [AdminEmail, setEmail] = useState({});
  const [Admin, setAdmin] = useState('');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  

  useEffect(() => {
    emailjs.init("bVId8LXlgw6L9ZnIt");
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const email = Cookies.get('email');
        const response = await axios.get(`http://localhost:6500/${email}`);
        const user = response.data;
        setName(user.data.company);
      } catch (error) {
        console.error("couldn't find email", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const response = await axios.get(`http://localhost:6500/allusers/Admin`);
        const admin = response.data.admin;
        console.log('Admin users:', admin[0]);
        if (admin.length > 0) {
          setAdmin(admin[0].full_name || "Admin not found");
          setEmail(admin[0].email || "NOTworkingEMAIL");
        } else {
          setAdmin("Admin not found");
          setEmail("NOTworkingEMAIL");
        }
      } catch (error) {
        console.error("couldn't find admin", error);
        setAdmin("Admin not found");
        setEmail("NOTworkingEMAIL");
      }
    };
    getAdminData();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^05[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      return;
    }
    if(Admin === "Admin not found"){
      setError("cant send email. Admin not found");
      return; 
    }
    setError("");
    const serviceId = "bstorecontact";
    const templateId = "template_n389dr4";
    try {
      await emailjs.send(serviceId, templateId, {
      name: compName,
      email: AdminEmail,
      phone: phone,
      description: description,
      });
      alert("Email successfully sent. Check your inbox.");
    } catch (error) {
      alert("Failed to send email. Please try again.");
    }
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "phone") {
      const phoneRegex = /^05[0-9]{8}$/;
      if (!phoneRegex.test(value)) {
        setPhoneError("Invalid. enter 10 digit number starting with 05");
      }else{
        setPhoneError('');
      }
      setPhone(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  return (
    <div className='grid-container' data-testid='ContactC'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className='main-container' style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={handleSubmit} style={{ background: '#263043', borderRadius: '0.5%', borderColor: 'rgba(5,66,123,255)', padding: '20px',   maxWidth: '100%', width: '90%',height: '100%',  margin: '0 auto'}}>
          <div className='form-group' style={{ marginBottom: '40px', textAlign: 'center', width:'320px' }}>
            <TextField
              label="Your Name"
              variant="outlined"
              id="name"
              name="name"
              value={compName}
              onChange={handleInputChange}
              required
              fullWidth
              InputLabelProps={{ // for the label
                style: { color: '#9e9ea4', fontWeight: 'bold' } // Adjust color and font weight here
              }}
              InputProps={{ // Center text inside the input field
                style: { textAlign: 'center' },
                inputProps: { style: { textAlign: 'center', fontSize: '20px' } } // Center text inside the input element
              }}
              sx={{ backgroundColor: '#FFFFFF' }} // style for the material component
            />
          </div>
          <div className='form-group' style={{ marginBottom: '40px', textAlign: 'center', width:'320px' }}>
            <TextField
              label="Your Phone"
              variant="outlined"
              id="phone"
              name="phone"
              value={phone}
              onChange={handleInputChange}
              required
              fullWidth
              error={!!phoneError}

              InputLabelProps={{ // for the label
                style: { color: '#9e9ea4', fontWeight: 'bold' } // Adjust color and font weight here
              }}
              InputProps={{ // Center text inside the input field
                style: { textAlign: 'center' },
                inputProps: { style: { textAlign: 'center', fontSize: '20px' } } // Center text inside the input element
              }}
              sx={{ backgroundColor: '#FFFFFF', textAlign:'center'}}
            />
            {phoneError && (<div className="error-message" style={{color: 'red', textAlign: 'center' }}>{phoneError}</div>)}
          </div>

          <div className='form-group' style={{ marginBottom: '40px', textAlign: 'center', width:'320px' }}>
            <TextField
              label="Admin name"
              variant="outlined"
              id="email"
              name="email"
              value={Admin || ''}
              required
              fullWidth
              InputProps={{
                readOnly: true, // Make the field read-only
                style: { textAlign: 'center' },
                inputProps: { style: { textAlign: 'center', fontSize: '20px' } } // Center text inside the input element
              }}
              InputLabelProps={{ // for the label
                style: { color: '#9e9ea4', fontWeight: 'bold' } // Adjust color and font weight here
              }}
              sx={{ backgroundColor: '#FFFFFF'}}
            />
          </div>

          <div className='form-group' style={{ marginBottom: '40px', textAlign: 'center'}}>
            <TextField
              label="Message: "
              variant="outlined"
              id="description"
              name="description"
              value={description}
              onChange={handleInputChange}
              required
              fullWidth
              multiline
              rows={10}  // Adjust the number of rows as needed
              InputProps={{
                style: { minHeight: '300px',width:'550px' }  // Set a minimum height for the input
              }}
              InputLabelProps={{
                style: { fontWeight: 'bold', color: '#9e9ea4' }  // Adjust label styles as needed
              }}
              sx={{ backgroundColor: '#FFFFFF' }}
            />
            {error && (<div className="error-message" style={{color: 'red', textAlign: 'center' }}>{error}</div>)}
          </div>
          
          <Button type='submit' variant="contained" color="primary" fullWidth data-testid='button'>
            Send Email
          </Button>
        </form> 
      </main>
    </div>
  );
}

export default ContactC;