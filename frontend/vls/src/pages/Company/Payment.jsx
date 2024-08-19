import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, Typography } from '@mui/material';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import emailjs from 'emailjs-com';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Payment = () => {
  const query = useQuery();
  const name = query.get('name');
  const phone = query.get('phone');
  const mail = query.get('mail');
  const debt = query.get('debt');
  const age = query.get('age');
  const city = query.get('city');
  const cname = query.get('cname');
  const discount = query.get('discount');
  const via = query.get('via');
  const file = query.get('file');
  const initialOptions = {
    clientId: "AUw64R1RHWdRKv_e7P92hTsbT9gA8L5HZVFjhG",
    currency: "USD",
    intent: "capture",
};
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
    date: '',
    cname: '',
    age: '',
    city: '',
    discount: '',
    via: '',
    file: ''
  });

  useEffect(() => {
    const now = new Date();
    const formattedDate = format(now, 'dd/MM/yyyy');
    let debtValue = debt ? parseFloat(debt) : 0;
    let discountValue = 0;
    if (discount && discount.endsWith('%')) {
      discountValue = parseFloat(discount) / 100;
    }
    const finalDebt = debtValue - (debtValue * discountValue);
    setPaymentData({
      name: name || '',
      phone: phone || '',
      mail: mail || '',
      cname: cname || '',
      age: age || '',
      city: city || '',
      discount: discount || '',
      via: via || '',
      debt: finalDebt,
      date: formattedDate,
      expiry_date: '',
      file: file
    });
  }, [name, phone, mail, debt, age, city, cname, discount, via]);

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
      email: paymentData.mail,
      code: generatedCode(),
      name: paymentData.name,
      debt: paymentData.debt,
      company: paymentData.cname,
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
      expiry_date: date ? format(date, 'dd/MM/yyyy') : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    if (!paymentData.card_number || !paymentData.expiry_date || !paymentData.cvv || !paymentData.id) {
      toast.error(`Please fill in all required fields.`, {
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

    if (paymentData.card_number.length !== 16) {
      toast.error(`Card number must be 16 digits.`, {
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

    if (paymentData.cvv.length !== 3) {
      toast.error(`CVV must be 3 digits.`, {
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

    if (paymentData.id.length !== 9) {
      toast.error(`ID must be 9 digits.`, {
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

    if (new Date(paymentData.expiry_date) < new Date()) {
      toast.error(`Invalid expiry date.`, {
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

    try {
      console.log(paymentData);
      const res = await axios.post('http://localhost:6500/addTransaction', paymentData);
      console.log(res);
      if (res.status === 200) {
        toast.success(`Payment Successful`, {
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
        await handleSendConfirmation();
      }
    } catch (err) {
      toast.error(`Payment Failed: ${err}`, {
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
      console.log(err);
    }
  };

  const maxPayments = paymentData.debt > 5000 ? 24 : 12;

  return (
    <>
    <ToastContainer />
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
            selected={paymentData.expiry_date ? parse(paymentData.expiry_date, 'dd/MM/yyyy', new Date()) : null}
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
        <PayPalScriptProvider style ={{marginTop:'10px'}} options={initialOptions}>
            <PayPalButtons 
                style={{ layout: "horizontal" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: paymentData.debt,
                      },
                    }],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    alert('Payment Successful');
                    handleSendConfirmation();
                  });
                }}
                onError={(err) => {
                  console.error('PayPal Checkout onError', err);
                  alert('Payment Failed');
                }}
            />
        </PayPalScriptProvider>
      </form>
    </Box>
    </>
  );
};

export default Payment;
