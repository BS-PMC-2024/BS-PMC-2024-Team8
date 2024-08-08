import React, { useEffect, useState } from 'react';
import Header from './componants/Header';
import './stylesAdmin.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Sidebar from './componants/sideBar';
import emailjs from '@emailjs/browser';


import { TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';

function Contact() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [description, setDescription] = useState("");
  const [cnames, setCnames] = useState({});
  const [selectedCompany, setSelectedCompany] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const checkAdminPermission = async () => {
      const email = Cookies.get('email');

      if (!email) {
        navigate('/', { replace: true });
        return;
      }
      try {
        const response = await axios.post('http://localhost:6500/check-permission', { email });

        if (!response.data.permission === "admin") {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error checking admin permission:', error);
        navigate('/', { replace: true });
      }
    };
    checkAdminPermission();
  }, [navigate]);

  useEffect(() => {
    emailjs.init("bVId8LXlgw6L9ZnIt");
  }, []);

  useEffect(() => {
    setSelectedCompany(selectedCompany);
    setUserEmail(userEmail);
  }, [selectedCompany]);

  useEffect(() => {
    const getData = async () => {
      try {
        const email = Cookies.get('email');
        const response = await axios.get(process.env.SERVERENDPOINT+`/${email}`);
        const user = response.data;
        setName(user.data.full_name);
      } catch (error) {
        console.error("couldn't find email", error);
      }
    };
    getData();
  }, []);

  const initEmailField = async () => {
    const fillEmailList = async () => {
      try {
        const response = await axios.get(`http://localhost:6500/allusers`);
        const users = response.data.users;
        const cNames = {};
        cNames["None"] = "None";
        for (const user of users) {
          const companyName = user.company;
          const email = user.email;
          if (!cNames[companyName]) {
            cNames[companyName] = [];
            
          }
          cNames[companyName].push(email);
        }
        setCnames(cNames);
      } catch (error) {
        console.error("couldn't find users", error);
      }
    };
    fillEmailList();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^05[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      return;
    }
    if(userEmail === "N") 
    {
      setEmailError("Please chose a company you want to send Email to")
      return;
    }
    setEmailError("");
    const serviceId = "bstorecontact";
    const templateId = "template_n389dr4";
    try {
      await emailjs.send(serviceId, templateId, {
      name: name,
      email: userEmail,
      phone: phone,
      description: description,
      });
      alert("Email successfully sent. Check your inbox.");
    } catch (error) {
      alert("Failed to send email. Please try again.");
    }
  };

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
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
    } else if (name === "email") {
      setUserEmail(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    console.log("in handle email")
    console.log(e.target.value)
    setSelectedCompany(value);
    setUserEmail(cnames[value][0]);

    if(value !== "None"){ setEmailError("");}
    else{setEmailError("Please choose a company you want to send Email to");}
  };

  useEffect(() => {
    initEmailField();
  }, []);

  return (
    <div className='grid-container' data-testid='contact'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className='main-container' style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={handleSubmit} style={{ background: '#263043', borderRadius: '0.5%', borderColor: 'rgba(5,66,123,255)', padding: '50px',  maxWidth: '100%', width: '80%',height: '90%',  margin: '0 auto' }}>
          <div className='form-group' style={{ marginBottom: '40px', textAlign: 'center', width:'320px' }}>
            <TextField
              label="Your Name"
              variant="outlined"
              id="name"
              name="name"
              value={name}
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
              sx={{ backgroundColor: '#FFFFFF'}}
            />
            {phoneError && (<div className="error-message" style={{color: 'red', textAlign: 'center' }}>{phoneError}</div>)}
          </div>
               
          <div className='form-group' style={{ marginBottom: '40px', textAlign: 'center', width:'320px' }}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel id="company-label" style={{ color: '#9e9ea4', fontWeight: 'bold' }} >Company</InputLabel>
              <Select
                labelId="company-label"
                id="email"
                name="email"
                value={selectedCompany}
                onChange={handleEmailChange}
                label="Company"
                error={!!emailError}

                sx={{ backgroundColor: '#FFFFFF',
                  fontSize: '20px' // Increase the font size here
                }}
              >
                <MenuItem value="None"><em></em></MenuItem>
                {Object.keys(cnames).map((company) => (
                  <MenuItem key={company} value={company}>
                    {company}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText  style={{ color: '#9e9ea4', fontWeight: 'bold' }}>Select a company to send email to</FormHelperText>
            </FormControl>
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
              
              rows={10}  
              InputProps={{
                style: { minHeight: '300px',width:'550px' } 
              }}
              InputLabelProps={{
                style: { fontWeight: 'bold', color: '#9e9ea4' }  
              }}
              sx={{ backgroundColor: '#FFFFFF' }}
            />
            {emailError && (<div className="error-message" style={{color: 'red', textAlign: 'center' }}>{emailError}</div>)}
          </div>
          <Button type='submit' variant="contained" color="primary" fullWidth data-testid='button'>
            Send Email
          </Button>
        </form> 
      </main>
    </div>
  );
}

export default Contact;