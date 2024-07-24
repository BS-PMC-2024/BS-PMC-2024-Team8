import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, Typography } from '@mui/material';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import emailjs from 'emailjs-com';

const Payment = () => {
  const { name, phone, mail, debt, age, city, cname, discount, via } = useParams();
  const [code, setCode] = useState('');
  const [paymentData, setPaymentData] = useState({
    name: '',
    phone: '',
    mail: '',
    debt: 0,
    card_number: '',
    expiry_date: '',
    cvv: '',
    id: '',
    amountPayments: 1,
    date: ''
  });
  useEffect(() => {
    const now = new Date();
    const formattedDate = format(now, 'dd/MM/yyyy');
    setPaymentData({
      ...paymentData,
      name,
      phone,
      mail,
      cname,
      age,
      city,
      discount,
      via,
      debt: parseFloat(debt),
      date: formattedDate
    });
  }, [name, phone, mail, debt]);

  function generateRandomCode() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      const codeLength = 20;
    
      for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
      }
      return code;
  }
  
  const handleSendConfirmation = () => {
          emailjs.init("98g7Qzscyfz-S-J7p");
          const serviceId = "service_lxiaq84";
          const templateId = "template_kzggrep";
          const generatedCode = generateRandomCode();
          emailjs.send(serviceId, templateId, {
              email: mail,
              code: generatedCode,
              name: name,
              debt: debt,
              company:cname,
              date: paymentData.date
          });
      }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setPaymentData({
      ...paymentData,
      expiry_date: format(date, 'dd/MM/yyyy')
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    if (!paymentData.card_number || !paymentData.expiry_date || !paymentData.cvv || !paymentData.id) {
      alert('Please fill in all required fields.');
      return;
    }

    if (paymentData.card_number.length !== 16) {
      alert('Card number must be 16 digits.');
      return;
    }

    if (paymentData.cvv.length !== 3) {
      alert('CVV must be 3 digits.');
      return;
    }

    if (paymentData.id.length !== 9) {
      alert('ID must be 9 digits.');
      return;
    }

    if (new Date(paymentData.expiry_date) < new Date()) {
      alert('Invalid expiry date.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:6500/addTransaction', paymentData);
      if (res.status === 200) {
        alert('Payment Successful');
      }
    } catch (err) {
      alert('Payment Failed: ' + err);
      console.log(err);
    }
    handleSendConfirmation();
  };

  const maxPayments = paymentData.debt > 5000 ? 24 : 12;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Payment Information</Typography>
      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '0.2%', opacity: '85%' }}>
        <TextField
          label="Name"
          name="name"
          value={paymentData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Phone"
          name="phone"
          value={paymentData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Email"
          name="mail"
          value={paymentData.mail}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Debt"
          name="debt"
          value={paymentData.debt}
          onChange={handleChange}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Card Number"
          name="card_number"
          value={paymentData.card_number}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="text"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Expiry Date</InputLabel>
          <DatePicker
            selected={paymentData.expiry_date ? new Date(paymentData.expiry_date) : null}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            customInput={<TextField fullWidth margin="normal" />}
          />
        </FormControl>
        <TextField
          label="CVV"
          name="cvv"
          value={paymentData.cvv}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="text"
        />
        <TextField
          label="ID"
          name="id"
          value={paymentData.id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="text"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Amount of Payments</InputLabel>
          <Select
            label="Amount of Payments"
            name="amountPayments"
            value={paymentData.amountPayments}
            onChange={handleChange}
          >
            {[...Array(maxPayments)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginBottom: '10px' }}>
          Submit Payment
        </Button>
      </form>
    </Box>
  );
};

export default Payment;
