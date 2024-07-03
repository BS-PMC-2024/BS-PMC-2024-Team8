import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import axios from 'axios';

// forgot password component
const ForgotPassword = () => {
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // function to generate random code
    function generateRandomCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|;:<>,.?/~';
        let code = '';
        const codeLength = 6;
      
        for (let i = 0; i < codeLength; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters.charAt(randomIndex);
        }
      
        return code;
    }
    
    // function to send confirmation code
    const handleSendConfirmationCode = async(e) => {
        e.preventDefault();
        let user = null;
        try{
            console.log(email);
            user = await axios.get(`http://localhost:6500/${email}`);
        }
        catch(error){
            alert('User not found');
            console.error('Error fetching user data: ' , error);
        }
        if(user){
            e.preventDefault();
            emailjs.init("98g7Qzscyfz-S-J7p");
            const serviceId = "service_lxiaq84";
            const templateId = "template_en7libv";
            const generatedCode = generateRandomCode();
            setConfirmationCode(generatedCode);
            emailjs.send(serviceId, templateId, {
                email: email,
                code: generatedCode
            });
            alert('Confirmation code sent. Please check your email.');
        }
    }

    // function to check if password contains symbols
    const passwordContainsSymbols = (password) => {
        const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', ';', ':', "'", '"', '\\', '|', ',', '.', '<', '>', '/', '?'];
        return symbols.some(symbol => password.includes(symbol));
    };

    // function to check if password contains numbers
    const passwordContainsNumbers = (password) => {
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        return numbers.some(number => password.includes(number));
    };

    // function to handle sign in
    const handleSignIn = async (e) => {
        e.preventDefault();
        if (code === confirmationCode) {
            alert('Confirmation code verified');
            try {
                if (password.length < 8) return alert("Password must be at least 8 characters long.");
                if (!passwordContainsSymbols(password)) return alert("Password must contain at least one symbol.");
                if (!passwordContainsNumbers(password)) return alert("Password must contain numbers.");
    
                const user = {
                    email: email,
                    password: password
                };
    
                const response = await axios.put(`http://localhost:6500/user/${email}`, user);
                alert('Password updated successfully');
                navigate('/');
            } catch (error) {
                console.error('Error updating password: ', error);
            }
        } else {
            alert('Code is incorrect');
        }
    }

    // function to handle change on input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'code') {
            setCode(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    }

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            width: '100vw', 
            backgroundColor: '#222222' 
        }}>
            <div style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleSendConfirmationCode} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <input type="text" placeholder='Enter your email' onChange={handleChange} name='email' style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }} />
                    <button type="submit" style={{ padding: '0.5rem 1rem' }}>Send Confirmation Code</button>
                </form>
            </div>
            <div>
                <form onSubmit={handleSignIn} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <input type="text" placeholder='Enter confirmation code' onChange={handleChange} name='code' style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }} />
                    <input type="password" placeholder='Enter your new password' onChange={handleChange} name='password' style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }} />
                    <button type="submit" style={{ padding: '0.5rem 1rem' }}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
