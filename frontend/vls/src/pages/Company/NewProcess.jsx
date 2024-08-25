import React, { useState } from 'react';
import Header from '../Admin/componants/Header';
import Sidebar from '../Admin/componants/sideBar';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Paper } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import video from '../../assets/video.mp4'; 
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewProcess = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [discount, setDiscount] = useState('10%');
  const [communication, setCommunication] = useState({
    email: false,
    sms: false
  });
  const [strategy, setStrategy] = useState('');
  const [videoVisible, setVideoVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [company, setCompany] = useState(null);
  const [sector, setSector] = useState(null);
  const  navigate  = useNavigate();
  useEffect(() => {
    const checkCompanyPermission = async () => {
      const email = Cookies.get('email');

      if (!email) {
        navigate('/', { replace: true });
        return;
      }
      try {
        const response = await axios.post('http://localhost:6500/check-permission', { email });
        if (response.data.data.premission !== "company") {
          navigate('/', { replace: true });
        }
        else
        {
          setCompany(response.data.data.company);
          setSector(response.data.data.sector);
        }
      } catch (error) {
        console.error('Error checking admin permission:', error);
        navigate('/', { replace: true });
      }
    };
    checkCompanyPermission();
  }, [navigate]);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  const handleCommunicationChange = (e) => {
    setCommunication({
      ...communication,
      [e.target.name]: e.target.checked
    });
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleStrategyChange = (e) => {
    setStrategy(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error(`Please select a file`, {
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
      return;
    }
    if(file.name.split('.')[1] !== 'xlsx')
    {
      toast.error(`Please select a excel file'`, {
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
      return;
    }
    if (!discount) {
      toast.error(`Please select a discount'`, {
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
      return;
    }
    if (!strategy) {
      toast.error(`Please select a strategy'`, {
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
    if (!communication.email && !communication.sms) 
      {
        toast.error(`Please select a communication'`, {
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
        return;
      }      
    const formData = new FormData();
    formData.append('file', file);
    formData.append('discount', discount);
    formData.append('communication', JSON.stringify(communication));
    formData.append('strategy', strategy);
    formData.append('cname', company);
    formData.append('status', 'opened');
    formData.append('moneyC', '0');
    formData.append('peopleC', '0');
    formData.append('peopleR', 'none');
    formData.append('sector', sector);
    formData.append('date', new Date().toLocaleDateString('en-GB'));
    try {
      const response = await axios.post('http://localhost:6500/addprocess', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setFile(null);
        setDiscount('10%');
        setCommunication({
          email: false,
          sms: false
        });
        setStrategy('');
        setTimeout(() => {
          toast.success(`File uploaded successfully'`, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Slide,
          });}, 1000);
      } 
      console.log(response);

    }
    catch (error) {
      if (error.response && error.response.data) {
        // Custom error message from backend
        toast.error(`File upload failed: ${error.response.data.message}'`, {
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
    }
  };

  const handleClickVideo = () => {
    setVideoVisible(true);
  };

  const handleCloseVideo = () => {
    setVideoVisible(false);
  };

    return (
      <>
        <ToastContainer />
        <div className='grid-container'>
          <Header OpenSidebar={OpenSidebar} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          <h1 style={{fontSize:'22px',marginLeft:'10px'}}>NewProcess </h1>
          <div>
            <Button onClick={handleClickVideo}variant="contained" color="primary" style={{ position: 'absolute', right: '20px', top: '90px' }}>
              Instruction Video
            </Button>
            <Dialog 
              open={videoVisible} 
              onClose={handleCloseVideo} 
              maxWidth={false} 
              fullWidth
              PaperProps={{
                style: {
                  width: '90%', // Adjust the width as needed
                  maxWidth: 'none',
                },
              }}
            >
              <DialogContent style={{ backgroundColor: 'black', padding: '0' }}>
                <video width="100%" controls style={{ color: 'white', display: 'block', margin: 'auto' }}>
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </DialogContent>
              <DialogActions style={{ backgroundColor: 'black' }}>
                <Button  onClick={handleCloseVideo} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Paper elevation={3} style={{ backgroundColor:'#253041',padding: '20px', marginTop: '50px', maxWidth: '600px' }}>
              <form  style= {{backgroundColor:'white'}} onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px', marginTop:'20px' }}>
                  <FormLabel title = 'Dropbox File Upload' component="legend">Dropbox File Upload</FormLabel>
                  <TextField
                    type="file"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ style: { background: 'white' } }}
                    onChange={handleFileChange}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Discount Preferences</FormLabel>
                    <RadioGroup value={discount} onChange={handleDiscountChange}>
                      <FormControlLabel value="10%" control={<Radio />} label="10%" />
                      <FormControlLabel value="15%" control={<Radio />} label="15%" />
                      <FormControlLabel value="20%" control={<Radio />} label="20%" />
                    </RadioGroup>
                  </FormControl>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Communication Preferences</FormLabel>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={communication.email}
                          onChange={handleCommunicationChange}
                          name="email"
                        />
                      }
                      label="Email"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={communication.sms}
                          onChange={handleCommunicationChange}
                          name="sms"
                        />
                      }
                      label="SMS"
                    />
                  </FormControl>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Strategies</FormLabel>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={strategy === '1'}
                          onChange={handleStrategyChange}
                          value="1"
                        />
                      }
                      label="Focus on the bigger debt"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={strategy === '2'}
                          onChange={handleStrategyChange}
                          value="2"
                        />
                      }
                      label="Focus on the latest depts"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={strategy === '3'}
                          onChange={handleStrategyChange}
                          value="3"
                        />
                      }
                      label="Focus on the youngest debtors"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={strategy === '4'}
                          onChange={handleStrategyChange}
                          value="4"
                        />
                      }
                      label="Focus on the oldest debtors"
                    />
                  </FormControl>
                </div>

                <Button style = {{marginBottom:'20px'}} variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </form>
            </Paper>
          </div>
        </div>
        </>
      );
};
export default NewProcess;
