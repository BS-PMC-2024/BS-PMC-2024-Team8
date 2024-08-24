import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

// forgot password component
const ForgotPassword = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // function to generate random code
  function generateRandomCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|;:<>,.?/~";
    let code = "";
    const codeLength = 6;

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }

  // function to send confirmation code
  const handleSendConfirmationCode = async (e) => {
    e.preventDefault();
    let user = null;
    try {
      console.log(email);
      user = await axios.get(`http://localhost:6500/${email}`);
    } catch (error) {
      toast.error('User not found', {
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
      console.error("Error fetching user data: ", error);
    }
    if (user) {
      e.preventDefault();
      emailjs.init("98g7Qzscyfz-S-J7p");
      const serviceId = "service_lxiaq84";
      const templateId = "template_en7libv";
      const generatedCode = generateRandomCode();
      setConfirmationCode(generatedCode);
      emailjs.send(serviceId, templateId, {
        email: email,
        code: generatedCode,
      });
      toast.info('Confirmation code sent. Please check your email.', {
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
  };

  // function to check if password contains symbols
  const passwordContainsSymbols = (password) => {
    const symbols = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "_",
      "+",
      "-",
      "=",
      "[",
      "]",
      "{",
      "}",
      ";",
      ":",
      "'",
      '"',
      "\\",
      "|",
      ",",
      ".",
      "<",
      ">",
      "/",
      "?",
    ];
    return symbols.some((symbol) => password.includes(symbol));
  };

  // function to check if password contains numbers
  const passwordContainsNumbers = (password) => {
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return numbers.some((number) => password.includes(number));
  };

  // function to handle sign in
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (code === confirmationCode) {
      toast.success('Confirmation code verified', {
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
      try {
        if (password.length < 8)
          return toast.error('Password must be at least 8 characters long.', {
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
        if (!passwordContainsSymbols(password))
          return toast.error('Password must contain at least one symbol.', {
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
        if (!passwordContainsNumbers(password))
          return toast.error('Password must contain numbers.', {
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

        const user = {
          email: email,
          password: password,
        };

        const response = await axios.put(
          `http://localhost:6500/user/${email}`,
          user
        );
        toast.success('Password updated successfully', {
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
        navigate("/");
      } catch (error) {
        console.error("Error updating password: ", error);
      }
    } else {
      toast.error('Code is incorrect', {
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
  };

  // function to handle change on input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "code") {
      setCode(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <>
    <ToastContainer />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#222222",
      }}
    >
      <form
        onSubmit={handleSendConfirmationCode}
        style={{
          backgroundColor: "white",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <input
          type="text"
          placeholder="Enter your email"
          onChange={handleChange}
          name="email"
          style={{ marginBottom: "1.5rem", padding: "1rem", width: "100%" }}
        />
        <button
          type="submit"
          style={{ padding: "0.75rem 1.5rem", marginBottom: "1.5rem" }}
        >
          Send Confirmation Code
        </button>
        <input
          type="text"
          placeholder="Enter confirmation code"
          onChange={handleChange}
          name="code"
          style={{ marginBottom: "1.5rem", padding: "1rem", width: "100%" }}
        />
        <input
          type="password"
          placeholder="Enter your new password"
          onChange={handleChange}
          name="password"
          style={{ marginBottom: "1.5rem", padding: "1rem", width: "100%" }}
        />
        <button
          type="submit"
          onClick={handleSignIn}
          style={{ padding: "0.75rem 1.5rem" }}
        >
          Submit
        </button>
      </form>
    </div>
    </>
  );
};

export default ForgotPassword;
